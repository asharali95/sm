import axios from "axios";
import React from "react";
import { ThreeCircles } from "react-loader-spinner";
import useFormValidation from "../../hooks/useFormValidation";
import Error from "../Error";
import notify from "../../utils/tostNotification";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const Register = ({ setShowSignIn }) => {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [isChecked, setIsChecked] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState("password");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "/api/public/user/register",
        {
          email: email,
          password: password,
          role: "employer",
          isCompany: true,
          userType: "admin",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 201) {
        notify(
          `We emailed a link to ${email} Check your inbox and click the link  to confirm your account`,
          "success"
        );
      }

      setLoading(false);
      setShowSignIn(false);
    } catch (error) {
      if (error.response.status === 400 || error.response.status === 401) {
        notify(error.response.data, "error");
      } else {
        notify("Something went wrong", "error");
      }
      setLoading(false);
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

          if (user?.data?.result && !exist) {
            data.result = true;
            data.message = "Email already registered";
          }
          validateForm({
            value,
            name,
            message,
            index,
            max,
            min,
            type,
            data,
            pattern,
            title,
            refValue,
            refName,
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
      });
    }
  };

  const filled = isFilled({
    email: email,
    password: password,
  });

  return (
    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-600 md:text-2xl text-center ">
        Create an account
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
            id="email-address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={(e) => resetError(e.target.name)}
            onBlur={(e) =>
              validateOnFetchedData({
                value: e.target.value,
                name: e.target.name,
                message: "Please enter a valid email address",
                exist: false,
              })
            }
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
          <div className="w-full relative group">
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
              type={showPassword}
              name="password"
              id="password"
              placeholder="••••••••"
              className={`${
                errorFields.includes("password")
                  ? " ring-2 ring-opacity-30 ring-red-600 bg-red-300/5"
                  : ""
              } relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm transtion-all ease-in-out duration-200`}
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
          {!errorFields.includes("password") ? (
            <p className="text-gray-600  text-xs mt-1">
              Password Must Contain 8 Characters,One Uppercase,One Lowercase,
              One Number, & One Special Character
            </p>
          ) : null}
          <div>
            <Error errorArray={inputError} fieldName={"password"} />
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              aria-describedby="terms"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-100  "
              required
            ></input>
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor="terms"
              className="font-light text-gray-600 dark:text-gray-300"
            >
              I accept the{" "}
              <a
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                href="#"
              >
                Terms and Conditions
              </a>
            </label>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || !filled || isError || !isChecked}
          onClick={(e) => {
            handleRegister(e);
          }}
          className=" relative px-6 py-2 rounded-md text-white  bg-primary-100 hover:bg-primary-200 w-full  disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600 transition"
        >
          Create an account
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

export default Register;
