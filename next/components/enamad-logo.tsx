"use client";

import Image from "next/image";
import enamadLogo from "@/public/enamad.webp"
export const EnamadLogo = () => {
  return (
    <a
      referrerPolicy="origin"
      target="_blank"
      href="https://trustseal.enamad.ir/?id=690945&Code=rgk8cRpwyv7qi7lWVM6noaAn9SiQzaP9"
    >
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
