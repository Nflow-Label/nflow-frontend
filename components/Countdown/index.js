import React from "react";

const Countdown = (props) => {
  const [time, setTime] = React.useState(0);
  React.useEffect(() => {
    let timer = setInterval(() => {
      let diffTime = props.startTime - new Date().getTime() / 1000;
      setTime(diffTime > 0 ? diffTime : 0);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [props.startTime]);

  let sec = parseInt(time) % 60;
  let min = parseInt(time / 60) % 60;
  let hours = parseInt(time / (60 * 60));
  if (hours > 99) hours = 99;
  return (
    <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">
          <span style={{ "--value": hours }}></span>
        </span>
        hours
      </div>
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">
          <span style={{ "--value": min }}></span>
        </span>
        min
      </div>
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">
          <span style={{ "--value": sec }}></span>
        </span>
        sec
      </div>
    </div>
  );
};

export default Countdown;
