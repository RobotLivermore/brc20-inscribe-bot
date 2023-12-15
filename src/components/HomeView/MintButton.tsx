
import React, { FC } from "react";
import { useRouter } from "next/navigation";
import Button from "@/ui/Button";

interface Props {
  tick: string;
  limit: string;
}
const MintButton: FC<Props> = ({ tick, limit }) => {
  const router = useRouter();
  return (
    <Button
      theme="outline"
      text="mint"
      className="py-0 px-2"
      onClick={() => {
        router.push(`/inscribe?tick=${tick}&amt=${Number(limit)}`);
      }}
    />
  );
};

export default MintButton;