import Image from "next/image";
import Link from "next/link";

const Navigator: React.FC = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-14 bg-black text-white grid justify-center" style={{
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))"
    }}>
      <Link href="/" className="flex flex-col justify-center items-center pt-2">
        <Image src="/assets/icon/outline/home.svg" width={20} height={20} alt="inscribe" className=" invert" />
        <span className="text-center text-xs mt-1">Home</span>
      </Link>
      <Link href="/inscribe" className="flex flex-col justify-center items-center pt-2">
        <Image src="/assets/icon/outline/inscribe.svg" width={20} height={20} alt="inscribe" className=" invert" />
        <span className="text-center text-xs mt-1">Inscribe</span>
      </Link>
      <Link
        href="/orders"
        className="flex flex-col justify-center items-center pt-2"
      >
        <Image src="/assets/icon/outline/orders.svg" width={20} height={20} alt="orders" className=" invert" />
        <span className="text-center text-xs mt-1">Orders</span>
      </Link>
    </div>
  );
};

export default Navigator;
