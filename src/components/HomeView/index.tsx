"use client";

import { FC, useState } from "react";
import MintButton from "./MintButton";
import { useTranslation } from "react-i18next";

interface Props {
  ticks: any[];
}
const HomeView: FC<Props> = ({ ticks }) => {
  const { t } = useTranslation("home");

  return (
    <>
      <div className="flex flex-col w-full max-w-[calc(100vw - 32px)] bg-white rounded-xl border-2 border-black shadow-[5px_5px_black]">
        <h3 className="font-bold text-xl py-2 px-3 border-b border-black">
          {t("home.hotBRC20Mints")}
        </h3>
        <div className="px-2 py-4">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr className="font-medium">
                <th>{t("home.tick")}</th>
                <th>{t("home.holders")}</th>
                <th>{t("home.process")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="text-center">
              {ticks.map((tick) => (
                <tr key={tick.tick} className="border-b border-gray-100">
                  <td>{tick.tick}</td>
                  <td>{tick.holders}</td>
                  <td>{(Number(tick.mint_progress) * 100).toFixed(2)}%</td>
                  <td className="py-1 text-right flex justify-center">
                    <MintButton
                      tick={tick.tick}
                      limit={tick.limit}
                      text={t("home.mint")}
                      protocol="brc-20"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8 flex flex-col w-full max-w-[calc(100vw - 32px)] bg-white rounded-xl border-2 border-black shadow-[5px_5px_black]">
        <h3 className="font-bold text-xl py-2 px-3 border-b border-black">
          {t("home.hotBRC100Mints")}
        </h3>
        <div className="px-2 py-4">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr className="font-medium">
                <th>{t("home.tick")}</th>
                <th>{t("home.holders")}</th>
                <th>{t("home.process")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="text-center">
              <tr className="border-b border-gray-100">
                <td>bos</td>
                <td>3385</td>
                <td>52.81%</td>
                <td className="py-1 text-right flex justify-center">
                  <MintButton
                    tick={"bos"}
                    limit={String(1000)}
                    text={t("home.mint")}
                    protocol="brc-100"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default HomeView;
