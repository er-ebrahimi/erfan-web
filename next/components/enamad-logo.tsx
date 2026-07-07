"use client";

import Image from "next/image";

import enamadLogo from "@/public/enamad.webp";

const ENAMAD_URL = process.env.NEXT_PUBLIC_ENAMAD_URL || '';

export const EnamadLogo = () => (
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
