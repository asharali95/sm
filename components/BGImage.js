import { useEffect, useState } from "react";
import Image from "next/image";
import Hero_BG from "../public/images/hero-bg.png";

function getWindowDimensions() {
  const { innerWidth: width } = window;
  return {
    width,
  };
}

function BGImage() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const { width } = getWindowDimensions();

    setWidth(width);
  }, []);

  useEffect(() => {
    function handleResize() {
      const { width } = getWindowDimensions();

      setWidth(width);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (width) {
    return (
      <div className="relative z-0 top-0">
        <Image src={Hero_BG} width={width} height={384} alt="hero_image" />
      </div>
    );
  }

  return null;
}

export default BGImage;
