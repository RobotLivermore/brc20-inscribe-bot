"use client";

import React, { FC, useCallback, useState } from "react";
import SelectSource from "./SelectSource";
import SetPassword from "./SetPassword";

const CreateOrRestoreWallet: FC = () => {
  /**
   * page value init, setPassword,
   */
  const [page, setPage] = useState("init");
  const [source, setSource] = useState("create"); // create || restore

  const onCreateNewWallet = useCallback(() => {
    setSource("create");
    setPage("setPassword");
  }, []);

  const onRestoreWallet = useCallback(() => {
    setSource("restore");
    setPage("setPassword");
  }, []);

  console.log(page);

  if (page === "init") {
    return (
      <SelectSource
        onCreateNewWallet={onCreateNewWallet}
        onRestoreWallet={onRestoreWallet}
      />
    );
  } else if (page === "setPassword") {
    return <SetPassword />;
  }
  return null;
};

export default CreateOrRestoreWallet;
