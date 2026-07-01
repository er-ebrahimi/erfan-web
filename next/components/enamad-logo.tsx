"use client";

import Image from "next/image";

import enamadLogo from "@/public/enamad.webp";

const SHOW_ENAMAD = process.env.NEXT_PUBLIC_SHOW_ENAMAD === 'true';
const ENAMAD_URL = process.env.NEXT_PUBLIC_ENAMAD_URL || '';

export const EnamadLogo = () => {
  if (!SHOW_ENAMAD || !ENAMAD_URL) {
    return null;
  }

  return (
    <a referrerPolicy="origin" target="_blank" href={ENAMAD_URL}>
      <Image
        referrerPolicy="origin"
        src={enamadLogo}
        alt="enamad-logo"
        width={100}
        height={100}
        style={{ cursor: "pointer" }}
      />
    </a>
  );
};
