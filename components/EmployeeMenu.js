import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Squares2X2Icon,
  NewspaperIcon,
  EnvelopeIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/solid";
import "animate.css";
const EmployeeMenu = ({ menuRef, session }) => {
  return (
    <div
      className="text-center absolute  top-[58px] right-0 bg-white text-gray-600  rounded drop-shadow-md ease-in duration-300 animate__flipInX animate__animated "
      ref={menuRef}
      style={{ display: "none" }}
    >
      <ul className="divide-y divide-dashed divide-gray-200 py-1 ">
        <li className="  px-4 py-1 ease-in duration-150">
          <a href="#">{session?.user?.email}</a>
        </li>
        <li className="hover:bg-gray-300 px-4 py-1 ease-in duration-150">
          <Link
            href="/employee/profile"
            className="flex items-center justify-start gap-2"
          >
            <Squares2X2Icon className="w-6 h-6" />
            Profile
          </Link>
        </li>
        <li className="hover:bg-gray-300 px-4 py-1 ease-in duration-150">
          <Link
            href="/employee/dashboard"
            className="flex items-center justify-start gap-2"
          >
            <NewspaperIcon className="w-6 h-6" />
            Dashboard
          </Link>
        </li>
        <li className="hover:bg-gray-300 px-4 py-1 ease-in duration-150">
          <Link
            href="/inbox"
            className="flex items-center justify-start gap-2"
          >
            <EnvelopeIcon className="w-6 h-6" />
            Inbox
          </Link>
        </li>
        <li
          className="hover:bg-gray-300 px-4 py-1 ease-in duration-150 flex items-center  justify-start gap-2 cursor-pointer"
          onClick={signOut}
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6" /> Logout
        </li>
      </ul>
    </div>
  );
};

export default EmployeeMenu;
