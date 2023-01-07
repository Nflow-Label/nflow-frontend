import { useContractWrite, useWaitForTransaction } from "wagmi";
import { useEffect, useState } from "react";
import { Notify } from "notiflix/build/notiflix-notify-aio";

const WriteButton = (props) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

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
      <button
        className={confriming ? "btn btn-primary loading" : "btn btn-primary"}
        disabled={props?.disabled || !write || confriming}
        onClick={() => write?.()}
      >
        {confriming ? "Confriming" : props?.buttonName}
      </button>
    )
  );
};

export default WriteButton;
