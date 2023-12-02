"use client";

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
        <p className="text-2xl font-bold text-black">创建或恢复钱包</p>
        <p className="text-sm text-gray-400 mt-2">
          请确保您的钱包是由您自己创建的，我们不会保存您的钱包信息
        </p>
        <div className="flex flex-col mt-4 w-full">
          <button
            className="btn bg-black rounded-full text-white py-2 px-4 overflow-hidden"
            onClick={onCreateNewWallet}
          >
            {t('wallet.create')}
          </button>
          <button
            className="btn btn-outline rounded-full text-black mt-2"
            onClick={onRestoreWallet}
          >
            恢复钱包
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectSource;
