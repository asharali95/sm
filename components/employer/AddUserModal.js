import React, { useEffect, useState } from "react";

import { generate } from "generate-password";
import axios from "axios";
import _ from "lodash";
import {
  GeneralModal,
  ModalBody,
  ModalDivider,
  ModalHeader,
  ModalFooter,
} from "../UI/GeneralModal";
import { ThreeCircles } from "react-loader-spinner";
import notify from "../../utils/tostNotification";
import { useSession } from "next-auth/react";
import useFormValidation from "../../hooks/useFormValidation";
import Error from "../Error";

const AddUserModal = ({
  setOpenAddUserModal,
  userData: UD,
  userToEdit,
  setUserData,
  setUserToEdit,
}) => {
  const { data: session } = useSession();
  const [userEmail, setUserEmail] = useState(userToEdit?.email || "");
  const [userName, setUserName] = useState(userToEdit?.name || "");
  const [userDesignation, setUserDesignation] = useState(
    userToEdit?.designation || ""
  );
  const [userType, setUserType] = useState(
    userToEdit?.userType.includes("manager") ? "manager" : "executive" || ""
  );
  const [isAdmin, setIsAdmin] = useState(
    userToEdit?.userType.includes("admin") ? 1 : 0 || ""
  );
  const [supervisorId, setSupervisorId] = useState(userToEdit?.manager || "");
  const [loading, setLoading] = useState(false);
  const [isExternal, setIsExternal] = useState(false);

  const resetForm = () => {
    setUserEmail("");
    setUserName("");
    setUserDesignation("");
    setUserType("");
    setIsAdmin("");
    setSupervisorId("");
    setIsExternal(false);
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
          email: userEmail,
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

  let initialData = {};

  if (userToEdit?.email) {
    initialData.email = userToEdit?.email;
    initialData.name = userToEdit?.name;
    initialData.designation = userToEdit?.designation;
    initialData.userType = userToEdit?.userType;
    initialData.isExternal = userToEdit?.isExternal;
    if (userToEdit?.userType === "executive")
      initialData.manager = userToEdit?.manager;
  }

  const filled = isFilled({
    userEmail,
    userName,
    userDesignation,
  });

  const handleCreateUser = async () => {
    if (
      userType === "executive" &&
      !supervisorId &&
      session.userType !== "manager"
    )
      return notify("Please Select a manager", "warning");

    let password = generate({
      length: 10,
      numbers: true,
      lowercase: true,
      uppercase: true,
      symbols: true,
      strict: true,
    });

    try {
      if (userToEdit) {
        if (supervisorId === userToEdit._id) {
          return notify(
            "You are trying to edit a manager to officer, but for this you need to select a differnet manager",
            "error"
          );
        }
        let userData = {
          email: userEmail,
          name: userName,
          designation: userDesignation,
          isExternal,
          userType: Boolean(+isAdmin) ? `admin ${userType}` : userType,
          ...(userType === "executive" ? { manager: supervisorId } : {}),
        };
        if (_.isEqual(initialData, userData)) {
          notify("Nothing has changed", "warning");
          return;
        }
        let changesToSave = {};

        for (let key in initialData) {
          if (initialData[key] !== userData[key]) {
            changesToSave[key] = userData[key];
          }
        }

        if (
          initialData.userType.includes("manager") &&
          !userData.userType.includes("manager")
        ) {
          if (userToEdit.subOrdinates.length > 0)
            return notify(
              `This manager has  ${
                userToEdit.subOrdinates.length > 1
                  ? "subordinates"
                  : "subordinate"
              } ,please delete or assign  ${
                userToEdit.subOrdinates.length > 1 ? "them" : "him/her"
              } to other mamanger before changing user type`,
              "warning"
            );

          changesToSave.manager = supervisorId;
        }
        if (
          initialData.userType.includes("executive") &&
          !userData.userType.includes("executive")
        ) {
          delete changesToSave.manager;
        }
        setLoading(true);
        const res = await axios.put(
          `/api/private/user/${userToEdit?._id}`,
          changesToSave
        );
        const userRes = await axios.post("/api/private/user/getUserData", {
          userType: session?.userType,
          isCompany: session?.isCompany,
          company: session?.company,
          id: session?.id,
        });

        if (res.status === 200) {
          notify(`User has been edited successfully`, "success");
        }

        if (userRes.status === 200) {
          setUserData(userRes.data);
        }

        resetForm();
        setOpenAddUserModal(false);
        setLoading(false);
      } else {
        if (
          userType.includes("manager") &&
          UD?.managers
            ?.map((el) => el.designation.toLowerCase())
            .includes(userDesignation.toLowerCase())
        ) {
          return notify(`${userDesignation} alredy exists`, "warning");
        }
        setLoading(true);
        const res = await axios.post("/api/public/user/register", {
          email: userEmail,
          name: userName,
          isExternal,
          password: "#" + password + "@",
          role: "employer",
          userType: Boolean(+isAdmin) ? `admin ${userType}` : userType,
          company: session?.isCompany ? session?.id : session?.company,
          designation: userDesignation,
          purpose: "verify_email_to_create_user",
          ...(userType === "executive" && session?.userType !== "manager"
            ? { manager: supervisorId }
            : userType === "executive" && session?.userType === "manager"
            ? { manager: session?.id }
            : {}),
        });

        const res1 = await axios.post("/api/private/user/getUserData", {
          userType: session?.userType,
          isCompany: session?.isCompany,
          company: session?.company,
          id: session?.id,
        });

        if (res1.status === 200) {
          setUserData(res1.data);
        }

        if (res.status === 201) {
          notify(
            `User has been created successfully,We emailed a link to ${userEmail}`,
            "success"
          );
        }
        resetForm();
        setOpenAddUserModal(false);
        setLoading(false);
      }
    } catch (error) {
      notify("Something went wrong", "error");
    }
  };

  return (
    <GeneralModal>
      <ModalHeader
        callback={() => {
          setOpenAddUserModal(false);
          setUserToEdit(null);
        }}
        heading={"Create an user"}
      />
      <ModalDivider />
      <ModalBody>
        <div className="flex flex-col w-full p-6 items-center">
          <form className="w-[80%] space-y-4">
            {/* User Email */}
            <input
              value={userEmail}
              name="email"
              onChange={(e) => setUserEmail(e.target.value)}
              onFocus={(e) => resetError(e.target.name)}
              onBlur={(e) =>
                validateOnFetchedData({
                  value: e.target.value,
                  name: e.target.name,
                  message: "Please enter a valid email address",
                  exist: false,
                })
              }
              className={`${
                errorFields.includes("email")
                  ? " ring-2 ring-opacity-30 ring-red-600 bg-red-300/5"
                  : ""
              } relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm transtion-all ease-in-out duration-200`}
              type="email"
              placeholder="User Email"
            ></input>
            <div>
              <Error errorArray={inputError} fieldName={"email"} />
            </div>

            {/* User Name */}
            <input
              value={userName}
              name="userName"
              onChange={(e) => setUserName(e.target.value)}
              onFocus={(e) => resetError(e.target.name)}
              onBlur={(e) =>
                validateForm({
                  value: e.target.value,
                  name: e.target.name,
                  exist: false,
                  message: "Please enter a valid user name",
                })
              }
              className={`${
                errorFields.includes("userName")
                  ? " ring-2 ring-opacity-30 ring-red-600 bg-red-300/5"
                  : ""
              } relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm transtion-all ease-in-out duration-200`}
              type="text"
              placeholder="User Name"
            ></input>
            <div>
              <Error errorArray={inputError} fieldName={"userName"} />
            </div>
            {/* User Designation */}
            <input
              className={`${
                errorFields.includes("designation")
                  ? " ring-2 ring-opacity-30 ring-red-600 bg-red-300/5"
                  : ""
              } relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm transtion-all ease-in-out duration-200`}
              name="designation"
              value={userDesignation}
              onChange={(e) => setUserDesignation(e.target.value)}
              onFocus={(e) => resetError(e.target.name)}
              onBlur={(e) =>
                validateForm({
                  value: e.target.value,
                  name: e.target.name,
                  exist: false,
                  message: "Please enter a valid designation",
                })
              }
              type="text"
              placeholder="Designation"
            ></input>
            <div>
              <Error errorArray={inputError} fieldName={"designation"} />
            </div>
            {/* Select user type */}
            <select
              value={userType}
              onChange={(e) => {
                setUserType(e.target.value);
                if (e.target.value === "executive") setIsAdmin("");
              }}
              className="w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm transtion-all ease-in-out duration-200"
            >
              <option value="">Select User Type</option>
              {session.userType !== "manager" && (
                <option value={"manager"}>Manager</option>
              )}
              <option value={"executive"}>Officer</option>
            </select>
            {/* Choose if user is admin */}
            {session.userType !== "manager" && userType === "manager" && (
              <select
                className="w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm transtion-all ease-in-out duration-200"
                value={isAdmin}
                onChange={(e) => {
                  setIsAdmin(e.target.value);
                }}
              >
                <option value={""}>Is Admin</option>
                <option value={1}>Yes</option>
                <option value={0}>No</option>
              </select>
            )}
            {/* Select the respective manager */}
            {session.userType !== "manager" && userType === "executive" && (
              <select
                className="w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm transtion-all ease-in-out duration-200"
                value={supervisorId}
                onChange={(e) => {
                  setSupervisorId(e.target.value);
                }}
              >
                <option value={""}>Select Manager</option>
                {UD?.managers?.map((el) => (
                  <option key={el._id} value={el._id}>
                    {el.designation}
                  </option>
                ))}
              </select>
            )}

            {userType === "executive" && (
              <div className="flex gap-2 justify-start items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-gray-600 "
                  checked={isExternal}
                  onChange={() => {
                    setIsExternal(!isExternal);
                  }}
                />
                <p>Is External?</p>
              </div>
            )}
          </form>
        </div>
      </ModalBody>
      <ModalDivider />
      <ModalFooter>
        <div className="flex pt-2 pb-4 px-4 justify-end gap-2 items-center">
          <button
            disabled={
              !filled ||
              isError ||
              !userType ||
              (session?.userType.includes("admin") && userType === "manager")
                ? !isAdmin
                : false ||
                  (session?.userType.includes("admin") &&
                    userType === "executive")
                ? !supervisorId
                : false
            }
            onClick={() => handleCreateUser()}
            className={`relative ${
              !loading ? "bg-primary-100 text-white" : "bg-white text-gray-600"
            }  px-3 py-2   cursor-pointer rounded-lg shadow-lg disabled:bg-gray-300 font-semibold disabled:text-gray-600 `}
          >
            {userToEdit ? "Edit" : "Create"}
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
            onClick={() => {
              setOpenAddUserModal(false);
              setUserToEdit(null);
            }}
            className=" bg-red-500 px-3 py-2 text-white cursor-pointer rounded-lg shadow-lg font-semibold"
          >
            Cancel
          </button>

          {/*  */}
        </div>
      </ModalFooter>
    </GeneralModal>
  );
};

export default AddUserModal;
