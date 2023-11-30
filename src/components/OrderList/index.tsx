"use client";

import useLocalStorage from "@/hooks/useLocalstorage";
import React, { useState, useMemo } from "react";
import TaskDisplay from "./TaskDisplay";
import useOrders from "./useOrders";

const OrderList: React.FC = () => {
  const [orderList] = useLocalStorage<any[]>("orderList", []);
  const orderIds = useMemo(() => 
    orderList.filter((item) => Boolean(item.taskId)).map((item) => item.taskId)
  , [orderList]);

  const { orders, updateOrders } = useOrders(orderIds);
  console.log(orders)
  
  return (
    <div className="flex flex-col pt-8 w-full">
      <div className="fixed top-0 left-0 right-0 py-2 px-4 w-full bg-white font-bold border-b border-gray-200">
        历史订单
      </div>

      {orderList
        .filter((item) => Boolean(item.taskId))
        .map((item, index) => (
          <TaskDisplay
            key={index}
            taskId={item.taskId}
            inscriptionAddress={item.inscriptionAddress}
            fee={item.fee}
            status={orders?.find((order) => order.id === item.taskId)?.status || ''}
          />
        ))}
    </div>
  );
};

export default OrderList;
