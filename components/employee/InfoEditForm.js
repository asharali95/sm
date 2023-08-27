import React from "react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import notify from "../../utils/tostNotification";
import { useSpring, animated } from "@react-spring/web";
import { useSession } from "next-auth/react";
const InfoEditForm = ({
  formToRender,
  toggoleContactInfo,
  setTel,
  setAdd,
  setLi,
  setName,
  setLastName,
  setPf,
  setCEmployer,
  setCEmployment,
  setAFrom,
  setInfo,
  id,
  tel,
  add,
  name,
  lastName,
  emailid,
  li,
  pf,
  cEmployer,
  cEmployment,
  aFrom,
  info,
}) => {
  //UseSpring hook for animarion

  const [props, api] = useSpring(
    () => ({
      from: {
        opacity: 0,
        clipPath: "polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%)",
      },
      to: {
        opacity: 1,
        clipPath: "polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)",
      },
    }),
    []
  );

  const [currentEmployer, setCurrentEmployer] = React.useState(cEmployer);
  const [currentEmployment, setCurrentEmployment] = React.useState(cEmployment);
  const [availableFrom, setAvailableFrom] = React.useState(aFrom?.slice(0, 10));
  const [about, setAbout] = React.useState(info);
  const [phone, setPhone] = React.useState(tel);
  const [fName, setFName] = React.useState(name);
  const [lName, setLName] = React.useState(lastName);
  const [linkedInAccout, setLinkedInAccout] = React.useState(li);
  const [address, setAddress] = React.useState(add);
  const today = new Date().toISOString().split("T")[0];
  const { data: session } = useSession();

  //Function to edit info
  const handleEditInfo = async () => {
    try {
      if (formToRender === "ContactInfo") {
        const res = await axios.put(`/api/private/user/${id}`, {
          phone: phone,
          address: address,
          social: linkedInAccout,
          name: fName,
          lastName: lName,
        });
        setTel(res?.data?.phone);
        setLi(res?.data?.social);
        setName(res?.data?.name);
        setLastName(res?.data?.lastName);
        setAdd(res?.data?.address);
        session.name = res?.data?.name;
      }
      if (formToRender === "EmploymentInfo") {
        const res = await axios.put(`/api/private/user/${id}`, {
          currentEmployer,
          currentEmployment,
          availableFrom: new Date(availableFrom),
        });

        setCEmployer(res?.data?.currentEmployer);
        setCEmployment(res?.data?.currentEmployment);
        setAFrom(res?.data?.availableFrom?.slice(0, 10));
      }

      if (formToRender === "About") {
        const res = await axios.put(`/api/private/user/${id}`, {
          about,
        });
        setInfo(res?.data?.about);
      }

      toggoleContactInfo();
      notify("Information Updated Successfully", "success");
    } catch (error) {
      console.log(error);
      notify("Something went wrong", "error");
    }
  };

  //Contact Info Edit Form
  const ContactInfo = (
    <>
      <div className="flex gap-2 w-full">
        <input
          id="email"
          readOnly
          value={emailid}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          type="text"
          autoComplete="email"
          required
          className="relative block w-full  appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-[#003A9B] focus:border-[#2557a7] focus:outline-none focus:ring-[#2557a7] sm:text-sm"
          placeholder="Your email"
        />
      </div>
      <div className="flex gap-2 w-full">
        <input
          id="fName"
          value={fName}
          onChange={(e) => setFName(e.target.value)}
          name="fName"
          type="text"
          autoComplete="fName"
          required
          className="relative block w-full  appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-[#003A9B] focus:border-[#2557a7] focus:outline-none focus:ring-[#2557a7] sm:text-sm"
          placeholder="Your First Name"
        />
      </div>

      <div className="flex gap-2 w-full">
        <input
          id="lName"
          value={lName}
          onChange={(e) => setLName(e.target.value)}
          name="lName"
          type="text"
          autoComplete="lName"
          required
          className="relative block w-full  appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-[#003A9B] focus:border-[#2557a7] focus:outline-none focus:ring-[#2557a7] sm:text-sm"
          placeholder="Your Last Name"
        />
      </div>

      <div className="flex gap-2 w-full">
        <input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          name="phone"
          type="text"
          autoComplete="phone"
          required
          className="relative block w-full  appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-[#003A9B] focus:border-[#2557a7] focus:outline-none focus:ring-[#2557a7] sm:text-sm"
          placeholder="Your Phone No."
        />
      </div>

      <div className="flex gap-2 w-full">
        <input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          name="address"
          type="text"
          autoComplete="address"
          required
          className="relative block w-full  appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-[#003A9B] focus:border-[#2557a7] focus:outline-none focus:ring-[#2557a7] sm:text-sm"
          placeholder="Your Location"
        />
      </div>

      <div className="flex gap-2 w-full">
        <input
          id="linkedInAccout"
          value={linkedInAccout}
          onChange={(e) => setLinkedInAccout(e.target.value)}
          name="text"
          type="linkedInAccout"
          autoComplete="linkedInAccout"
          required
          className="relative block w-full  appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-[#003A9B] focus:border-[#2557a7] focus:outline-none focus:ring-[#2557a7] sm:text-sm"
          placeholder="Your LinkedIn Accout "
        />
      </div>
    </>
  );
  //Employment Info Edit Form
  const EmploymentInfo = (
    <>
      <div className="flex gap-2 w-full ">
        <input
          id="currentEmployer"
          value={currentEmployer}
          onChange={(e) => setCurrentEmployer(e.target.value)}
          name="currentEmployer"
          type="text"
          autoComplete="currentEmployer"
          required
          className="relative block w-full  appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-[#003A9B] focus:border-[#2557a7] focus:outline-none focus:ring-[#2557a7] sm:text-sm"
          placeholder="Your current employer"
        />
      </div>

      <div className="flex gap-2 w-full">
        <input
          id="currentEmployment"
          value={currentEmployment}
          onChange={(e) => setCurrentEmployment(e.target.value)}
          name="currentEmployment"
          type="text"
          autoComplete="currentEmployment"
          required
          className="relative block w-full  appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-[#003A9B] focus:border-[#2557a7] focus:outline-none focus:ring-[#2557a7] sm:text-sm"
          placeholder="Your current employment"
        />
      </div>

      <div className="flex gap-2 w-full relative">
        <input
          onFocus={(e) => {
            e.target.type = "date";
          }}
          onBlur={(e) => {
            e.target.type = "text";
          }}
          onKeyDown={(e) => e.preventDefault()}
          min={today}
          id="availableFrom"
          value={availableFrom}
          onChange={(e) => {
            setAvailableFrom(e.target.value);
          }}
          name="availableFrom"
          type="text"
          autoComplete="availableFrom"
          required
          className="relative block w-full  appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-[#003A9B] focus:border-[#2557a7] focus:outline-none focus:ring-[#2557a7] sm:text-sm"
          placeholder="Available from"
        />
      </div>
    </>
  );
  //About Edit Form
  const About = (
    <div className="flex gap-2 w-full">
      <textarea
        rows="6"
        cols="50"
        id="about"
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        name="about"
        type="text"
        autoComplete="about"
        required
        className="relative block w-full  appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-[#003A9B] focus:border-[#2557a7] focus:outline-none focus:ring-[#2557a7] sm:text-sm"
        placeholder="About You"
      />
    </div>
  );

  return (
    <animated.div
      style={props}
      className="bg-gray-50 w-full md:w-1/2 px-2 md:px-4  py-4 md:py-8 rounded-md flex gap-4 justify-between items-center hover:bg-gray-200 cursor-pointer  hover:shadow-md"
    >
      <div className=" flex flex-col gap-8 w-full">
        {formToRender === "ContactInfo"
          ? ContactInfo
          : formToRender === "EmploymentInfo"
          ? EmploymentInfo
          : About}

        <div className="w-full flex justify-between sm:justify-center  items-center gap-2">
          <button
            className="self-center w-1/2 sm:w-1/3 px-3 py-2 rounded-md text-white font-semibold  bg-[#2557a7] hover:bg-[#003A9B]"
            onClick={() => {
              handleEditInfo();
            }}
          >
            Save
          </button>

          <button
            className="block sm:hidden self-center w-1/2 sm:w-1/3 px-3 py-2 rounded-md text-white  bg-red-600 font-semibold hover:bg-red-700"
            onClick={() => {
              toggoleContactInfo();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
      <div className="hidden sm:block" onClick={toggoleContactInfo}>
        <ChevronRightIcon className="w-8 h-8 stroke-[4] text-gray-600 " />
      </div>
    </animated.div>
  );
};

export default InfoEditForm;
