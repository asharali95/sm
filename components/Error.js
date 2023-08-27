import React from "react";

const Error = ({ errorArray, fieldName, index }) => {
  let foundIndex;
  index
    ? (foundIndex = errorArray.findIndex(
        (el) => el.name === fieldName + "_" + index
      ))
    : (foundIndex = errorArray.findIndex((el) => el.name === fieldName));

  if (foundIndex <= -1) {
    return null;
  } else {
    return (
      <ul>
        {errorArray[foundIndex].message.map((el, index) => (
          <li key={index} className="text-red-600 font-semibold text-xs mt-1">
            {el}
          </li>
        ))}
      </ul>
    );
  }
};

export default Error;
