import { XCircleIcon } from "@heroicons/react/24/solid";
import React from "react";

const GeneralModal = ({
  children,
  animation,
  width,
  background,
  borderRadious,
  shadow,
}) => {
  const modelWidth = (width) => {
    let string = "";
    for (let [key, value] of Object.entries(width)) {
      if (key === "default") string += `w-[${value}] `;
      else string += `${key}:w-[${value}] `;
    }
    return string;
  };
  return (
    <div
      className={`fixed  inset-0 z-50 flex flex-col items-center justify-center bg-black/20 `}
    >
      <div
        className={`
        ${background ? background : "bg-white"}
        ${width ? modelWidth() : "w-[90vw] xs:w-[420px]"}
        flex flex-col  
        justify-center 
        ${borderRadious ? borderRadious : "rounded-lg"}
        ${shadow ? shadow : "shadow-lg"}
        animate__animated 
        ${animation ? animation : "animate__slideInRight"}
        relative
        `}
      >
        {children}
      </div>
    </div>
  );
};

const ModalHeader = ({
  heading,
  callback,
  textColor,
  fontWeight,
  fontSize,
  IconSize,
  IconPosition,
  IconColor,
}) => {
  return (
    <div className="flex justify-between w-full pb-2 pt-4 px-4">
      <div
        className={`
      ${textColor ? textColor : "text-gray-600"} 
      ${fontWeight ? fontWeight : "font-semibold"} 
      ${fontSize ? fontSize : "text-lg"} 
        `}
      >
        {heading}
      </div>

      <XCircleIcon
        onClick={() => callback()}
        className={`absolute  
        ${IconSize ? IconSize : "w-8 h-8"} 
        ${IconPosition ? IconPosition : "-top-2 -right-2"}
        ${IconColor ? IconColor : "text-gray-600 "}
         z-50
         cursor-pointer `}
      />
    </div>
  );
};

const ModalDivider = () => {
  return <div className="w-full h-[0.5px] bg-gray-600/40"></div>;
};

const ModalBody = ({ children }) => {
  return <>{children}</>;
};
const ModalFooter = ({ children }) => {
  return <>{children}</>;
};

export { GeneralModal, ModalHeader, ModalBody, ModalDivider, ModalFooter };
