import { useState, useCallback, useEffect } from 'react'

export default function useOrders(ids: string[]) {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = useCallback(async () => {
    const resp = await fetch("/api/brc20/orders", {
      method: "POST",
      body: JSON.stringify({
        ids,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await resp.json();
    setOrders(data?.data || []);
  }, [ids]);

  useEffect(() => {
    if (ids.length > 0) {
      fetchOrders();
    }
  }, [ids, fetchOrders]);

  return {
    orders,
    updateOrders: fetchOrders,
  }
}