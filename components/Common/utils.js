import {
  useContractRead,
  erc20ABI,
  erc721ABI,
  useProvider,
  useContractReads,
} from "wagmi";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";

export const useBalanceOfRead = ({ contractAddress, address, scopeKey }) => {
  const { data } = useContractRead({
    address: contractAddress,
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [address],
    scopeKey: scopeKey,
  });

  return data;
};

export const useTokenIdsRead = ({ contractAddress, address, scopeKey }) => {
  const provider = useProvider();
  let [l, setL] = useState();

  useEffect(() => {
    readTokenIds().then((list) => setL(list));
  }, [contractAddress, address, scopeKey]);

  const readTokenIds = async () => {
    if (contractAddress == undefined) return [];
    const contract = new ethers.Contract(contractAddress, erc721ABI, provider);

    const filter = contract.filters.Transfer(null, address);

    const returnData = await contract.queryFilter(filter);
    return Array.from(
      new Set(
        returnData.map((data) => {
          return Number(data?.["args"]?.["tokenId"]);
        })
      )
    );
  };

  const { data: owners } = useContractReads({
    contracts: l?.map((item) => {
      return {
        address: contractAddress,
        abi: erc721ABI,
        functionName: "ownerOf",
        args: [item],
      };
    }),
    scopeKey: scopeKey,
  });

  if (owners) {
    return l?.filter((tokenId, index) => {
      return owners[index] == address;
    });
  } else {
    return;
  }
};

export const BigNumerToNumber = (data) => {
  try {
    if (data) {
      data = ethers.utils.formatUnits(data, 0);
    }
  } catch (e) {
    // console.error(e);
  } finally {
    return data;
  }
};
