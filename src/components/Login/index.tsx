"use client";

import { FC, useEffect, useState } from "react";
import Image from "next/image";

const Login: FC = () => {
  const [initDataUnsafe, setInitDataUnsafe] = useState<any | null>(null);
  useEffect(() => {
    if ((window as any)?.Telegram?.WebApp?.initDataUnsafe) {
      console.log((window as any).Telegram?.WebApp?.initDataUnsafe);
      setInitDataUnsafe((window as any)?.Telegram?.WebApp?.initDataUnsafe);
    }
  }, []);

  return (
    <div>
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

      <script
        async
        src="https://telegram.org/js/telegram-widget.js?22"
        data-telegram-login="alpha_bot"
        data-size="large"
        data-auth-url="https://brc20-inscribe-bot.vercel.app/"
      ></script>
    </div>
  );
};

export default Login;
