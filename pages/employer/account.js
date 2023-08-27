import { useSession } from "next-auth/react";
import React, { useState } from "react";
import ChangePasswordModal from "../../components/auth/ChangePasswordModal";

const Account = () => {
  const { data: session } = useSession();
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  return (
    <div className=" px-10 md:px-20 pt-10 pb-6 w-full  flex gap-6 h-screen overflow-hidden">
      <div className="text-gray-600 flex md:justify-between w-full flex-col md:flex-row gap-2">
        <div>
          <p>
            Account:{" "}
            <span className="font-semibold">{session?.user.email}</span>
          </p>
        </div>
        <div>
          <p
            className="underline cursor-pointer "
            onClick={() => {
              setOpenChangePasswordModal(!openChangePasswordModal);
            }}
          >
            Change Password
          </p>
        </div>
      </div>
      {openChangePasswordModal && (
        <ChangePasswordModal
          open={openChangePasswordModal}
          role={"employer"}
          setOpen={setOpenChangePasswordModal}
        />
      )}
    </div>
  );
};
Account.requiredAuth = true;
export default Account;
