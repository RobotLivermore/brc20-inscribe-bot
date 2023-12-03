import { toast } from "react-hot-toast";
import useThrottleFn from "./useThrottleFn";

function useToast() {
  const showToast = useThrottleFn(toast.success, 3000);

  return showToast;
}

export default useToast;
