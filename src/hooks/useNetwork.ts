import useLocalStorage from "./useLocalstorage";

const useNetwork = () => {
  const [network, setNetwork] = useLocalStorage<'main' | 'testnet'>("wallet::network", "main");

  return [network, setNetwork] as ['main' | 'testnet', (network: 'main' | 'testnet') => void];
}

export default useNetwork;