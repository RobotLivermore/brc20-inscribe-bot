"use client";

import useLocalStorage from "@/hooks/useLocalstorage";
import React, { useState } from "react";
import TaskDisplay from "./TaskDisplay";
// import useOrders from "./useOrders";
// import WalletSelectModal from "./WalletSelectModal";

const OrderList: React.FC = () => {
  const [orderList] = useLocalStorage<any[]>("orderList", []);

  return (
    <div className="flex flex-col pt-8 pb-20 w-full text-black">
      {orderList
        .filter((item) => Boolean(item.taskId))
        .map((item, index) => (
          <TaskDisplay
            key={index}
            taskId={item.taskId}
            inscriptionAddress={item.inscriptionAddress}
            fee={item.fee}
            status={item?.status || ""}
            createdAt={item.createdAt}
            secret={item.secret}
          />
        ))}
    </div>
  );
};

export default OrderList;
