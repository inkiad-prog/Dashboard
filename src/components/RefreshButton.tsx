"use client";

import { useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { refreshPath } from "@/lib/actions";

export default function RefreshButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [isRefreshing, startRefresh] = useTransition();

  function handleClick() {
    startRefresh(async () => {
      await refreshPath(pathname);
      router.refresh();
    });
  }

  return (
    <button className="refresh-btn" disabled={isRefreshing} onClick={handleClick}>
      {isRefreshing ? "Refreshing…" : "↻ Refresh data"}
    </button>
  );
}
