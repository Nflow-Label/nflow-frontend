import { useEffect, useState } from "react";
import { useAccount, useContractReads, useProvider } from "wagmi";
import { ethers } from "ethers";
import WriteButton from "../components/WriteButton";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import erc721ABI from "../abi/erc721ABI.json";
import copy from "copy-to-clipboard";
import { nanoid } from "nanoid";
const Home = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const [state, setState] = useState({});
  const [render, setRender] = useState(false);

  const tokenization = {
    buttonName: "tokenization",
    className: "btn-primary",
    callback: () => {
      setRender(nanoid());
    },
  };

  const nftization = {
    buttonName: "nftization",
    className: "btn-primary",
    callback: () => {
      setRender(nanoid());
    },
  };

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

  const { address } = useAccount();

  const { data: read0 } = useContractReads({
    contracts: [
      {
        address: state["nftAddress"],
        abi: erc721ABI,
        functionName: "balanceOf",
        args: [address],
      },
    ],
    scopeKey: render,
  });

  const erc721Balance = read0?.[0];
  return (
    mounted && (
      <>
        <div className="w-72 md:w-96 m-auto shadow-xl card">
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
                  {state["nftTokenAddress"].substring(0, 5) +
                    "...." +
                    state["nftTokenAddress"].substring(37, 42)}
                </div>
                <div className="font-thin text-xs">
                  You own the nft balance : {erc721Balance?.toString()}
                </div>
                <div className="font-thin text-xs">
                  You own the nft token balance : 0
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
              type="text"
              placeholder="Input nft amount"
              className="input input-bordered w-full"
              onChange={(e) => {
                state["inputNFTAmount"] = e.target.value;
              }}
            />

            <div className="modal-action">
              <label htmlFor="tokenization" className="btn">
                Back
              </label>
              <WriteButton {...tokenization} />
            </div>
          </div>
        </div>
        {/* Put this part before </body> tag */}
        <input type="checkbox" id="nftization" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <input
              type="text"
              placeholder="Input nft token amount"
              className="input input-bordered w-full"
              onChange={(e) => {
                state["inputNFTTokenAmount"] = e.target.value;
              }}
            />

            <div className="modal-action">
              <label htmlFor="nftization" className="btn">
                Back
              </label>
              <WriteButton {...nftization} />
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default Home;
