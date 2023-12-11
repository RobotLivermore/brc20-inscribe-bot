import useToast from "@/hooks/useToast";
import copy from "copy-to-clipboard";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";

const useCopy = () => {
  const { t } = useTranslation();
  const showToast = useToast();

  const copyText = useCallback(
    (text: string) => {
      const success = copy(text);
      if (success) {
        showToast(t("common.copySuccess"));
      } else {
        showToast(t("common.copyFail"));
      }
    },
    [showToast, t]
  );

  return copyText;
};

export default useCopy;
