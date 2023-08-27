import React from "react";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const JobDetailSkeleton = () => {
  return (
    <div
      className={`
 h-full shadow-sm w-[55%] border-[1px]  border-gray-200 hidden md:flex flex-col items-start rounded-lg  gap-4`}
    >
      <div className="flex flex-col w-full p-6 shadow-md bottom-0 h-[calc((100vh_-70px)_*_0.25)] ">
        <div className="flex flex-col ">
          <Skeleton width={200} height={20} />
          <Skeleton width={150} height={15} />
        </div>
        <div className="w-full flex items-center">
          <div className="flex flex-col items-start w-1/2">
            <div className=" text-gray-600 text-xs font-semibold ">
              <Skeleton width={100} height={10} />
            </div>

            <div className=" text-gray-600 text-xs font-semibold ">
              <Skeleton width={100} height={10} />
            </div>

            <div className=" text-gray-600 text-xs font-semibold ">
              <Skeleton width={100} height={10} />
            </div>
          </div>
          <div className="w-1/2 flex justify-end items-start">
            <Skeleton circle height={60} containerClassName="avatar-skeleton" />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full p-6 h-[calc((100vh_-70px)_*_0.58)] overflow-y-scroll text-gray-600 text-sm ">
        <h2 className="text-gray-600 font-semibold text-lg mb-3">
          <Skeleton width={100} height={20} />
        </h2>
        <div>
          <Skeleton count={10} height={10} />
        </div>
      </div>
    </div>
  );
};

export default JobDetailSkeleton;
