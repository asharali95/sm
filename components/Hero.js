// import Image from "next/image";
// import React from "react";
// import Hero_BG from "../public/images/hero-bg.png";
// import SearchBox from "./SearchBox";

import React from "react";

const Hero = ({ children }) => {
  return (
    <div className=" xxs:h-[50vh] sm:h-[70vh] hero-bg flex justify-center items-center ">
      {children}
    </div>
  );
};

// const Hero = ({ children }) => {
//   return (
//     <div className="h-96 w-full relative overflow-hidden  ">
//       <Image
//         src={Hero_BG}
//         priority
//         className=""
//         object-fit="cover"
//         width="6016"
//         height="1894"
//         alt="hero_image"
//       />
//       {children}
//     </div>
//   );
// };

export default Hero;
