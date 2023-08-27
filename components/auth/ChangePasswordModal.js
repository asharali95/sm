import { useState } from "react";
import notify from "../../utils/tostNotification";
import axios from "axios";
import useFormValidation from "../../hooks/useFormValidation";
import Error from "../Error";
import "animate.css";
import { useSession, signOut } from "next-auth/react";
import { ThreeCircles } from "react-loader-spinner";
import { useRouter } from "next/router";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
const ChangePasswordModal = ({ open, setOpen, role }) => {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState("password");
  const [showNewPassword, setShowNewPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  //function to close modal
  const handleClose = () => {
    setOpen(!open);
    setLoading(false);
    setOldPassword("");
    setNewPassword("");
  };
  //custom validation hook call
  const {
    inputError,
    validateForm,
    resetError,
    isFilled,
    isError,
    errorFields,
  } = useFormValidation();

  //async form Validation

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
  }) => {
    if (value.length > 0) {
      axios
        .post("/api/private/user/checkPassword", {
          id: session?.id,
          oldPassword,
        })
        .then((user) => {
          let data = {};
          if (user?.data?.message === "NOT MATCHED") {
            data.result = true;
            data.message = "Wrong! old password";
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

  //check if the field(s) are filled
  const filled = isFilled({
    oldPassword: oldPassword,
    newPassword: newPassword,
  });
  //handle change password
  const changePassword = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/auth/changePassword`, {
        id: session?.id,
        newPassword,
        oldPassword,
        action: "reset_password",
      });
      if (res.status === 200) {
        notify("Password has been changed successfully", "success");
      }
      setLoading(false);
      setOpen(false);
//remove if not
      if (role === "site_admin") {
           signOut({
             redirect: true,
             callbackUrl: `/admin/signin`,
           });
           return;
         }

      signOut({
        redirect: true,
        callbackUrl: `/auth/signin?role=${role}`,
      });
    } catch (error) {
      setLoading(false);
      if (error.response.status === 400 || error.response.status === 401) {
        notify(error.response.data, "error");
        return;
      }
      notify("Something went wrong", "error");
    } finally {
      setOldPassword("");
      setNewPassword("");
    }
  };

  return open ? (
    <div
      className={`fixed  inset-0 z-50 flex flex-col items-center justify-center bg-black/20 `}
    >
      <div
        className={`bg-white flex flex-col  justify-center w-[90vw]   xs:w-[420px] rounded-lg shadow-lg animate__animated animate__slideInRight`}
      >
        <div className="flex justify-between w-full pb-2 pt-4 px-4">
          <div className="text-lg font-semibold text-gray-600">
            Change Password
          </div>
          <div
            className="font-semibold text-md text-gray-600 cursor-pointer"
            onClick={handleClose}
          >
            X
          </div>
        </div>
        <div className="w-full h-[0.5px] bg-gray-600/40"></div>
        <div className="py-2 px-4 flex flex-col gap-2 mt-4 relative group">
          <input
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            onFocus={(e) => resetError(e.target.name)}
            onBlur={(e) => {
              validateOnFetchedData({
                value: e.target.value,
                name: "oldPassword",
                message: "Please enter your old password",
              });
            }}
            type={showOldPassword}
            name="oldPassword"
            id="oldPassword"
            placeholder="Old Password"
            className={`${
              errorFields.includes("oldPassword")
                ? " ring-2 ring-opacity-30 ring-red-600 bg-red-300/5"
                : ""
            } relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm transtion-all ease-in-out duration-200`}
            required
          ></input>
          {showOldPassword === "password" ? (
            <EyeIcon
              onClick={() => {
                setShowOldPassword("text");
              }}
              className="absolute w-4 h-4 text-gray-600 right-6 translate-y-1/2 top-3 group-hover:cursor-pointer z-50 hidden group-hover:block"
            />
          ) : (
            <EyeSlashIcon
              onClick={() => {
                setShowOldPassword("password");
              }}
              className="absolute w-4 h-4 text-gray-600 right-6 translate-y-1/2 top-3 group-hover:cursor-pointer z-50  hidden group-hover:block"
            />
          )}
          <div>
            <Error errorArray={inputError} fieldName={"oldPassword"} />
          </div>
        </div>
        <div className="py-2 px-4 flex flex-col gap-2 relative group">
          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onFocus={(e) => resetError(e.target.name)}
            onBlur={(e) => {
              validateForm({
                value: e.target.value,
                name: "newPassword",
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                title:
                  "Must Contain at Least 8 Characters,One Uppercase,One Lowercase, One Number, & One Special Character",
                message:
                  "Password Must Contain at Least 8 Characters,One Uppercase,One Lowercase, One Number, & One Special Character",
              });
            }}
            type={showNewPassword}
            name="newPassword"
            id="newPassword"
            placeholder="New Password"
            className={`${
              errorFields.includes("newPassword")
                ? " ring-2 ring-opacity-30 ring-red-600 bg-red-300/5"
                : ""
            } relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm transtion-all ease-in-out duration-200`}
            required
          ></input>
          {showNewPassword === "password" ? (
            <EyeIcon
              onClick={() => {
                setShowNewPassword("text");
              }}
              className="absolute w-4 h-4 text-gray-600 right-6 translate-y-1/2 top-3 group-hover:cursor-pointer z-50  hidden group-hover:block"
            />
          ) : (
            <EyeSlashIcon
              onClick={() => {
                setShowNewPassword("password");
              }}
              className="absolute w-4 h-4 text-gray-600 right-6 translate-y-1/2 top-3 group-hover:cursor-pointer z-50  hidden group-hover:block "
            />
          )}
          {!errorFields.includes("newPassword") ? (
            <p className="text-gray-600  text-xs mt-1">
              Password Must Contain at Least 8 Characters,One Uppercase,One
              Lowercase, One Number, & One Special Character
            </p>
          ) : null}
          <div>
            <Error errorArray={inputError} fieldName={"newPassword"} />
          </div>
        </div>
        <div className="w-full h-[0.5px] bg-gray-600/40"></div>
        <div className="flex pt-2 pb-4 px-4 justify-end gap-2 items-center">
          <button
            disabled={loading || !filled || isError}
            onClick={changePassword}
            className="relative bg-primary-100 px-3 py-2  text-white cursor-pointer rounded-lg shadow-lg disabled:bg-gray-300 font-semibold disabled:text-gray-600"
          >
            Change
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

          <button
            onClick={handleClose}
            className=" bg-red-500 px-3 py-2 text-white cursor-pointer rounded-lg shadow-lg font-semibold"
          >
            Cancel
          </button>

          {/*  */}
        </div>
      </div>
    </div>
  ) : null;
};

export default ChangePasswordModal;
