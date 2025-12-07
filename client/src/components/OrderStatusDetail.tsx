import { Order } from "@/types";
import { Separator } from "./ui/separator";

type Props = {
 order: Order; 
}

const OrderStatusDetail = ({order}: Props) => {

  return (
  <div className="space-y-5">
    <div className="flex flex-col">
    <div className="flex items-center">
    <span className="font-bold">Restaurant name:</span>
    <span className="font-normal ml-1">{order.restaurant.restaurantName}</span>
    </div>

    <span className="font-bold">Delivering to: </span>
        <span>{order.deliveryDetails.name}</span>
        <span>{order.deliveryDetails.addressLine1},  {order.deliveryDetails.addressLine2}, {order.deliveryDetails.city}, {order.deliveryDetails.state}, {order.deliveryDetails.country}-{order.deliveryDetails.pincode}</span>
    </div>
    <div className="flex flex-col">
        <span className="font-bold">Your Order</span>
        <ul>
            {order.cartItems.map((item) => (
                <li>  
                    {item.name} x {item.quantity}
                </li>
            ))}
        </ul>
    </div>
    <Separator />
    <div className="flex flex-col">
        <span className="font-bold ">Total</span>
        {order.totalAmount ? (
        <span>₹{(order.totalAmount / 100).toFixed(2)}</span>
    ) : (
        <span>Pending Payment</span>
    )}
    </div>
  </div>
  );
};

export default OrderStatusDetail;