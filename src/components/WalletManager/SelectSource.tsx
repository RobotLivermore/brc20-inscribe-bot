"use client";

import Button from "@/ui/Button";
import React, { FC, useState } from "react";
import { useTranslation } from 'react-i18next';

interface Props {
  onCreateNewWallet: () => void;
  onRestoreWallet: () => void;
}

const SelectSource: FC<Props> = ({ onCreateNewWallet, onRestoreWallet }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col py-8 px-4 w-full max-w-[calc(100vw - 32px)] bg-white rounded-xl">
      <div className="flex flex-col items-center">
        <p className="text-2xl font-bold text-black">{t('wallet.createOrRestore')}</p>
        <p className="text-sm text-gray-400 mt-2">
          {t('wallet.createWalletTips')}
        </p>
        <div className="flex flex-col mt-4 w-full">
          <Button theme="primay" text={t('wallet.create')} onClick={onCreateNewWallet} className="py-3" />
          <Button theme="outline" text={t('wallet.restore')} onClick={onRestoreWallet} className="mt-2" />
        </div>
      </div>
    </div>
  );
};

export default SelectSource;
