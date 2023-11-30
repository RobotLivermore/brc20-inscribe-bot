import Image from "next/image";
import Link from "next/link";

const Navigator: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 bg-black text-white grid grid-cols-2 justify-center">
      <Link href="/" className="flex flex-col justify-center items-center pt-2">
        <Image src="/icon/inscribe.svg" width={20} height={20} alt="inscribe" className=" invert" />
        <span className="text-center text-xs mt-1">inscribe</span>
      </Link>
      <Link
        href="/orders"
        className="flex flex-col justify-center items-center pt-2"
      >
        <Image src="/icon/orders.svg" width={20} height={20} alt="orders" className=" invert" />
        <span className="text-center text-xs mt-1">orders</span>
      </Link>
    </div>
  );
};

export default Navigator;
