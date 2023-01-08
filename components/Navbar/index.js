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
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-square btn-ghost m-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-5 h-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              ></path>
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="https://docs.nflow.online" target={"_blank"}>
                Docs
              </Link>
            </li>
            <li>
              <Link href="https://twitter.com/nflowlabel" target={"_blank"}>
                Twitter
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
