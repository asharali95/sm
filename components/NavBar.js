import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import logo from "../public/images/Logo.png";
import logo1 from "../public/images/Logo1.png";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import EmployeeMenu from "../components/EmployeeMenu";
import EmployerMenu from "../components/EmployerMenu";
import MobileMenu from "../components/MobileMenu";
import "animate.css";
import Link from "next/link";
import { signOut } from "next-auth/react";
import ChangePasswordModal from "./auth/ChangePasswordModal";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const router = useRouter();
  const handleClick = (role) => {
    router.push(
      {
        pathname: `/auth/signin`,
        query: {
          role: role,
          origin: "navbar",
        },
      },
      `/auth/signin`
    );
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    if (menuRef.current.style.display === "none") {
      menuRef.current.style.display = "block";
      return;
    }
    menuRef.current.style.display = "none";
  };

  const menuRef = useRef(null);

  useEffect(() => {
    const closeModal = () => {
      if (menuRef.current) {
        menuRef.current.style.display = "none";
      }
    };
    document.addEventListener("click", closeModal);
    return () => {
      document.removeEventListener("click", closeModal);
    };
  }, [menuRef]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <nav className="shadow-[2px_-6px_20px_4px_rgba(0,0,0,0.3)] flex bg-white px-5 sm:px-10 py-4 h-[70px] items-center border-b-[1px] border-b-gray-200 relative z-50">
      <div className="w-1/2 md:w-3/12 flex items-center">
        <Link className="text-2xl font-semibold" href="/">
          {session && router.pathname !== "/" ? (
            <Image alt="logo" src={logo1} className="w-auto h-[50px]" />
          ) : (
            <Image alt="logo" src={logo} className="w-auto h-[40px]" />
          )}
        </Link>
      </div>
      <div className="w-1/2 md:w-9/12 flex justify-end items-center">
        <div className=" gap-4 hidden md:flex">
          {!session ? (
            <>
              <div
                onClick={() => handleClick("employee")}
                className="cursor-pointer text-gray-600"
              >
                Executives
              </div>
              <div className="h-[24px] w-[.5px] bg-gray-400 rounded-lg"></div>
              <div
                onClick={() => handleClick("employer")}
                className="cursor-pointer text-gray-600"
              >
                Recruiters
              </div>
            </>
          ) : session?.role === "site_admin" ? (
            <ul className="text-gray-600 flex gap-2">
              <li className="cursor-pointer" onClick={() => setOpen1(true)}>
                Change Password
              </li>
              <li>|</li>
              <li className="cursor-pointer" onClick={() => signOut()}>
                Logout
              </li>
            </ul>
          ) : (
            <div
              className="relative w-10 h-10 cursor-pointer"
              onClick={toggleMenu}
            >
              <UserCircleIcon className="w-10 h-10 text-gray-600 " />
              {session?.role === "employer" ? (
                <EmployerMenu menuRef={menuRef} session={session} />
              ) : (
                <EmployeeMenu menuRef={menuRef} session={session} />
              )}
            </div>
          )}
        </div>

        <div className="flex -mr-2 -my-2 md:hidden">
          <button
            type="button"
            className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary-100"
            onClick={() => setOpen(!open)}
          >
            <span className="sr-only">Open menu</span>
            {/* Heroicon name: outline/menu */}
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="fixed top-0 inset-x-0 p-2  md:hidden bg-black/40 w-screen h-screen ">
          <div className="rounded-lg shadow-lg w-full bg-white animate__animated animate__slideInRight">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div className="relative w-16 h-16 rounded-full flex justify-center items-center">
                  {session ? (
                    <Image
                      fill
                      object-fit="contain"
                      src={session?.user?.image?.url}
                      alt="User Image"
                      className="w-16 h-16 rounded-full object-center "
                    />
                  ) : (
                    <UserCircleIcon className="w-14 h-14 text-gray-600 " />
                  )}
                </div>
                <div className="-mr-2">
                  <button
                    type="button"
                    className="bg-white rounded-md p-2 inline-flex items-center justify-center  text-gray-600 hover:text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary-100"
                    onClick={() => setOpen(!open)}
                  >
                    <span className="sr-only">Close menu</span>

                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-4">
                {!session ? (
                  <>
                    <div
                      onClick={() => {
                        handleClick("employee");
                        setOpen(false);
                      }}
                      className="cursor-pointer bg-gray-200 rounded-lg px-2 "
                    >
                      <p className="px-3 py-2">Executives</p>
                    </div>

                    <div
                      onClick={() => {
                        handleClick("employer");
                        setOpen(false);
                      }}
                      className="cursor-pointer bg-gray-200 rounded-lg px-2  "
                    >
                      <p className="px-3 py-2"> Recruiters</p>
                    </div>
                  </>
                ) : session?.role === "site_admin" ? (
                  <ul className="text-gray-600 flex flex-col gap-2">
                    <li
                      className="cursor-pointer"
                      onClick={() => setOpen1(true)}
                    >
                      Change Password
                    </li>

                    <li className="cursor-pointer" onClick={() => signOut()}>
                      Logout
                    </li>
                  </ul>
                ) : (
                  <MobileMenu session={session} setOpen={setOpen} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {open1 && (
        <ChangePasswordModal open={open1} setOpen={setOpen1} role={"site_admin"} />
      )}
    </nav>
  );
}
