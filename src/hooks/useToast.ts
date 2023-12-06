import { toast } from "react-hot-toast";
import useThrottleFn from "./useThrottleFn";

function useToast(type: "error" | "success" | "loading" | "custom" = 'success') {
  const fn = toast[type]
  const showToast = useThrottleFn(fn, 3000);

  return showToast;
}

export default useToast;
