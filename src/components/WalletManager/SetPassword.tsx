"use client";

import React, { FC } from "react";

// Create your password
const SetPassword: FC = () => {
  return (
    <div className="flex flex-col py-8 px-4 w-full max-w-[calc(100vw - 32px)] bg-white rounded-xl">
      <input
        type="password"
        placeholder="请输入密码"
        className="input text-black input-bordered bg-white w-full max-w-xs"
      />
      <input
        type="password"
        placeholder="确认密码"
        className="input  text-black input-bordered bg-white w-full max-w-xs"
      />
    </div>
  );
};

export default SetPassword;
