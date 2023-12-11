import { useCallback, useEffect, useState } from "react";
import { WalletCore } from "@/types/wallet";

const useWallet = () => {
  const [wallet, setWallet] = useState<WalletCore | null>(null);

  const clearWallet = useCallback(() => {
    setWallet(null);
    if (typeof window === "undefined") {
      return;
    }
    try {
      window.localStorage.removeItem("localWallet");
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return;
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      const item = window.localStorage.getItem("localWallet");
      if (item) {
        setWallet(JSON.parse(item));
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return;
    }
  }, []);

  useEffect(() => {
    if (wallet?.publicKey && wallet?.publicKey.length < 64) {
      clearWallet();
    }
  }, [wallet?.publicKey, clearWallet]);

  const saveWallet = useCallback((w: WalletCore | null) => {
    setWallet(w);
    if (typeof window === "undefined") {
      return;
    }
    try {
      window.localStorage.setItem("localWallet", JSON.stringify(w));
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return;
    }
  }, []);
  return {
    wallet,
    saveWallet,
    clearWallet,
  };
};

export default useWallet;
