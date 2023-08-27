import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import useHasMounted from "../../hooks/useHasMounted";
import notify from "../../utils/tostNotification";
import "animate.css";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import EditPageModal from "../../components/admin/EditPageModal";
import Image from "next/image";

function Dashboard() {
  const { data: session } = useSession();
  const hasMounted = useHasMounted();
  const [pageList, setPageList] = useState(null);
  const [index, setIndex] = useState(0);
  const [pageToEdit, setPageToEdit] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  //Logout a user if session expires
  useEffect(() => {
    if (session) {
      const sessionDuration =
        new Date(session?.expires).getTime() - new Date().getTime();

      const timeout = setTimeout(() => {
        if (new Date(session?.expires) < Date.now()) {
          signOut();
        }
      }, sessionDuration);
      return () => clearTimeout(timeout);
    }
  }, [session]);

  const handleEdit = (el) => {
    setOpen(true);
    setPageToEdit(el);
  };
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const pageResponse = await axios.get(`/api/private/page`);
        setLoading(false);
        setPageList(pageResponse.data.foundPages);
      } catch (error) {
        console.log(error);
        notify("Something went wrong", "error");
      }
    }
    fetchData();
  }, []);

  if (!hasMounted) return null;

  return session?.role === "site_admin" ? (
    <>
      <div className="min-h-screen px-10 flex flex-col  items-start mt-10 w-full text-gray-900">
        <div className="self-center py-6 mb-4 font-semibold text-gray-600 text-2xl">
          Manage Page
        </div>
        {pageList?.map((el) => (
          <div key={el?._id} className="flex flex-col justify-center items-start  bg-tertiary-100 w-full rounded-md mb-2 cursor-pointer shadow-lg">
            <div className="flex justify-between p-4 w-full items-center">
              <h1 className="text-start font-semibold  p-4">{el?.title}</h1>
              <ChevronDownIcon
                onClick={() => {
                  if (el?.order === index) {
                    setIndex(0);
                  } else {
                    setIndex(el.order);
                  }
                }}
                className={`w-6 h-6 ${
                  el?.order === index ? "rotate-180" : "rotate-0"
                } transition-all ease-in duration-300`}
              ></ChevronDownIcon>
            </div>

            <div
              className={` ${
                el?.order === index ? "opacity-100 h-96 " : "h-0 opacity-0  "
              }  overflow-y-scroll transition-all ease-in duration-300 bg-tertiary-200  rounded-b-md w-full`}
            >
              <div className="p-4 flex flex-col gap-6">
                <div
                  onClick={() => handleEdit(el)}
                  className="self-end px-3 py-2 bg-primary-100 shadow-lg text-white font-semibold text-sm rounded-lg"
                >
                  Edit
                </div>

                <Image
                  width="400"
                  height="150"
                  src={el?.image?.url}
                  className="w-screen h-96"
                />
                <div>Page Title: {el?.title}</div>
                {el?.para1 && <div>Paragraph 1: {el?.para1}</div>}
                {el?.para2 && <div>Paragraph 2: {el?.para2}</div>}
                {el?.para3 && <div>Paragraph 3: {el?.para3}</div>}
                {el?.para4 && <div>Paragraph 4: {el?.para4}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
      {open && pageToEdit && (
        <EditPageModal
          setPageList={setPageList}
          pageToEdit={pageToEdit}
          setPageToEdit={setPageToEdit}
          setOpen={setOpen}
          width={{ default: "90vw", sm: "60vw" }}
        />
      )}
    </>
  ) : (
    <div className="h-screen flex justify-center items-center text-gray-600">
      <p className=" flex justify-center items-center gap-2">
        <span className="text-2xl">401</span>{" "}
        <span className="block w-[1px] h-6 bg-gray-600" /> You are not
        authorized to visit this
      </p>
    </div>
  );
}

Dashboard.requiredAdminAuth = true;

export default Dashboard;
