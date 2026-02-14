"use client";

import Image from "next/image";
import Logo from "../../../public/images/Logo.png";
import Button from "../ui/Button";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import SearchBox from "../ui/SearchBox";
import { motion } from "framer-motion";

const Navbar = () => {

  const router = useRouter();

  return (

    <motion.nav
      initial={{ opacity: 0, y: -60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-white/20 bg-gradient-to-r from-emerald-500 via-green-400 to-teal-400 backdrop-blur-md shadow-sm"
    >

      <div className="mx-auto px-4 md:px-6 py-2">

        {/* TOP ROW */}

        <div className="grid grid-cols-2 md:grid-cols-3 items-center">

          {/* Logo */}

          <div
            className="flex items-center cursor-pointer"
            onClick={() => router.push("/")}
          >

            <Image src={Logo} width={35} height={35} alt="logo" />

            <span className="ml-[-8px] text-xl md:text-2xl font-bold text-black">

              RYPTOFY

            </span>

          </div>


          {/* SearchBox Desktop */}

          <div className="hidden md:flex justify-center">

            <SearchBox />

          </div>

          {/* User */}

          <div className="flex justify-end">

            <SignedIn>

              <UserButton />

            </SignedIn>

            <SignedOut>

              <div onClick={() => router.push("/sign-in")}>

                <Button text="Sign In" />

              </div>

            </SignedOut>

          </div>

        </div>

        {/* SearchBox Mobile */}

        <div className="mt-3 md:hidden">

          <SearchBox />
        </div>

      </div>

    </motion.nav>
  );
};

export default Navbar;
