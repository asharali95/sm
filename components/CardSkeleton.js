import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const CardSkeleton = () => {
  return (
    <div className="flex flex-col   border-[1px] bg-gray-100 p-4 shadow-lg rounded-lg space-y-2 ">
      <Skeleton width={200} height={20} />
      <Skeleton count={2} height={10} width={250} />
      <Skeleton height={10} width={100} />
      <Skeleton height={100} />
      <Skeleton height={10} width={"40%"} />
    </div>
  );
};

export default CardSkeleton;
