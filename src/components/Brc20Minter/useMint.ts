import { useCallback } from "react";
import useLoading from "@/hooks/useLoading";
import { fetchBrc20MintInscriptionAddress } from '@/api/mint'

const useMint = () => {
  const [isMinting, getIsMinting, setIsMinting] = useLoading();

  const handle = useCallback(
    async (tick: string, amount: number, receiveAddress: string) => {
      if (getIsMinting()) {
        return;
      }
      try {
        setIsMinting(true);
        const result = await fetchBrc20MintInscriptionAddress(tick, amount, receiveAddress);
        console.log(result);
        return result
      } catch (e) {
        console.error(e);
      } finally {
        setIsMinting(false);
      }
    },
    [getIsMinting, setIsMinting]
  );

  return { isMinting, onMint: handle };
};

export default useMint;
