import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Squares2X2Icon,
  NewspaperIcon,
  ArrowLeftOnRectangleIcon,
  ArrowPathIcon,
  UserGroupIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";
import "animate.css";

const EmployerMenu = ({ menuRef, session, setOpen }) => {
  return (
    <div
      className="text-center absolute  md:max-w-[200px]  top-[58px] right-0 bg-white text-gray-600  rounded drop-shadow-md ease-in duration-300 animate__flipInX animate__animated"
      ref={menuRef}
      style={{ display: "none" }}
    >
      <ul className="divide-y divide-dashed divide-gray-200 py-1 ">
        <li className="  px-4 py-1 ease-in duration-150 flex">
          <p className="w-full break-words">{session?.user.email}</p>
        </li>
        <li className="hover:bg-gray-300 px-4 py-1 ease-in duration-150">
          <Link
            href="/employer/dashboard"
            className="flex items-center justify-start gap-2"
          >
            <NewspaperIcon className="w-6 h-6" />
            Dashboard
          </Link>
        </li>
        <li className="hover:bg-gray-300 px-4 py-1 ease-in duration-150">
          <Link
            href="/employer/profile"
            className="flex items-center justify-start gap-2"
          >
            <Squares2X2Icon className="w-6 h-6" />
            Profile
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
        <li className="hover:bg-gray-300 px-4 py-1 ease-in duration-150">
          <Link
            href="/employer/account"
            className="flex items-center justify-start gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="w-6 h-6"
            >
              <path
                fill="#4B5563"
                id="XMLID_133_"
                d="M466.541,76.359H28.998C12.981,76.359,0,89.34,0,105.355v284.829c0,16.014,12.981,28.996,28.998,28.996
	h437.543c16.017,0,28.998-12.982,28.998-28.996V105.355C495.539,89.34,482.558,76.359,466.541,76.359z M252.641,125.116h108.858
	c6.805,0,12.324,5.521,12.324,12.324c0,6.804-5.52,12.324-12.324,12.324H252.641c-6.805,0-12.324-5.519-12.324-12.324
	C240.316,130.637,245.836,125.116,252.641,125.116z M192.818,214.617c-2.777,13.576-12.549,23.059-21.824,21.174
	c-0.914-0.185-1.749-0.555-2.567-0.931c-7.622,16.583-18.679,31.331-31.74,40.148v8.496c0,14.956,9.274,28.347,23.269,33.619
	c1.219,0.457,2.197,1.42,2.679,2.639c0.481,1.22,0.417,2.591-0.161,3.764l-19.609,39.635c-6.001,12.147-18.389,19.826-31.934,19.826
	c-13.543,0-25.93-7.679-31.931-19.826L59.39,323.526c-0.579-1.172-0.643-2.544-0.161-3.764c0.48-1.219,1.461-2.183,2.68-2.639
	c13.994-5.272,23.268-18.663,23.268-33.619v-8.496c-13.061-8.817-24.118-23.564-31.74-40.148c-0.818,0.376-1.654,0.746-2.567,0.931
	c-9.276,1.885-19.048-7.598-21.824-21.174c-2.743-13.584,2.535-26.124,11.843-28.018c0.48-0.097,0.963-0.041,1.461-0.08
	c0.498-40.927,30.953-73.968,68.582-73.968c37.631,0,68.087,33.041,68.586,73.968c0.498,0.039,0.979-0.017,1.46,0.08
	C190.281,188.493,195.561,201.033,192.818,214.617z M410.795,379.809H301.934c-6.802,0-12.321-5.52-12.321-12.324
	c0-6.803,5.52-12.324,12.321-12.324h108.861c6.805,0,12.324,5.521,12.324,12.324C423.119,374.289,417.6,379.809,410.795,379.809z
	 M443.658,314.083H252.641c-6.805,0-12.324-5.521-12.324-12.324c0-6.804,5.52-12.324,12.324-12.324h191.018
	c6.805,0,12.324,5.52,12.324,12.324C455.982,308.562,450.463,314.083,443.658,314.083z M443.658,248.355H252.641
	c-6.805,0-12.324-5.521-12.324-12.324c0-6.804,5.52-12.324,12.324-12.324h191.018c6.805,0,12.324,5.52,12.324,12.324
	C455.982,242.834,450.463,248.355,443.658,248.355z"
              />
            </svg>
            Account
          </Link>
        </li>
        {session.userType !== "executive" && (
          <li className="hover:bg-gray-300 px-4 py-1 ease-in duration-150">
            <Link
              href="/employer/manageuser"
              className="flex items-center justify-start gap-2"
            >
              <UserGroupIcon className="w-6 h-6" />
              Manage User
            </Link>
          </li>
        )}
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

export default EmployerMenu;
