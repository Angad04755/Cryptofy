"use client";

import Image from "next/image";
import { useState } from "react";
import Logo from "../../../public/images/Logo.png";
import Button from "../ui/Button";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
const options = [
  { label: "INR", value: "inr" },
  { label: "USD", value: "usd" },
  { label: "EUR", value: "eur" },
];

const Navbar = () => {
  const [selected, setSelected] = useState("inr");
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 w-full border-b-5 border-white bg-white">
      <div className="mx-auto flex h-14 items-center justify-between px-6">

        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Image src={Logo} width={35} height={35} alt="Cryptofy logo" />
          <span className="text-xl md:text-2xl font-bold text-black">
            CRYPTOFY
          </span>
        </div>
        <SignedIn>
          <UserButton/>
        </SignedIn>

        {/* Right: Action */}
        <SignedOut>
        <div onClick={() => router.push("/sign-in")}>
          <Button text="Sign In"/>
        </div>
        </SignedOut>

      </div>
    </nav>
  );
};

export default Navbar;
