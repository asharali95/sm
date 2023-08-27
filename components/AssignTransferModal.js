import React, { useState } from "react";
import {
  GeneralModal,
  ModalBody,
  ModalHeader,
  ModalDivider,
  ModalFooter,
} from "./UI/GeneralModal";
import { useSession } from "next-auth/react";
import notify from "../utils/tostNotification";
import axios from "axios";

const AssignTransferModal = ({
  userData,
  jobsToAssignOrTransfer,
  mode,
  setOpenAssignTransferModal,
  setJobs,
  jobs,
}) => {
  const [user, setUser] = useState("");
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);


  //depending on the user type and mode of action(transfer/assign) create the user list to show on drop down
  let newUserData = [];
  if (userData && session?.userType === "manager" && mode === "assign") {
    newUserData = userData?.managers?.[0]?.subOrdinates.filter(
      (el) =>
        el._id !==
        jobsToAssignOrTransfer?.assignment?.[
          jobsToAssignOrTransfer?.assignment?.length - 1
        ]?.assignedTo
    );
  }
  //depending on the user type and mode of action(transfer/assign) create the user list to show on drop down
  if (userData && session?.userType === "manager" && mode === "transfer") {
    newUserData = userData?.otherManagers;
  }
  //depending on the user type and mode of action(transfer/assign) create the user list to show on drop down
  if (userData && session?.userType?.includes("admin") && mode === "transfer") {
    newUserData = userData?.managers.filter((el) => el?._id !== session?.id);
  }
  //depending on the user type and mode of action(transfer/assign) create the user list to show on drop down
  if (
    userData?.managers &&
    session?.userType?.includes("admin") &&
    mode === "assign"
  ) {
    newUserData = userData.managers
      .flatMap((manager) => [manager, ...(manager.subOrdinates || [])])
      .filter((user) => user?._id !== session?.id)
      .filter(
        (el) =>
          el._id !==
          jobsToAssignOrTransfer?.assignment?.[
            jobsToAssignOrTransfer?.assignment?.length - 1
          ]?.assignedTo
      );
  }

  //handle transfer /assignment of job

  const handleAssignTransfer = async () => {
    const assignOrder =
      jobsToAssignOrTransfer?.assignment?.length > 0
        ? jobsToAssignOrTransfer?.assignment?.[
            jobsToAssignOrTransfer?.assignment?.length - 1
          ]?.order + 1
        : Number(0);
    const transferOrder =
      jobsToAssignOrTransfer?.transfer?.length > 0
        ? jobsToAssignOrTransfer?.transfer?.[
            jobsToAssignOrTransfer?.transfer?.length - 1
          ]?.order + 1
        : Number(0);
    try {
      setLoading(true);
      const res = await axios.put("/api/private/assignandtransfer", {
        assignedTo: user,
        jobId: jobsToAssignOrTransfer?._id,
        userId: session?.id,
        action: mode,
        userType: session?.userType,
        ...(mode === "transfer" ? { transfarredTo: user } : {}),
        ...(mode === "transfer"
          ? { assignOrder, transferOrder }
          : { assignOrder }),
      });

      setJobs((preJobs) => {
        let newJobs;
        if (
          session.userType === "admin" ||
          session.userType === "admin manager"
        ) {
          newJobs = preJobs.map((el) =>
            el._id === res?.data?.updatedJob?._id ? res?.data?.updatedJob : el
          );
        } else if (session.userType === "manager") {
          userData.managers
            .flatMap((el) => [el._id, ...el.subOrdinates.map((el) => el?._id)])
            .includes(
              res?.data?.updatedJob?.assignment?.[
                res?.data?.updatedJob?.assignment?.length - 1
              ]?.assignedTo
            )
            ? (newJobs = preJobs.map((el) =>
                preJobs._id === res?.data?.updatedJob?._id
                  ? res?.data?.updatedJob
                  : el
              ))
            : (newJobs = preJobs.filter(
                (el) => el._id !== res?.data?.updatedJob?._id
              ));
        }

        return newJobs;
      });

      if ((res.status = 200)) {
        let msg =
          mode === "transfer"
            ? "Job has been transfarred successfully"
            : "Job has been assigned successfully";
        notify(msg, "success");
      }
    } catch (error) {
    
      notify("Something went wrong", "error");
    } finally {
      setLoading(false);
      setUser("");
      setOpenAssignTransferModal(false);
    }
  };

  return (
    <GeneralModal>
      <ModalHeader
        heading={mode === "assign" ? "Assign this job" : "Transfer this job"}
        callback={() => setOpenAssignTransferModal(false)}
      />
      <ModalDivider />
      <ModalBody>
        <div className="w-full p-4 flex flex-col gap-4">
          {mode === "assign" && (
            <p>
              Current assignment:{" "}
              {userData.managers
                .flatMap((manager) => [
                  manager,
                  ...(manager.subOrdinates || []),
                ])
                .concat(userData?.admin)
                .filter(
                  (el) =>
                    el?._id ===
                    jobsToAssignOrTransfer?.assignment?.[
                      jobsToAssignOrTransfer?.assignment?.length - 1
                    ]?.assignedTo
                )?.[0]
                ?.name.toUpperCase()}
            </p>
          )}

          <select
            className="w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm transtion-all ease-in-out duration-200"
            value={user}
            onChange={(e) => {
              setUser(e.target.value);
            }}
          >
            <option value={""}>
              {mode === "assign" ? "Select User" : "Select Manager"}
            </option>
            {newUserData?.map((el) => (
              <option
                key={el._id}
                className={`
                ${el?.isExternal ? "font-semibold text-red-600" : ""}
                ${
                  el?.userType?.includes("manager")
                    ? "font-semibold"
                    : "text-gray-600"
                }`}
                value={el?._id}
              >{`${el?.designation}->${el?.name} ${
                el?.isExternal ? "(External)" : ""
              }`}</option>
            ))}
          </select>
        </div>
      </ModalBody>
      <ModalDivider />
      <ModalFooter>
        <div className="flex justify-end gap-2 p-4">
          <button
            disabled={!user || loading}
            onClick={() => {
              handleAssignTransfer();
            }}
            className=" px-3 py-2 bg-primary-100 text-white text-sm rounded-lg shadow-lg disabled:bg-slate-200 disabled:text-gray-700 disabled:cursor-not-allowed cursor-pointer"
          >
            {mode === "assign" ? "Assign" : "Transfer"}
          </button>
          <button className=" px-3 py-2 bg-red-500 text-white text-sm rounded-lg shadow-lg cursor-pointer">
            Cancel
          </button>
        </div>
      </ModalFooter>
    </GeneralModal>
  );
};

export default AssignTransferModal;
