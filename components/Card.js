import React from "react";

export const Card = ({ children, style, handleClick, id, data, setter }) => {
  return (
    <div
      className={style}
      onClick={handleClick ? () => handleClick(id, data, setter) : () => {}}
    >
      {children}
    </div>
  );
};
export const CardHeader = ({ children, style }) => {
  return <div className={style}>{children}</div>;
};
export const CardSubHeader = ({ children, style }) => {
  return <div className={style}>{children}</div>;
};
export const CardBody = ({ children, style }) => {
  return (
    <div style={{ marginTop: "16px" }} className={style}>
      {children}
    </div>
  );
};
export const CardFooter = ({ children, style }) => {
  return (
    <div style={{ marginTop: "auto" }} className={style}>
      {children}
    </div>
  );
};
