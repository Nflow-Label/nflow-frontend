import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
const Navbar = () => {
  const router = useRouter();

  return (
    <div className="navbar items-center h-20">
      <div className="navbar-start">
        <div className="font-black text-xl ml-2">Nflow</div>
      </div>
      <div className="navbar-center hidden lg:flex">
        {/* <div className="btn-group">
          <button
            className="btn btn-primary no-animation"
            onClick={() => router.push("/")}
          >
            HOME
          </button>
          <button
            className="btn btn-primary no-animation"
            onClick={() => router.push("/pool")}
          >
            POOL
          </button>
        </div> */}
      </div>
      <div className="navbar-end">
        <ConnectButton />
      </div>
    </div>
  );
};

export default Navbar;
