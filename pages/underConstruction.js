import Image from "next/image";
import React, { useState } from "react";
import logo from "../public/images/Logo.png";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import notify from "../utils/tostNotification";
import { ThreeCircles } from "react-loader-spinner";

const UnderConstruction = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submitEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await axios.get(`/api/public/sendEmail?email=${email}`);
    if (res.status === 200) {
      notify("We will notify you once we go live", "success");
    }
    setLoading(false);
    setEmail("");
  };
  return (
    <div className="h-screen flex justify-center items-center flex-col gap-8 px-4">
      <div>
        <Image alt="logo" src={logo} className="w-auto h-[50px] sm:h-[70px]" />
      </div>
      <div className="flex flex-col justify-center items-center gap-2">
        <p className="text-4xl text-gray-600">
          {" "}
          We are <span className="font-semibold">Almost</span> there!
        </p>
        <p className="text-xl text-gray-600">
          Stay tuned for something amazing!!!
        </p>
      </div>
      <div className="w-full flex justify-center items-center">
        <form className="flex gap-3 w-full sm:w-1/2 justify-center items-center">
          <input
            className="w-[70%] md:w-1/2 appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm transtion-all ease-in-out duration-200"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Your email"
            required
            true
          ></input>
          <button
            className="relative bg-primary-100 rounded-md px-3 py-2 text-white w-[30%] md:w-[20%] disabled:bg-gray-300 disabled:text-gray-600"
            onClick={submitEmail}
            disabled={!email}
          >
            Notify Me
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-20">
              {loading ? (
                <ThreeCircles
                  height="30"
                  width="30"
                  color="#2557a7"
                  ariaLabel="three-circles-rotating"
                />
              ) : null}
            </div>
          </button>
        </form>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

UnderConstruction.layout = "Blank";

export default UnderConstruction;
