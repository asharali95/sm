import React, { useState, useEffect, useRef } from "react";
import {
  UserGroupIcon,
  CalendarIcon,
  BriefcaseIcon,
  EnvelopeIcon,
  PhoneIcon,
  PencilSquareIcon,
  MapPinIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  TagIcon,
} from "@heroicons/react/24/solid";

import { useSpring, animated } from "@react-spring/web";

const Info = (props) => {
  let { fields, toggoleContactInfo, editButton = true } = props;
  const fieldsToRender = Object.keys(fields);
  //use spring hook to add animation
  const [prop, api] = useSpring(
    () => ({
      from: {
        clipPath: "polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%)",
      },
      to: {
        clipPath: "polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)",
      },
    }),
    []
  );
  return (
    <animated.div
      style={prop}
      className="bg-gray-50 w-full md:w-1/2 px-2 sm:px-4 py-2 sm:py-4 rounded-md flex justify-between
      items-center hover:bg-gray-200 cursor-pointer hover:shadow-md "
    >
      <div className=" flex flex-col gap-2 w-full">
        {fieldsToRender.map((item) => {
          if (fieldList[item]) {
            return fieldList[item](fields[item]);
          } else {
            return null;
          }
        })}

        {editButton && (
          <div className="sm:hidden flex w-full justify-center items-center ">
            <button
              onClick={toggoleContactInfo}
              className=" flex justify-center items-center shadow-lg  bg-primary-100 px-3 py-2 w-1/2 rounded-lg text-white font-semibold"
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {editButton && (
        <div onClick={toggoleContactInfo} className="hidden sm:block">
          <PencilSquareIcon className="w-6 h-6 stroke-[4] text-gray-600" />
        </div>
      )}
    </animated.div>
  );
};

export default Info;

const fieldList = {
  email: (email) => {
    return (
      <div className="flex gap-2 items-center" key="email">
        <EnvelopeIcon className="w-4 h-4 text-gray-600" />
        <p className=" text-gray-600">{email}</p>
      </div>
    );
  },
  phone: (phone) => {
    return (
      <div className="flex gap-2 items-center" key="phone">
        <PhoneIcon className="w-4 h-4 text-gray-600" />
        <p className=" text-gray-600">{phone}</p>
      </div>
    );
  },
  website: (website) => {
    return (
      <div className="flex gap-2 items-center" key="website">
        <GlobeAltIcon className="w-4 h-4 text-gray-600" />
        <p className=" text-gray-600">{website}</p>
      </div>
    );
  },
  companyType: (companyType) => {
    return (
      <div className="flex gap-2 items-center" key="companyType">
        <BuildingOfficeIcon className="w-4 h-4 text-gray-600" />
        <p className=" text-gray-600">{companyType}</p>
      </div>
    );
  },
  designation: (designation) => {
    return (
      <div className="flex gap-2 items-center" key="designation">
        <TagIcon className="w-4 h-4 text-gray-600" />
        <p className=" text-gray-600">{designation}</p>
      </div>
    );
  },
  linkedIn: (linkedIn) => {
    return (
      <div className="flex gap-2 items-center" key="linkedin">
        <svg
          className="text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 50 50"
          width="16px"
          height="16px"
        >
          {" "}
          <path
            fill="#0077b5"
            d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"
          />
        </svg>
        <p className=" text-gray-600">{linkedIn}</p>
      </div>
    );
  },
  address: (address) => {
    return (
      <div className="flex gap-2 items-center" key="address">
        <MapPinIcon className="w-4 h-4 text-gray-600" />
        <p className=" text-gray-600">{address}</p>
      </div>
    );
  },
  currentEmployer: (currentEmployer) => {
    return (
      <div className="flex gap-2 items-center" key="currentemployer">
        <UserGroupIcon className="w-4 h-4 text-gray-600" />
        <p className=" text-gray-600">Current Employer: {currentEmployer}</p>
      </div>
    );
  },
  currentEmployment: (currentEmployment) => {
    return (
      <div className="flex gap-2 items-center" key="currentemployment">
        <BriefcaseIcon className="w-4 h-4 text-gray-600" />
        <p className=" text-gray-600">Current Role : {currentEmployment}</p>
      </div>
    );
  },
  availableFrom: (availableFrom) => {
    return (
      <div className="flex gap-2 items-center" key="availablefrom">
        <CalendarIcon className="w-4 h-4 text-gray-600" />
        <p className=" text-gray-600">Available From: {availableFrom}</p>
      </div>
    );
  },
  about: (about) => {
    return (
      <div className="flex gap-2 items-center" key="about">
        <p className=" text-gray-600 ">{about}</p>
      </div>
    );
  },
};
