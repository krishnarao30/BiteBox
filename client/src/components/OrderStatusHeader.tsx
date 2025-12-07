import { Order } from "@/types";
import { Progress } from "./ui/progress";
import { ORDER_STATUS } from "@/config/order-status-config";
import { useState, useEffect, useCallback } from 'react';


type Props = {
  order: Order;
}


const OrderStatusHeader = ({ order }: Props) => {

    const [remainingTime, setRemainingTime] = useState<string>('');
    const [deadline, setDeadline] = useState<number>(0);

    const calculateRemainingTime = (deadline: number) => {
        const now = new Date().getTime();
        const diff = deadline - now;

        if (diff <= 0) {
            return "Delivered";
        }

        const remainingMinutes = Math.floor(diff / 60000);
        const remainingHours = Math.floor(remainingMinutes / 60);
        const remainingMinutesAdjusted = remainingMinutes % 60;

        if (remainingHours > 0) {
            return `${remainingHours} hours and ${remainingMinutesAdjusted} minutes`;
        }
        return `${remainingMinutesAdjusted} minutes`;
    };

    const updateRemainingTime = useCallback(() => {
        setRemainingTime(calculateRemainingTime(deadline));
    }, [deadline]);

    useEffect(() => {
        if (order.status === 'delivered') {
        localStorage.removeItem(`deadline_${order._id}`);
        setRemainingTime("Delivered");
        return;
        }
        const fetchOrderDetails = async () => {
            try {
                // Calculate the initial deadline using restaurant's estimated delivery time
                const created = new Date(order.createdAt);
                const extraMinutes = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
                const estimatedDeliveryTime = order.restaurant.estimatedDeliveryTime + extraMinutes;
                created.setMinutes(created.getMinutes() + estimatedDeliveryTime);
                const calculatedDeadline = created.getTime();

                setDeadline(calculatedDeadline);
                localStorage.setItem(`deadline_${order._id}`, calculatedDeadline.toString());
            } catch (error) {
                console.error(error);
                setRemainingTime("Error fetching time");
            }
        };

        const storedDeadline = localStorage.getItem(`deadline_${order._id}`);
        if (storedDeadline) {
            setDeadline(parseInt(storedDeadline, 10));
        } else {
            fetchOrderDetails();
        }

        updateRemainingTime(); // Set initial time

        const intervalId = setInterval(() => {
            if (order.status === 'inProgress' || order.status === 'outForDelivery') {
                updateRemainingTime();
            }
        }, 60000); // Update every minute

        return () => clearInterval(intervalId); // Clean up interval on component unmount
    }, [order._id, order.createdAt, order.restaurant.estimatedDeliveryTime, updateRemainingTime, order.status]);



    const getOrderStatusInfo = () => {
        return ORDER_STATUS.find((o) => o.value === order.status) || ORDER_STATUS[0]
    }

    return (
        // we use fragment because if some components are at the same level and we return a single element only at a time
        <>
            <h1 className="text-4xl font-bold tracking-tighter flex flex-col gap-5 md:flex-row md:justify-between">
                <span> Order Status: {getOrderStatusInfo().label}</span>
                {/* <span> Arriving in: {remainingTime}</span> */}
                {(order.status === 'inProgress' || order.status === 'outForDelivery') && (
                    <span> Arriving in: {remainingTime}</span>
                )}
            </h1>

            <Progress className="animate-pulse" value={getOrderStatusInfo().progressValue} />

        </> 
    )
}

export default OrderStatusHeader;