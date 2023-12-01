"use client";

import { FC, useEffect, useState } from "react";

const Login: FC = () => {
  const [hash, setHash] = useState('')

  useEffect(() => {
    // console.log("Hash:", window.location.hash);
    setHash(window.location.hash)
  }, []);
  return (
    <div>
      <h1>login</h1>
      <span className="break-all">{hash}</span>
    </div>
  );
};

export default Login;
