import { useCreateCheckoutSession } from "@/api/OrderApi";
import { useGetRestaurant } from "@/api/RestaurantApi";
import CheckoutButton from "@/components/CheckoutButton";
import MenuItems from "@/components/MenuItems";
import OrderSummary from "@/components/OrderSummary";
import RestaurantInfo from "@/components/RestaurantInfo";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardFooter } from "@/components/ui/card";
import { UserFormData } from "@/forms/user-profile-form/UserProfileForm";
import { MenuItem } from "@/types";
import { Utensils } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";


export type CartItem = {
    _id: string;
    name: string;
    price: number;
    quantity: number;
  };

const DetailPage = () => {
  const {restaurantId} = useParams();
  const {restaurant, isLoading} = useGetRestaurant(restaurantId);
  const { createCheckoutSession, isLoading: isCheckoutLoading} = useCreateCheckoutSession();

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedCartItems = localStorage.getItem(`cartItems-${restaurantId}`);
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });

  const [resetItemId, setResetItemId] = useState<string | null>(null);

  const addToCart = (menuItem: MenuItem, action: 'increment' | 'decrement') => {
    setCartItems((prevCartItems) => {
        // 1.Check if the item is already in the cart
            const existingCartItem = prevCartItems.find((cartItem)=> cartItem._id === menuItem._id);
            let updatedCartItems;

        // 2. if items is already in the cart, update the quantity
            if(existingCartItem) {
                updatedCartItems = prevCartItems.map((cartItem)=>
                     cartItem._id === menuItem._id 
                ? {...cartItem, quantity: action === 'increment' ? cartItem.quantity + 1 : cartItem.quantity - 1,} 
                : cartItem
            ).filter(cartItem => cartItem.quantity > 0); // Remove item if quantity is 0
        }
        // 3. if items is not in the cart, and action is increment, then add it as a new item 
        else if(action === 'increment') {
                updatedCartItems = [
                    ...prevCartItems, 
                    {
                        _id: menuItem._id,
                        name: menuItem.name,
                        price: menuItem.price,
                        quantity: 1,
                    },
                ];
            }

    //4. if action is decrement and item is not in the cart, then do nothing
        else {
            updatedCartItems = [...prevCartItems];
        }

        // we have stored the menu items in the state and state is just stored in javascript
        //and the user's browser so any time the app reloads the javascript is going to reload
        // and its goint to lose all the state
        localStorage.setItem(
            `cartItems-${restaurantId}`,
            JSON.stringify(updatedCartItems)
          );
            
            return updatedCartItems;
    });
  };

  const removeFromCart = (cartItem: CartItem) => {
        setCartItems((prevCartItems) => {
            const updatedCartItems = prevCartItems.filter(
                (item) => cartItem._id !== item._id
            );
            setResetItemId(cartItem._id); // Set resetItemId to trigger MenuItems reset
            setTimeout(() => setResetItemId(null), 0); // Reset resetItemId

            localStorage.setItem(
                `cartItems-${restaurantId}`,
                JSON.stringify(updatedCartItems)
              );

            return updatedCartItems;
        });
  };

  const onCheckout = async(userFormData: UserFormData) => {
    if(!restaurant) {
      return;
    }


    const checkoutData = {
      cartItems: cartItems.map((cartItem)=>({
        menuItemId: cartItem._id,
        name: cartItem.name,
        quantity: cartItem.quantity.toString(),
      })),
      restaurantId: restaurant._id,
      deliveryDetails: {
        name: userFormData.name,
        contactNumber: userFormData.contactNumber,
        addressLine1: userFormData.addressLine1,
        addressLine2: userFormData.addressLine2 as string, 
        city: userFormData.city,
        state: userFormData.state,
        country: userFormData.country,
        pincode: userFormData.pincode,
        email: userFormData.email as string,
      }
    };

    const data = await createCheckoutSession(checkoutData);
    window.location.href = data.url;
    
  };

  if (isLoading || !restaurant) {
    return "Loading...";
  }

  return (
    <div className="flex flex-col gap-10">
      <AspectRatio ratio={16 / 5}>
        <img
          src={restaurant.imageUrl}
          className="rounded-md object-cover h-full w-full shadow-lg"
        />
      </AspectRatio>
      <div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-32">
        <div className="flex flex-col gap-6">
            <RestaurantInfo restaurant={restaurant} />
            <div className="flex items-center space-x-2 text-2xl font-bold tracking-tight">
            <span>Menu</span>
            <Utensils className="text-customOrange-600 w-6 h-6" />
          </div>
            {restaurant.menuItems.map((menuItem) => (
            <MenuItems key={menuItem._id} menuItem={menuItem} addToCart={(menuItem, action) => addToCart(menuItem, action)} resetItemId={resetItemId}/>
          ))}
        </div>

        <div>
          <Card className="shadow-md rounded-lg">
            <OrderSummary restaurant={restaurant} cartItems={cartItems} removeFromCart={removeFromCart}/>
            <CardFooter>
              <CheckoutButton disabled={cartItems.length === 0} onCheckout={onCheckout} isLoading={isCheckoutLoading}/>
            </CardFooter>
          </Card>
        </div>  
        </div>
        </div>


// user has not added any item then the checkout button is disabled
        

    );

};

export default DetailPage;