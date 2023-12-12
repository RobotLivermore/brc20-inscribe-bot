import { useState, useEffect } from "react";

const useTgInitData = () => {
  const [initDataUnsafe, setInitDataUnsafe] = useState<any | null>(null);
  useEffect(() => {
    if ((window as any)?.Telegram?.WebApp?.initDataUnsafe) {
      console.log((window as any).Telegram?.WebApp?.initDataUnsafe);
      setInitDataUnsafe((window as any)?.Telegram?.WebApp?.initDataUnsafe);
      (window as any)?.Telegram.WebApp.MainButton.show();
    }
  }, []);

  return initDataUnsafe
};

export default useTgInitData;
