import Navigator from "@/components/Navigator";
import OrderList from "@/components/OrderList";

export default function OrdersPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-gray-100">
      <OrderList />
      <Navigator />
    </main>
  );
}
