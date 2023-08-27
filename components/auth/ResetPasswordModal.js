import React, { useState } from "react";
import notify from "../../utils/tostNotification";
import axios from "axios";
import useFormValidation from "../../hooks/useFormValidation";
import Error from "../Error";
import "animate.css";
import { TailSpin } from "react-loader-spinner";
const ResetPasswordModal = ({ open, setOpen }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(false);

  const handleClose = () => {
    setOpen(!open);
    setLoading(false);
    setMessage(false);
  };

  const {
    inputError,
    validateForm,
    resetError,
    isFilled,
    isError,
    errorFields,
  } = useFormValidation();

  const validateOnFetchedData = ({
    value,
    name,
    index,
    max,
    min,
    type,
    pattern,
    title,
    refValue,
    refName,
    message,
    exist,
  }) => {
    if (value.length > 0) {
      axios
        .post("/api/public/user/checkUser", {
          email: email,
        })
        .then((user) => {
          let data = {};
          if (!user.data?.result && exist) {
            data.result = true;
            data.message = "No account found associated with this email";
          }
          validateForm({
            value,
            name,
            index,
            max,
            min,
            type,
            data,
            pattern,
            title,
            refValue,
            refName,
            message,
          });
        });
    } else {
      validateForm({
        value,
        name,
        index,
        max,
        min,
        type,
        pattern,
        title,
        refValue,
        refName,
        message,
      });
    }
  };

  const filled = isFilled({
    email: email,
  });
  //handle apply
  const handleReset = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/resetPassword", {
        email: email,
      });
      setLoading(false);
      setMessage(true);
    } catch (error) {
      if (error.response.status === 400 || error.response.status === 401) {
        notify(error.response.data, "error");
      } else {
        notify("Something went wrong", "error");
      }
      setLoading(false);
      setMessage(false);
    }
  };

  return open ? (
    <div
      className={`fixed  inset-0 z-50 flex flex-col items-center justify-center bg-black/10 `}
    >
      <div
        className={`bg-white flex flex-col  justify-center w-[90vw]   xs:w-[420px] rounded-lg shadow-lg animate__animated animate__slideInRight`}
      >
        <div className="flex justify-between w-full pb-2 pt-4 px-4">
          <div className="text-lg font-semibold text-gray-600">
            Reset Password
          </div>
          <div
            className="font-semibold text-md text-gray-600 cursor-pointer"
            onClick={handleClose}
          >
            X
          </div>
        </div>
        <div className="w-full h-[0.5px] bg-gray-600/40"></div>
        <div className="py-8 px-4 flex flex-col gap-2">
          {!loading && !message && (
            <>
              <input
                name="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => resetError("email")}
                onBlur={(e) => {
                  validateOnFetchedData({
                    value: e.target.value,
                    name: "email",
                    message: "Please enter a valid email address",
                    exist: true,
                  });
                }}
                placeholder="Please enter your email address"
                className={`${
                  errorFields.includes("email")
                    ? " ring-2 ring-opacity-30 ring-red-600 bg-red-300/5"
                    : ""
                } relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm transtion-all ease-in-out duration-200`}
              />

              <div>
                <Error errorArray={inputError} fieldName={"email"} />
              </div>
            </>
          )}
          {loading && (
            <div className="w-full h-full flex justify-center items-center">
              <TailSpin
                height="60"
                width="60"
                color="#144D8E"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            </div>
          )}
          {message && (
            <div className="w-full h-full  text-start text-stone-600 ">
              We emailed a password reset link to
              <span className=" font-semibold inline"> {email}</span>, Check
              your inbox and click the link to reset your password.
            </div>
          )}
        </div>
        <div className="w-full h-[0.5px] bg-gray-600/40"></div>
        <div className="flex pt-2 pb-4 px-4 justify-end gap-2 items-center">
          {!message && (
            <button
              disabled={!filled || isError}
              onClick={handleReset}
              className=" bg-primary-100 px-3 py-2  text-white cursor-pointer rounded-lg shadow-lg disabled:bg-gray-300 font-semibold disabled:text-gray-600"
            >
              Reset
            </button>
          )}

          <button
            onClick={handleClose}
            className={`${
              message ? "bg-secondary-100 " : "bg-red-500"
            } px-3 py-2 text-white cursor-pointer rounded-lg shadow-lg font-semibold`}
          >
            {message ? "OK" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default ResetPasswordModal;
