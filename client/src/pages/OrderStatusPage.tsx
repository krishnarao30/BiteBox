import { useGetMyOrders } from "@/api/OrderApi";
import OrderStatusDetail from "@/components/OrderStatusDetail";
import OrderStatusHeader from "@/components/OrderStatusHeader";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useEffect } from "react";
import { Order } from "@/types";

const OrderStatusPage = () => {
  const {orders, isLoading} = useGetMyOrders();

  useEffect(() => {
   const queryParams = new URLSearchParams(window.location.search);
   const paymentSuccess = queryParams.get("success") === "true";
   const restaurantId = queryParams.get("restaurantId");

   if (paymentSuccess && restaurantId) {
      localStorage.removeItem(`cartItems-${restaurantId}`);

      orders?.forEach((order: Order) => {
         order.cartItems.forEach(item => {
           localStorage.removeItem(`menuItem-${item.menuItemId}`);
         });
       });
      }
   }, [orders]);


  if(isLoading) {
    return "Loading...";
    }
 if(!orders || orders.length === 0) {
    return "No orders found";
 }

  // Sort orders by creation date in descending order
  const sortedOrders = orders.sort((a, b) => {
   return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
 });

 return (
    <div className="space-y-10">
       {sortedOrders.map((order) =>(
        <div className="space-y-10 bg-gray-50 p-10 rounded-lg">
            <OrderStatusHeader order={order} />
            <div className="grid gap-10 md:grid-cols-2">
               <OrderStatusDetail order={order} />
               <AspectRatio ratio={16 / 5}>
                  <img src={order.restaurant.imageUrl} className="rounded-md object-cover h-full w-full"
                  />
               </AspectRatio>
            </div>
        </div>
       ))} 
    </div>
 )

};

export default OrderStatusPage;