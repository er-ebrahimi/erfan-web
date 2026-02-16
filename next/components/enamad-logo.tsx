"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import enamad from "@/public/enamad-logo.webp";
import Link from "next/link";

export const EnamadLogo = () => {
  return (
    <a
      referrerPolicy="origin"
      target="_blank"
      href="https://trustseal.enamad.ir/?id=690945&Code=rgk8cRpwyv7qi7lWVM6noaAn9SiQzaP9"
    >
      <img
        referrerPolicy="origin"
        src="https://trustseal.enamad.ir/logo.aspx?id=690945&Code=rgk8cRpwyv7qi7lWVM6noaAn9SiQzaP9"
        alt="enamad-logo"
        width={100}
        height={100}
        style={{ cursor: "pointer" }}
      />
    </a>
  );
};