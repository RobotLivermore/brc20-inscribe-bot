import Image from "next/image";
import Link from "next/link";

const Navigator: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 bg-black text-white grid grid-cols-3 justify-center">
      <Link href="/" className="flex flex-col justify-center items-center pt-2">
        <Image src="/icon/outline/home.svg" width={20} height={20} alt="inscribe" className=" invert" />
        <span className="text-center text-xs mt-1">Home</span>
      </Link>
      <Link href="/inscribe" className="flex flex-col justify-center items-center pt-2">
        <Image src="/icon/outline/inscribe.svg" width={20} height={20} alt="inscribe" className=" invert" />
        <span className="text-center text-xs mt-1">Inscribe</span>
      </Link>
      <Link
        href="/orders"
        className="flex flex-col justify-center items-center pt-2"
      >
        <Image src="/icon/outline/orders.svg" width={20} height={20} alt="orders" className=" invert" />
        <span className="text-center text-xs mt-1">Orders</span>
      </Link>
    </div>
  );
};

export default Navigator;
