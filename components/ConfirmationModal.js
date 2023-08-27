import React, { useState } from "react";
import notify from "../utils/tostNotification";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";
import useFormValidation from "../hooks/useFormValidation";
import Error from "./Error";
import "animate.css";
const ConfirmationModal = ({
  open,
  setOpen,
  message,
  id,
  setId,
  appliedJobs,
  savedJobs,
  setSavedJobs,
  setAppliedJobs,
  profile,
}) => {
  const [firstName, setFirstName] = useState("");
  const { data: session } = useSession();
  const router = useRouter();
  const handleClose = () => {
    setId ? setId(null) : null;
    setOpen(!open);
  };

  const { inputError, validateForm, resetError, isFilled, isError } =
    useFormValidation();

  const filled = isFilled({
    firstName: firstName,
  });
  //handle apply
  const handleProceed = async () => {
    try {
      const userRes = await axios.put(`/api/private/user/${session?.id}`, {
        name: firstName,
      });
      if (!session?.name) {
        session.name = userRes?.data?.name;
      }
      if (savedJobs?.includes(id) && !appliedJobs?.includes(id)) {
        let response = await axios.put(
          `/api/private/user/applySave/${session?.id}`,
          {
            jobId: id,
            action: "applyAndUnsave",
            dashboard: true,
          }
        );
        let updatedJobListAndUser = response?.data?.result;
        setSavedJobs(updatedJobListAndUser?.updatedUser?.savedJobs);
        setAppliedJobs(updatedJobListAndUser?.updatedUser?.appliedJobs);
        notify("Added to interest list, successfully", "success");
      } else {
        let response = await axios.put(
          `/api/private/user/applySave/${session?.id}`,
          {
            jobId: id,
            action: "apply",
            dashboard: true,
          }
        );
        let updatedJobListAndUser = response?.data?.result;
        setSavedJobs(updatedJobListAndUser?.updatedUser?.savedJobs);
        setAppliedJobs(updatedJobListAndUser?.updatedUser?.appliedJobs);
        notify("Added to interest list, successfully", "success");
      }
    } catch (error) {
      notify("Something Went wrong", "error");
    } finally {
      setId(null);
      setOpen(!open);
    }
  };
  //Redirect to profile page
  const handleProfile = () => {
    setId ? setId(null) : null;
    setOpen(!open);
    router.push({
      pathname: `/${profile}/profile`,
    });
  };

  return open ? (
    <div
      className={`fixed  inset-0 z-50 flex flex-col items-center justify-center bg-black/10 `}
    >
      <div
        className={`bg-white flex flex-col  justify-center w-[90vw]   xs:w-[420px] rounded-lg shadow-lg animate__animated animate__bounceIn`}
      >
        <div className="flex justify-between w-full pb-2 pt-4 px-4">
          <div
            className={`  text-gray-500 ${
              profile === "employee" ? "text-sm" : "text-2xl font-semibold"
            }`}
          >
            {profile === "employee"
              ? "We only need your first name to identify your account"
              : "Alert"}
          </div>
          <div
            className="font-semibold text-md text-gray-500 cursor-pointer"
            onClick={handleClose}
          >
            X
          </div>
        </div>
        <div className="w-full h-[0.5px] bg-gray-600/40"></div>
        <div className="py-8 px-4 flex flex-col gap-4">
          {profile === "employee" ? (
            <>
              <input
                name="firstName"
                id="firstName"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onFocus={() => resetError("firstName")}
                onBlur={(e) => {
                  validateForm({
                    value: e.target.value,
                    name: "firstName",
                    min: 5,
                    max: 30,
                  });
                }}
                placeholder="Your first name"
                className="py-2 px-4 w-full border rounded-md border-gray-300 focus:outline-none focus:ring-4 focus:ring-opacity-20 focus:border-[#2557a7] focus:ring-[#2557a7] transition disabled:opacity-50 disabled:cursor-not-allowed "
              />

              <div>
                <Error errorArray={inputError} fieldName={"firstName"} />
              </div>
            </>
          ) : (
            <p className="py-2 px-4 bg-yellow-200 rounded-sm text-red-700">
              {message}
            </p>
          )}
          {profile === "employee" && (
            <p className="text-xs font-thin text-center">
              We respect your privacy. All other profile details remain
              anonymous unless chosen not to.
            </p>
          )}
        </div>
        <div className="w-full h-[0.5px] bg-gray-600/40"></div>
        <div className="flex pt-2 pb-4 px-4 justify-end gap-2 items-center">
          {profile === "employee" ? (
            <button
              disabled={!filled || isError}
              onClick={handleProceed}
              className=" bg-primary-100 px-3 py-2  text-white cursor-pointer rounded-lg shadow-lg disabled:bg-gray-300 font-semibold disabled:text-gray-600"
            >
              Proceed
            </button>
          ) : (
            <button
              onClick={handleProfile}
              className=" bg-primary-100 px-3 py-2 text-white cursor-pointer rounded-lg shadow-lg font-semibold"
            >
              Update Profile
            </button>
          )}

          <button
            onClick={handleClose}
            className=" bg-red-500 px-3 py-2 text-white cursor-pointer rounded-lg shadow-lg font-semibold"
          >
            Close
          </button>

          {/*  */}
        </div>
      </div>
    </div>
  ) : null;
};

export default ConfirmationModal;
