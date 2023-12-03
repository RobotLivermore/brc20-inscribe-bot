import useToast from "@/hooks/useToast";
import copy from "copy-text-to-clipboard";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";

const useCopy = () => {
  const { t } = useTranslation();
  const showToast = useToast();

  const copyText = useCallback((text: string) => {
    copy(text);
    showToast(t("common.copySuccess"));
  }, [showToast, t]);

  return copyText;
};

export default useCopy;
