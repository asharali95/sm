import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";

const EmailVerify = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { id, token } = router.query;

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
  const signIn = () => {
    router.push(
      {
        pathname: `/auth/signin`,
        query: {
          role: "employer",
        },
      },
      `/auth/signin`
    );
  };
  return (
    <div className="min-h-screen px-6 sm:px-10 py-10 flex flex-col items-center justify-center gap-6">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-10 bg-tertiary-100/40 rounded-lg w-full sm:w-[40%] shadow-lg ">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-600 md:text-2xl text-center ">
          Email Verification
        </h1>
        {isVerified && !loading && !errorMessage && (
          <div className="p-6  sm:p-10  w-full flex gap-2 items-center justify-center">
            <CheckCircleIcon className="w-10 h-10 text-secondary-100" />
            <p>
              Your email has been verfied successfully, you can login{" "}
              <span
                onClick={signIn}
                className="underline cursor-pointer font-semibold"
              >
                {" "}
                here
              </span>
            </p>
          </div>
        )}
        {!isVerified && loading && !errorMessage && (
          <div className="p-6  sm:p-10   w-full flex justify-center items-center">
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
export default EmailVerify;
