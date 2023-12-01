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
      <script
        async
        src="https://telegram.org/js/telegram-widget.js?22"
        data-telegram-login="alpha_bot"
        data-size="large"
        data-onauth="onTelegramAuth(user)"
        data-request-access="write"
      ></script>
      <script type="text/javascript">
        {`function onTelegramAuth(user) {
          alert('Logged in as ' + user.first_name + ' ' + user.last_name + ' (' + user.id + (user.username ? ', @' + user.username : '') + ')');
        }`}
      </script>
    </div>
  );
};

export default Login;
