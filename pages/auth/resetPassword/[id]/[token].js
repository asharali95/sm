import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TailSpin, ThreeCircles } from "react-loader-spinner";
import Error from "../../../../components/Error";
import useFormValidation from "../../../../hooks/useFormValidation";
import notify from "../../../../utils/tostNotification";

const ResetPassword = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { id, token } = router.query;
  const {
    inputError,
    validateForm,
    resetError,
    isFilled,
    isError,
    errorFields,
  } = useFormValidation();

  const filled = isFilled({
    password: password,
  });

  useEffect(() => {
    const verifyToken = async () => {
      setLoading(true);
      try {
        if (id && token) {
          const res = await axios.get(`/api/public/verifyEmail/${id}/${token}`);

          setLoading(false);
          if (res.status === 200) {
            setIsVerified(true);
          }
        }
      } catch (error) {
        setIsVerified(false);
        setLoading(false);
        if (error.response.status === 400) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Something Went wrong");
        }

        error.message;
      }
    };
    verifyToken();
  }, [id, token]);

  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      setResetLoading(true);
      const res = await axios.post(`/api/auth/changePassword`, {
        id: id,
        newPassword: password,
        action: "reset_password",
      });
      if (res.status === 200) {
        notify("Password has been reset successfully", "success");
      }
      setResetLoading(false);
      router.push(
        {
          pathname: `/auth/signin`,
          query: {
            role: "employer",
          },
        },
        `/auth/signin`
      );
    } catch (error) {
      setResetLoading(false);
      if (error.response.status === 400) {
        notify(error.response.data, "error");
        return;
      }
      notify("Something went wrong", "error");
    }
  };

  return (
    <div className="min-h-screen px-6 sm:px-10 py-10 flex flex-col items-center justify-center gap-6">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-10 bg-tertiary-100/40 rounded-lg w-full sm:w-[40%] shadow-lg">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-600 md:text-2xl text-center ">
          Reset Password
        </h1>
        {isVerified && !loading && !errorMessage && (
          <form className="space-y-4 md:space-y-6" action="#">
            <div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={(e) => resetError(e.target.name)}
                onBlur={(e) => {
                  validateForm({
                    value: e.target.value,
                    name: "password",
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                    title:
                      "Must Contain 8 Characters,One Uppercase,One Lowercase, One Number, & One Special Character",
                    message:
                      "Password Must Contain 8 Characters,One Uppercase,One Lowercase, One Number, & One Special Character",
                  });
                }}
                type="password"
                name="password"
                id="password"
                placeholder="New password"
                className={`${
                  errorFields.includes("password")
                    ? " ring-2 ring-opacity-30 ring-red-600 bg-red-300/5"
                    : ""
                } relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm transtion-all ease-in-out duration-200`}
                required
              ></input>
              {!errorFields.includes("password") ? (
                <p className="text-gray-600  text-xs mt-1">
                  Password Must Contain 8 Characters,One Uppercase,One
                  Lowercase, One Number, & One Special Character
                </p>
              ) : null}
              <div>
                <Error errorArray={inputError} fieldName={"password"} />
              </div>
            </div>
            <button
              type="submit"
              disabled={resetLoading || !filled || isError}
              onClick={(e) => resetPassword(e)}
              className=" relative w-full text-white bg-primary-100 hover:bg-primary-200 font-medium rounded-md text-sm px-5 py-2.5 text-center disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600"
            >
              SAVE
              <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-20">
                {resetLoading ? (
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
        )}
        {!isVerified && loading && !errorMessage && (
          <div className="p-6  sm:p-10 w-full flex justify-center items-center">
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
        {!isVerified && !loading && errorMessage && (
          <div className="p-6  sm:p-10  w-full flex gap-2 items-center justify-center">
            <ExclamationTriangleIcon className="text-red-600 w-6 h-6" />{" "}
            <p>{errorMessage} ,please try again!</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default ResetPassword;
