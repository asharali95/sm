import { signIn } from "next-auth/react";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import { ThreeCircles } from "react-loader-spinner";
import useFormValidation from "../../hooks/useFormValidation";
import Error from "../Error";
import notify from "../../utils/tostNotification";

const MagicLinkSignInForm = ({ origin, jobId }) => {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn(
      "email",
      {
        email: email || "",
        redirect: false,
        callbackUrl: "/",
      },
      { jobId, origin }
    ).catch((e) =>console.log(e));
    setLoading(false);
    if (res?.error) {
      notify(res.error, "error");

      return;
    }
    setShowModal(true);
  };

  const {
    inputError,
    validateForm,
    resetError,
    isFilled,
    isError,
    errorFields,
  } = useFormValidation();

  const filled = isFilled({
    email: email,
  });

  return (
    <div className="h-[calc(100vh_-_140px)] flex flex-col items-center justify-center px-4 py-4">
      <form
        style={{ backdropFilter: "blur(20px)" }}
        className="mt-4 rounded-lg shadow-md  bg-tertiary-100/40 px-4 py-6 sm:px-8 sm:py-8 space-y-6 w-auto flex flex-col items-center justify-center"
      >
        <p className="mt-2 text-normal text-center  text-gray-700 leading-loose">
          {origin === "save"
            ? "Your email is needed to save your interest to your existing or new account."
            : origin === "apply"
            ? "Your email is needed to register your interest to your existing or new account"
            : origin === "navbar"
            ? "Your email is needed to send you a magic link so you can easily login or create a new account"
            : ""}

          <br />
          <span className="text-sm">
            {origin === "navbar"
              ? ""
              : "We will send you a magic link so you can easily login or create a new account."}
          </span>
        </p>

        <div className="flex flex-col space-y-1 w-full md:w-[60%] justify-center items-center">
          <label htmlFor="email" className="text-gray-500 text-sm self-start">
            Email address
          </label>
          <input
            name="email"
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => resetError("email")}
            onBlur={(e) => {
              validateForm({
                value: e.target.value,
                name: "email",
                message: "Please enter a valid email address",
              });
            }}
            placeholder="example@example.com"
            className={`${
              errorFields.includes("email")
                ? " ring-2 ring-opacity-30 ring-red-600 bg-red-300/5"
                : ""
            } relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm transtion-all ease-in-out duration-200`}
          />
          <div className="self-start">
            <Error errorArray={inputError} fieldName={"email"} />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || !filled || isError}
          onClick={handleSignIn}
          className=" w-full md:w-[60%] relative px-6 py-2 rounded-md text-white  bg-primary-100 hover:bg-primary-200  disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600 transition"
        >
          Send Magic Link
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
        <p className="mt-2 text-sm text-center font-thin text-gray-600 leading-loose">
          We respect your privacy. Your email will remain anonymous.
        </p>
      </form>

      {showModal ? <ConfirmationModal email={email} /> : null}
    </div>
  );
};

export default MagicLinkSignInForm;
