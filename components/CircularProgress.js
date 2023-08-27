import React from "react";

const CircularProgress = React.forwardRef((props, progressRef) => {
  return (
    <div
      ref={progressRef}
      className="relative z flex justify-center items-center  w-16 h-16 rounded-full after:absolute after:content-[''] after:block after:w-[60px] after:h-[60px] after:bg-white after:text-black after:rounded-full after:left-1/2 after:-translate-x-1/2 after:top-1/2 after:-translate-y-1/2"
      style={{
        background: `conic-gradient(#003A9B ${
          props.percentage * 3.6
        }deg,white 0deg)`,
      }}
    >
      <p className="absolute z-10 text-xs font-semibold">{props.percentage}%</p>
    </div>
  );
});

CircularProgress.displayName = "CircularProgress";

export default CircularProgress;
