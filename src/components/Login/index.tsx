"use client";

import { FC, useEffect, useState } from "react";

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
          <p className="text-center">{`Hi, ${initDataUnsafe?.user?.first_name}`}</p>
        </div>
      )}
      <script async src="https://telegram.org/js/telegram-widget.js?22" data-telegram-login="alpha_bot" data-size="large" data-auth-url="https://brc20-inscribe-bot.vercel.app/"></script>
    </div>
  );
};

export default Login;
