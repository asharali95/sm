import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AddUserModal from "../../components/employer/AddUserModal";
import axios from "axios";
import notify from "../../utils/tostNotification";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

function ManageUser() {
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);

  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post("/api/private/user/getUserData", {
          userType: session?.userType,
          isCompany: session?.isCompany,
          company: session?.company,
          id: session?.id,
        });

        if (res.status === 200) {
          setUserData(res.data);
        }
      } catch (error) {
        notify("Something went wrong while fetching data", "error");
      }
    };
    fetchData();
  }, []);

  const toggoleAdminAssignment = async (el) => {
    try {
      const res = await axios.put(`/api/private/user/${el?._id}`, {
        userType: el.userType === "admin manager" ? "manager" : "admin manager",
      });

      setUserData((pv) => {
        const newMnagers = pv?.managers?.map((el) => {
          if (el._id === res?.data?._id) {
            return { ...el, userType: res?.data?.userType };
          } else {
            return el;
          }
        });

        return {
          admin: pv.admin,
          managers: newMnagers,
        };
      });

      if (res.status === 200) {
        notify(
          el.userType === "admin manager"
            ? "Remove admin assignment successfully"
            : "Assign as admin successfully",
          "success"
        );
      }
    } catch (error) {
      notify("Something went wrong", "error");
    }
  };
  const handleDelete = async (el) => {
    if (el?.subOrdinates?.length > 0) {
      return notify(
        `This manager has  ${
          el?.subOrdinates?.length > 1 ? "subordinates" : "subordinate"
        } ,please delete or assign  ${
          el?.subOrdinates?.length > 1 ? "them" : "him/her"
        } to other mamanger before deleting this user`,
        "warning"
      );
    }
    try {
      const res = await axios.put(`/api/private/user/${el?._id}`, {
        deleted: true,
      });
      const userRes = await axios.post("/api/private/user/getUserData", {
        userType: session?.userType,
        isCompany: session?.isCompany,
        company: session?.company,
        id: session?.id,
      });

      if (res.status === 200) {
        setUserData(userRes.data);
      }

      if (res.status === 200) {
        notify("User has been deleted successfully", "success");
      }
    } catch (error) {
      if (error.response.status === 403) {
        return notify(
          "Please remove job assignment before deleting this user",
          "error"
        );
      }
      notify("Something went wrong", "error");
    }
  };

  return (
    <div className="min-h-screen px-10 flex flex-col  items-center w-full mt-10 relative">
      <button
        onClick={() => setOpenAddUserModal(true)}
        className=" self-end rounded-md bg-primary-100 px-2 py-1 shadow-lg text-white"
      >
        {" "}
        Add user
      </button>

      {openAddUserModal && (
        <AddUserModal
          setOpenAddUserModal={setOpenAddUserModal}
          userData={userData}
          userToEdit={userToEdit}
          setUserData={setUserData}
          setUserToEdit={setUserToEdit}
        />
      )}

      <div className="w-full flex flex-col gap-16">
        {(session.userType === "admin" ||
          session.userType === "admin manager") && (
          <div className=" flex justify-center items-center">
            {userData?.admin?.map((el) => (
              <div
                key={el._id}
                className="w-[130px] h-[170px] bg-gray-50  relative group flex flex-col drop-shadow-md"
              >
                {el?.image?.url ? (
                  <Image
                    src={el?.image?.url}
                    alt="User Image"
                    width={130}
                    height={130}
                    className="object-cover h-[130px] w-[130px]"
                  />
                ) : (
                  <UserIcon className=" text-gray-400 w-[130px] drop-shadow-lg" />
                )}
                <div className="font-semibold text-xs text-tertiary-200 px-2">
                  <p>{el?.name}</p>
                  <p>{el?.designation}</p>
                </div>
                <div className="absolute top-0  flex  items-end gap-1 h-[130px]">
                  {el.userType?.split(" ")?.map((el) => (
                    <span
                      key={el._id}
                      style={{ fontSize: "8px" }}
                      className={` flex justify-center items-center h-4  px-2 py-1 text-white ${
                        el === "admin"
                          ? "bg-primary-200"
                          : el === "manager"
                          ? "bg-secondary-100"
                          : ""
                      }   shadow-md font-semibold `}
                    >
                      {el?.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <div
          className={`w-full flex flex-col gap-8 ${
            userData?.managers?.length > 1
              ? "justify-between"
              : "justify-center"
          }  items-center`}
        >
          {userData?.managers?.map((el) => (
            <div
              key={el._id}
              className={`w-1/${userData?.managers?.length}   sm:h-[384px] flex flex-col items-center justify-center`}
            >
              <div className="flex flex-col items-center justify-center gap-6">
                <div className="w-[130px] h-[170px] bg-gray-50  relative group flex flex-col drop-shadow-md ">
                  {el?.image?.url ? (
                    <Image
                      src={el?.image?.url}
                      alt="User Image"
                      width={130}
                      height={130}
                      className="object-cover h-[130px] w-[130px]"
                    />
                  ) : (
                    <UserIcon className=" text-gray-400 w-[130px] drop-shadow-lg" />
                  )}
                  <div className="font-semibold text-xs text-tertiary-200 px-2">
                    <p>{el?.name}</p>
                    <p>{el?.designation}</p>
                  </div>
                  <div className="absolute top-0  flex  items-end gap-1 h-[130px]">
                    {el.userType?.split(" ")?.map((el) => (
                      <span
                        key={el._id}
                        style={{ fontSize: "8px" }}
                        className={` flex justify-center items-center h-4  px-2 py-1 text-white ${
                          el === "admin"
                            ? "bg-primary-200"
                            : el === "manager"
                            ? "bg-secondary-100"
                            : ""
                        }   shadow-md font-semibold `}
                      >
                        {el?.toUpperCase()}
                      </span>
                    ))}
                  </div>

                  {session?.userType === "admin manager" &&
                    session?.id !== el._id && (
                      <div className="w-full h-full absolute inset-0 bg-black/70 group-hover:flex group-hover:flex-col justify-center items-center text-xs font-semibold hidden transition-all ease-in-out duration-200 cursor-pointer text-white text-center">
                        <ul className="flex flex-col gap-3">
                          <li
                            onClick={() => {
                              setUserToEdit(el);
                              setOpenAddUserModal(true);
                            }}
                          >
                            Edit User
                          </li>
                          <li
                            onClick={() => {
                              handleDelete(el);
                            }}
                          >
                            Delete User{" "}
                          </li>

                          <li
                            onClick={() => {
                              toggoleAdminAssignment(el);
                            }}
                          >
                            {el?.userType === "admin manager"
                              ? "Remove admin Assignment"
                              : "Assign as Admin"}
                          </li>
                        </ul>
                      </div>
                    )}
                  {session?.userType === "admin" && (
                    <div className="w-full h-full absolute inset-0 bg-black/70 group-hover:flex group-hover:flex-col justify-center items-center text-xs font-semibold hidden transition-all ease-in-out duration-200 cursor-pointer text-white text-center">
                      <ul className="flex flex-col gap-3">
                        <li
                          onClick={() => {
                            setUserToEdit(el);
                            setOpenAddUserModal(true);
                          }}
                        >
                          Edit User
                        </li>
                        <li
                          onClick={() => {
                            handleDelete(el);
                          }}
                        >
                          Delete User{" "}
                        </li>

                        <li
                          onClick={() => {
                            toggoleAdminAssignment(el);
                          }}
                        >
                          {el?.userType === "admin manager"
                            ? "Remove Admin Assignment"
                            : "Assign as Admin"}
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row justify-canter gap-10 items-center p-4 border-dotted border-[1px] border-primary-100  ">
                  {el?.subOrdinates?.map((el1) => (
                    <div
                      key={el1._id}
                      className="w-[130px] h-[170px] bg-gray-50  relative group flex flex-col drop-shadow-md"
                    >
                      {el1?.image?.url ? (
                        <Image
                          src={el1?.image?.url}
                          alt="User Image"
                          width={130}
                          height={130}
                          className="object-cover h-[130px] w-[130px]"
                        />
                      ) : (
                        <UserIcon className=" text-gray-400 w-[130px] drop-shadow-lg" />
                      )}
                      <div className="font-semibold text-xs text-tertiary-200 px-2">
                        <p>{el1?.name}</p>
                        <p>{el1?.designation}</p>
                      </div>

                      <div className="w-full h-full absolute inset-0 bg-black/70 group-hover:flex group-hover:flex-col justify-center items-center text-xs font-semibold hidden transition-all ease-in-out duration-200 cursor-pointer text-white text-center">
                        <ul className="flex flex-col gap-3">
                          <li
                            onClick={() => {
                              setUserToEdit(el1);
                              setOpenAddUserModal(true);
                            }}
                          >
                            Edit User
                          </li>
                          <li
                            onClick={() => {
                              handleDelete(el1);
                            }}
                          >
                            Delete User{" "}
                          </li>
                        </ul>
                      </div>

                      {el1?.isExternal && (
                        <div className="absolute top-0  flex  items-end gap-1 h-[130px]">
                          <span
                            style={{ fontSize: "8px" }}
                            className={` flex justify-center items-center h-4  px-2 py-1 text-white bg-red-600 shadow-md font-semibold"`}
                          >
                            EXTERNAL
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

ManageUser.requiredAuth = true;

export default ManageUser;
