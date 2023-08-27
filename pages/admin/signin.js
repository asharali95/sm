import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ResetPasswordModal from "../../components/auth/ResetPasswordModal";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { ThreeCircles } from "react-loader-spinner";
import useFormValidation from "../../hooks/useFormValidation";
import Error from "../../components/Error";
import notify from "../../utils/tostNotification";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const SignIn = () => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session?.role === "site_admin") {
      router.push("/admin");
      return;
    }
  }, [session?.role]);

  return <div className=" h-[calc(100vh_-_140px)] flex flex-col items-center justify-center px-2 py-4 overflow-hidden">
        <div
          style={{ backdropFilter: "blur(20px)" }}
          className=" w-full bg-tertiary-100/40  rounded-md shadow  md:mt-0 sm:max-w-md xl:p-0"
        >
          <CredentialSignInForm />
          <div className="px-8 flex flex-col sm:flex-row gap-2 items-center justify-between -mt-4 mb-8 text-sm font-light text-gray-600 ">
            <span
              onClick={() => setOpen(!open)}
              className="font-medium text-primary-600 hover:underline cursor-pointer underline"
            >
              Forgot password
            </span>
          </div>

          {open && <ResetPasswordModal open={open} setOpen={setOpen} />}
        </div>
      </div>
 
};
export default SignIn;


const CredentialSignInForm = () => {

      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [loading, setLoading] = useState(false);
      const [showPassword, setShowPassword] = useState("password");

      const router = useRouter();
      const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await signIn("credentials", {
          redirect: false,
          email: email,
          password: password,
        });
        setLoading(false);
        if (res?.error) {
          notify(res.error, "error");
        } else {
          router.replace("/admin");
        }
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
        password: password,
      });

  return (
    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-600 md:text-2xl text-center ">
        Sign In
      </h1>
      <form className="space-y-4 md:space-y-6" action="#">
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label>
          <input
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
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={`${
              errorFields.includes("email")
                ? " ring-2 ring-opacity-30 ring-red-600 bg-red-300/5"
                : ""
            } relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm transtion-all ease-in-out duration-200`}
            placeholder="email@company.com"
          />
          <div>
            <Error errorArray={inputError} fieldName={"email"} />
          </div>
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Password
          </label>
          <div className="relative group w-full">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword}
              name="password"
              id="password"
              placeholder="••••••••"
              className="relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10  hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm"
              required
            ></input>
            {showPassword === "password" ? (
              <EyeIcon
                onClick={() => {
                  setShowPassword("text");
                }}
                className="absolute w-4 h-4 text-gray-600 right-2 -translate-y-1/2 top-1/2 group-hover:cursor-pointer z-50 md:hidden group-hover:block"
              />
            ) : (
              <EyeSlashIcon
                onClick={() => {
                  setShowPassword("password");
                }}
                className="absolute w-4 h-4 text-gray-600 right-2 -translate-y-1/2 top-1/2 group-hover:cursor-pointer z-50  md:hidden group-hover:block"
              />
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || !filled || isError}
          onClick={handleSignIn}
          className=" relative w-full text-white bg-primary-100 hover:bg-primary-200 font-medium rounded-md text-sm px-5 py-2.5 text-center disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600"
        >
          LOGIN
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
  );
};


