import { useEffect, useState } from "react";
import { useAccount, useContractReads, useProvider, erc20ABI } from "wagmi";
import { ethers } from "ethers";
import WriteButton from "../components/WriteButton";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import erc721ABI from "../abi/erc721ABI.json";
import copy from "copy-to-clipboard";
import { nanoid } from "nanoid";
import { nflow } from "../config";
import { useTokenIdsRead } from "../components/Common/utils";
const Home = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const [state, setState] = useState({});
  const [render, setRender] = useState(false);
  const { address } = useAccount();
  const tokenIds = useTokenIdsRead({
    contractAddress: state["nftAddress"],
    address: address,
    scopeKey: render,
  });

  const provider = useProvider();
  const inputNFTAddress = async () => {
    state["loading"] = true;
    setState({ ...state });
    try {
      const address = state["inputNFTAddress"];
      const isAddress = ethers.utils.isAddress(address);

      if (!isAddress) {
        throw "not address";
      }

      const code = await provider.getCode(address);

      if (code == "0x") {
        throw "not contract";
      }

      const erc721 = new ethers.Contract(address, erc721ABI, provider);
      const isERC721 = await erc721.supportsInterface(0x80ac58cd);

      if (!isERC721) {
        throw "not erc721";
      }
      const name = await erc721.name();
      state["name"] = name;
      state["nftAddress"] = address;
    } catch (error) {
      Notify.failure("The input is not a valid nft contract");
    } finally {
      state["loading"] = false;
      setState({ ...state });
    }
  };

  const { data: read0 } = useContractReads({
    contracts: [
      {
        address: state["nftAddress"],
        abi: erc721ABI,
        functionName: "balanceOf",
        args: [address],
      },
      {
        ...nflow,
        functionName: "tokenAddress",
        args: [state["nftAddress"]],
      },
      {
        address: state["nftAddress"],
        abi: erc721ABI,
        functionName: "isApprovedForAll",
        args: [address, nflow["address"]],
      },
    ],
    scopeKey: render,
  });

  const erc721Balance = read0?.[0];
  state["nftTokenAddress"] = read0?.[1];
  const erc721Approve = read0?.[2];

  const { data: read1 } = useContractReads({
    contracts: [
      {
        address: state?.["nftTokenAddress"],
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [address],
      },
      {
        address: state?.["nftTokenAddress"],
        abi: erc20ABI,
        functionName: "allowance",
        args: [address, nflow["address"]],
      },
    ],
    scopeKey: render,
  });

  const erc20Balance = read1?.[0];
  const erc20Approve = read1?.[1];

  const approveERC20 = {
    buttonName: "Approve ERC20",
    className: "btn-primary",
    data: {
      mode: "recklesslyUnprepared",
      address: state?.["nftTokenAddress"],
      abi: erc20ABI,
      functionName: "approve",
      args: [nflow["address"], "0xfffffffffffffffffffffffffffffffffffffff"],
    },
    callback: (confirmed) => {
      if (confirmed) setRender(nanoid());
    },
  };

  const approveERC721 = {
    buttonName: "Approve ERC721",
    className: "btn-primary",
    data: {
      mode: "recklesslyUnprepared",
      address: state?.["nftAddress"],
      abi: erc721ABI,
      functionName: "setApprovalForAll",
      args: [nflow["address"], true],
    },
    callback: (confirmed) => {
      if (confirmed) setRender(nanoid());
    },
  };

  const tokenizationDisabled = !(
    state["inputNFTAmount"] > 0 &&
    erc721Balance >= Number(state["inputNFTAmount"])
  );

  const nftizationDisabled = !(
    state["inputNFTTokenAmount"] >= 1e18 &&
    erc20Balance >= Number(state["inputNFTTokenAmount"] * 1e18)
  );

  const tokenization = {
    buttonName: "tokenization",
    className: "btn-accent text-white",
    disabled: tokenizationDisabled,
    data: {
      ...nflow,
      mode: "recklesslyUnprepared",
      functionName: "tokenization",
      args: [state["nftAddress"], state["inputNFTTokenIds"]],
    },
    callback: (confirmed) => {
      if (confirmed) {
        state["inputNFTAmount"] = 0;
        setRender(nanoid());
      }
    },
  };

  const nftization = {
    buttonName: "nftization",
    className: "btn-accent text-white",
    disabled: nftizationDisabled,
    data: {
      ...nflow,
      mode: "recklesslyUnprepared",
      functionName: "nftization",
      args: [
        state["nftAddress"],
        state["inputNFTTokenAmount"]
          ? ethers.utils.parseEther(state["inputNFTTokenAmount"])
          : 0,
      ],
    },
    callback: (confirmed) => {
      if (confirmed) {
        state["inputNFTTokenAmount"] = 0;
        setRender(nanoid());
      }
    },
  };

  return (
    mounted && (
      <>
        <div className="w-72 md:w-1/2 m-auto shadow-xl card">
          <div className="card-body">
            {/* The button to open modal */}
            <label
              htmlFor="input-your-nft"
              className={state["loading"] ? "loading btn" : "btn"}
            >
              {state["loading"] ? "Loading" : "Input nft address"}
            </label>

            {state["nftAddress"] ? (
              <>
                <div
                  className="font-black text-xl tooltip cursor-pointer"
                  data-tip="click to copy"
                  onClick={() => {
                    copy(state["name"]);
                    Notify.success("Copy Success");
                  }}
                >
                  NFT : {state["name"]}
                </div>
                <div
                  className="font-black text-xs tooltip cursor-pointer"
                  data-tip="click to copy"
                  onClick={() => {
                    copy(state["nftAddress"]);
                    Notify.success("Copy Success");
                  }}
                >
                  NFT Address :{" "}
                  {state["nftAddress"].substring(0, 5) +
                    "...." +
                    state["nftAddress"].substring(37, 42)}
                </div>
                <div
                  className="font-black text-xs tooltip cursor-pointer"
                  data-tip="click to copy"
                  onClick={() => {
                    copy(state["nftTokenAddress"]);
                    Notify.success("Copy Success");
                  }}
                >
                  NFT Token Address :{" "}
                  {state["nftTokenAddress"]?.substring(0, 5) +
                    "...." +
                    state["nftTokenAddress"]?.substring(37, 42)}
                </div>
                <div className="font-black text-xs">
                  You own the nft balance : {erc721Balance?.toString()}
                </div>
                <div className="font-black text-xs">
                  You own the nft token balance :{" "}
                  {erc20Balance ? erc20Balance?.toString() / 1e18 : "0"}
                </div>
                <label
                  htmlFor="tokenization"
                  className="btn btn-xs btn-primary"
                >
                  tokenization
                </label>
                <label
                  htmlFor="nftization"
                  className="btn btn-xs btn-secondary"
                >
                  nftization
                </label>
              </>
            ) : (
              <div className="font-black text-xl text-center">
                No nft address found
              </div>
            )}
          </div>
        </div>
        {/* Put this part before </body> tag */}
        <input type="checkbox" id="input-your-nft" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <input
              type="text"
              placeholder="Input nft address"
              className="input input-bordered w-full"
              onChange={(e) => {
                state["inputNFTAddress"] = e.target.value;
                setState({ ...state });
              }}
            />

            <div className="modal-action">
              <label
                htmlFor="input-your-nft"
                className="btn"
                onClick={inputNFTAddress}
              >
                Yay!
              </label>
            </div>
          </div>
        </div>
        {/* Put this part before </body> tag */}
        <input type="checkbox" id="tokenization" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <input
              disabled={!erc721Approve}
              type="number"
              placeholder="Input nft amount"
              className="input input-bordered w-full"
              onChange={(e) => {
                state["inputNFTAmount"] = e.target.value;
                const erc721Input = [];

                for (const index in tokenIds) {
                  if (index < Number(e.target.value))
                    erc721Input[index] = tokenIds[index];
                }

                state["inputNFTTokenIds"] = erc721Input;
                setState({ ...state });
              }}
              value={state["inputNFTAmount"]}
            />

            <div className="alert alert-info shadow-lg mt-2">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-current flex-shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span className="text-xs">
                  Tips : minimum tokenization 1 nft
                </span>
              </div>
            </div>
            {!erc721Approve && (
              <div className="alert alert-info shadow-lg mt-2">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-current flex-shrink-0 w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span className="text-xs">You need approve</span>
                </div>
              </div>
            )}
            {!tokenizationDisabled && (
              <>
                <div className="alert alert-success shadow-lg text-xs mt-2">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current flex-shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-xs">
                      You will deposit {state["inputNFTAmount"]} nft
                    </span>
                  </div>
                </div>
                <div className="alert alert-success shadow-lg mt-2">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current flex-shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-xs">
                      You will receice {state["inputNFTAmount"] * 1e18} nft
                      token
                    </span>
                  </div>
                </div>
              </>
            )}
            <div className="modal-action">
              <label htmlFor="tokenization" className="btn">
                Back
              </label>
              {erc721Approve ? (
                <WriteButton {...tokenization} />
              ) : (
                <WriteButton {...approveERC721} />
              )}
            </div>
          </div>
        </div>
        {/* Put this part before </body> tag */}
        <input type="checkbox" id="nftization" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <input
              disabled={
                erc20Approve < "0xfffffffffffffffffffffffffffffffffffffff"
              }
              type="number"
              placeholder="Input nft token amount"
              className="input input-bordered w-full"
              onChange={(e) => {
                state["inputNFTTokenAmount"] = e.target.value;
                setState({ ...state });
              }}
              value={state["inputNFTTokenAmount"]}
            />

            <div className="alert alert-info shadow-lg mt-2">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-current flex-shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span className="text-xs">
                  Tips : minimum nftization 1000000000000000000 nft token
                </span>
              </div>
            </div>
            {!erc721Approve && (
              <div className="alert alert-info shadow-lg mt-2">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-current flex-shrink-0 w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span className="text-xs">You need approve</span>
                </div>
              </div>
            )}
            {!nftizationDisabled && (
              <>
                <div className="alert alert-success shadow-lg mt-2">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current flex-shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-xs">
                      You will deposit {state["inputNFTTokenAmount"]} nft token
                    </span>
                  </div>
                </div>
                <div className="alert alert-success shadow-lg mt-2">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current flex-shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-xs">
                      You will receice {state["inputNFTTokenAmount"] / 1e18} nft
                    </span>
                  </div>
                </div>
              </>
            )}
            <div className="modal-action">
              <label htmlFor="nftization" className="btn">
                Back
              </label>
              {erc20Approve >= "0xfffffffffffffffffffffffffffffffffffffff" ? (
                <WriteButton {...nftization} />
              ) : (
                <WriteButton {...approveERC20} />
              )}
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default Home;
