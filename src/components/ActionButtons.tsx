import React from "react";
import { Button } from "./ui";

interface Props {
  connecting: boolean;
  refreshing: boolean;
  onConnect: () => void;
  onRefresh: () => void;
}

export function ActionButtons({ connecting, refreshing, onConnect, onRefresh }: Props) {
  return (
    <div className="my-6 mb-[22px] flex flex-wrap gap-2.5">
      <Button variant="primary" loading={connecting} onClick={onConnect}>
        ↻ reconnect_qz
      </Button>
      <Button loading={refreshing} onClick={onRefresh}>
        ↻ refresh printers
      </Button>
    </div>
  );
}