"use client";

import React, { FC, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { ReactSVG } from "react-svg";

const Item: FC<{
  no: number;
  word: string;
  isCorrect: boolean;
  onRemove: () => void;
}> = ({ no, word, isCorrect, onRemove }) => {
  return (
    <div className="flex">
      <span className="flex justify-center items-center w-8 h-8 bg-black text-white rounded">
        {no}
      </span>
      <span
        className={`${isCorrect ? "border-green-600" : ""} ${
          !isCorrect && Boolean(word) && "border-red-600"
        } ml-2 px-2 flex-grow border h-8 flex items-center rounded bg-transparent outline-none focus:border-black relative`}
      >
        {word}
        {word && isCorrect && (
          <span
            className=" text-green-500 absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
          >
            <ReactSVG
              src="/assets/icon/outline/check.svg"
              className="w-4 h-3"
            />
          </span>
        )}
        {word && !isCorrect && (
          <Image
            alt="close"
            src="/assets/icon/outline/close.svg"
            width={14}
            height={14}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer opacity-50"
            onClick={onRemove}
          />
        )}
      </span>
    </div>
  );
};

interface Props {
  mnemonic: string;
  onConfirm: () => void;
  onBack: () => void
}

const ConfirmMnemonic: FC<Props> = ({ mnemonic, onConfirm, onBack }) => {
  const { t } = useTranslation();
  const wordList = mnemonic.split(" ");
  const [selectedWords, setSelectedWords] = useState(
    new Array(4).fill("") as string[]
  );

  const handleSelectWord = (word: string) => {
    let idx = -1;
    for (let i = 0; i < selectedWords.length; i++) {
      if (!selectedWords[i]) {
        idx = i;
        break;
      }
    }
    if (idx === -1) {
      return;
    }
    const newSelectedWords = [...selectedWords];
    newSelectedWords[idx] = word;
    setSelectedWords(newSelectedWords);
  };

  const handleRemoveSelectedWord = (index: number) => {
    const newSelectedWords = [...selectedWords];
    newSelectedWords[index] = "";
    setSelectedWords(newSelectedWords);
  };

  const isPass = selectedWords.every((word, index) => {
    return word === wordList[index * 3 + 2];
  })

  return (
    <div className="flex flex-col pb-8 pt-4 px-4 w-full max-w-[calc(100vw - 32px)] bg-white rounded-xl text-black">
      <h3 className="font-bold text-xl">Confirm back up</h3>
      <p className="text-sm text-gray-400 mt-4">
        Select words 3, 6, 9 and 12 of your mnemonic.
      </p>
      <div className="mt-4 grid gap-4">
        <Item
          no={3}
          isCorrect={selectedWords[0] === wordList[2]}
          word={selectedWords[0]}
          onRemove={() => {
            handleRemoveSelectedWord(0);
          }}
        />
        <Item
          no={6}
          isCorrect={selectedWords[1] === wordList[5]}
          word={selectedWords[1]}
          onRemove={() => {
            handleRemoveSelectedWord(1);
          }}
        />
        <Item
          no={9}
          isCorrect={selectedWords[2] === wordList[8]}
          word={selectedWords[2]}
          onRemove={() => {
            handleRemoveSelectedWord(2);
          }}
        />
        <Item
          no={12}
          isCorrect={selectedWords[3] === wordList[11]}
          word={selectedWords[3]}
          onRemove={() => {
            handleRemoveSelectedWord(3);
          }}
        />
      </div>

      <div className="flex justify-center flex-wrap mt-6">
        {wordList
          .filter((word) => !selectedWords.includes(word))
          .map((word, index) => (
            <span
              key={index}
              className="flex mx-1 px-3 my-2 justify-center items-center h-8 bg-black text-white rounded-md"
              onClick={() => {
                handleSelectWord(word);
              }}
            >
              {word}
            </span>
          ))}
      </div>
      <button
        className="btn bg-black rounded-full text-white py-2 px-4 mt-4 overflow-hidden"
        onClick={onConfirm}
        disabled={!isPass}
      >
        {t("wallet.next")}
      </button>
      <button
        className="btn btn-outline border-black rounded-full text-black flex justify-center mt-4 text-sm"
        onClick={onBack}
      >
        {t("wallet.back")}
      </button>
    </div>
  );
};

export default ConfirmMnemonic;
