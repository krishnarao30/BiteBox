import { useCreateMyRestaurant, useGetMyRestaurant, useGetMyRestaurantOrders, useUpdateMyRestaurant } from "@/api/MyRestaurantApi";
import OrderItemCard from "@/components/OrderItemCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManageRestaurantForm from "@/forms/manage-restaurant-forms/ManageRestaurantForm";

const ManageRestaurantPage = () => {
  const {createRestaurant, isLoading: isCreateLoading} = useCreateMyRestaurant();
  const {restaurant} = useGetMyRestaurant();
  const { updateRestaurant, isLoading: isUpdateLoading} = useUpdateMyRestaurant();

  const {orders} = useGetMyRestaurantOrders();

  const isEditing = !!restaurant;

 // Sort orders by createdAt date in descending order
 const sortedOrders = orders?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <Tabs defaultValue="orders">
      <TabsList>
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="manage-restaurant">Manage Restaurant</TabsTrigger>
      </TabsList>
      <TabsContent value="orders" className="space-y-5 bg-gray-50 pg-10 rounded-lg">
        <h2 className="text-2xl font-bold">{sortedOrders?.length} active orders</h2>
        {sortedOrders?.map((order) => (
          <OrderItemCard key={order._id} order={order} />
          ))}
      </TabsContent>

      <TabsContent value="manage-restaurant">
      <ManageRestaurantForm 
    restaurant = {restaurant} 
    onSave={isEditing ? updateRestaurant : createRestaurant} 
    isLoading={isCreateLoading || isUpdateLoading}/>
      </TabsContent>
    </Tabs>
    
  );

};

export default ManageRestaurantPage;