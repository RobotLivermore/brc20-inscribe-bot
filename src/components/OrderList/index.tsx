"use client";

import useLocalStorage from "@/hooks/useLocalstorage";
import React, { useMemo, useState } from "react";
import TaskDisplay from "./TaskDisplay";
// import useOrders from "./useOrders";
import WalletSelectModal from "./WalletSelectModal";

const OrderList: React.FC = () => {
  const [orderList] = useLocalStorage<any[]>("orderList", []);
  // const orderIds = useMemo(
  //   () =>
  //     orderList
  //       .filter((item) => Boolean(item.taskId))
  //       .map((item) => item.taskId),
  //   [orderList]
  // );

  // const { orders, updateOrders } = useOrders(orderIds);

  const [isWalletSelect, setIsWalletSelect] = useState(false);

  return (
    <div className="flex flex-col pt-8 w-full text-black">
      <div className="fixed top-0 left-0 right-0 py-2 px-4 w-full bg-white font-bold border-b border-gray-200">
        历史订单
      </div>

      {orderList
        .filter((item) => Boolean(item.taskId))
        .map((item, index) => (
          <TaskDisplay
            onOpenWallet={() => {
              setIsWalletSelect(true);
            }}
            key={index}
            taskId={item.taskId}
            inscriptionAddress={item.inscriptionAddress}
            fee={item.fee}
            status={item?.status || ""}
          />
        ))}
      <WalletSelectModal
        visible={isWalletSelect}
        onClose={() => setIsWalletSelect(false)}
      />
    </div>
  );
};

export default OrderList;
