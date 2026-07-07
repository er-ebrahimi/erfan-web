"use client";

import dynamic from "next/dynamic";

const EnamadLogo = dynamic(
  () => import("@/components/enamad-logo").then((mod) => ({ default: mod.EnamadLogo })),
  { ssr: true }
);

export const EnamadWrapper = () => {
  if (process.env.NEXT_PUBLIC_SHOW_ENAMAD !== "true" || !process.env.NEXT_PUBLIC_ENAMAD_URL) {
    return null;
  }

  return (
    <div className="mt-4 bg-white rounded-lg p-2 h-28 w-28">
      <EnamadLogo />
    </div>
  );
};
