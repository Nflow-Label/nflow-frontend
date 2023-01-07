import { useAccount, useContractWrite, useWaitForTransaction } from "wagmi";
import { useEffect, useState } from "react";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const WriteButton = (props) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { isConnected } = useAccount();

  const { data: tx, write } = useContractWrite({
    ...props?.data,
    onError(error) {
      Notify.failure(error.message);
    },
  });
  const { isSuccess: confirmed, isLoading: confriming } = useWaitForTransaction(
    {
      ...tx,
      onError(error) {
        Notify.failure(error.message);
      },
    }
  );

  useEffect(() => {
    props?.callback?.(confirmed);
  }, [confirmed]);

  return (
    mounted && (
      <>
        {!isConnected && <ConnectButton />}
        {isConnected && (
          <button
            className={
              confriming
                ? "btn loading " + props.className
                : "btn " + props.className
            }
            disabled={props?.disabled || !write || confriming}
            onClick={() => write?.()}
          >
            {confriming ? "Confriming" : props?.buttonName}
          </button>
        )}
      </>
    )
  );
};

export default WriteButton;
