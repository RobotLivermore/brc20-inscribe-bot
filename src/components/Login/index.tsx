"use client";

import { FC, useEffect, useState } from "react";
import Image from "next/image";
import WalletManager from "../WalletManager";
import LanguageChanger from '@/components/LanguageChanger';

const Login: FC = () => {
  const [initDataUnsafe, setInitDataUnsafe] = useState<any | null>(null);
  useEffect(() => {
    if ((window as any)?.Telegram?.WebApp?.initDataUnsafe) {
      console.log((window as any).Telegram?.WebApp?.initDataUnsafe);
      setInitDataUnsafe((window as any)?.Telegram?.WebApp?.initDataUnsafe);
    }
  }, []);

  return (
    <>
      <div className="fixed flex justify-between top-0 left-0 right-0 py-2 h-16 px-4 w-full bg-white font-bold border-b border-black">
        {initDataUnsafe?.user && (
          <div className="flex justify-between py-2">
            {initDataUnsafe?.user?.photo_url ? (
              <Image src="/logo.png" width={24} height={24} alt="avatar" />
            ) : (
              <div className="rounded-full w-6 h-6 bg-blue-300 flex justify-center items-center text-white">
                {initDataUnsafe?.user?.first_name.slice(0, 1)}
              </div>
            )}
            <p className="text-center ml-1 font-bold">{`${initDataUnsafe?.user?.first_name}`}</p>
          </div>
        )}
        <LanguageChanger />
      </div>

      <WalletManager />
    </>
  );
};

export default Login;
