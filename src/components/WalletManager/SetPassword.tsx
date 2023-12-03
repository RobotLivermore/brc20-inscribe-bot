"use client";

import Button from "@/ui/Button";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  onBack: () => void;
  onNext: (psw: string) => void;
}

// Create your password
const SetPassword: FC<Props> = ({ onBack, onNext }) => {
  const { t } = useTranslation();
  const [password, setPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");

  const [errorTips, setErrorTips] = React.useState<string>("");

  const isPasswordValid = password.length >= 8 && password === confirmPassword;

  return (
    <div className="flex flex-col pb-8 pt-4 px-4 w-full max-w-[calc(100vw - 32px)] bg-white rounded-xl text-black">
      <h3 className="font-bold text-xl">{t("wallet.createPassword")}</h3>
      <p className="text-sm text-gray-400 mt-4">{t("wallet.passwordTips")}</p>
      <input
        type="password"
        placeholder={t("wallet.password")}
        className="input mt-4 text-black input-bordered bg-white w-full"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        onBlur={() => {
          if (password.length < 8) {
            setErrorTips(t("wallet.passwordAtLeast"));
          } else {
            setErrorTips("");
          }
        }}
      />
      <input
        type="password"
        placeholder={t("wallet.confirmPassword")}
        className="input mt-4 text-black input-bordered bg-white w-full"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
        }}
        onBlur={() => {
          if (password !== confirmPassword) {
            setErrorTips(t("wallet.passwordNotMatch"));
          } else {
            setErrorTips("");
          }
        }}
      />
      <p className="mt-2 min-h-[20px] text-red-700 text-sm">{errorTips}</p>
      <Button
        theme="primay"
        className="mt-4"
        text={t("wallet.next")}
        onClick={() => {
          onNext(password)
        }}
        disabled={!isPasswordValid}
      />
      <Button
        theme="outline"
        className="mt-4"
        text={t("wallet.back")}
        onClick={onBack}
      />
    </div>
  );
};

export default SetPassword;
