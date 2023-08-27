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
  setWeb,
  setAdd,
  setCType,
  setLi,
  setName,
  setDes,
  id,
  tel,
  web,
  add,
  name,
  emailid,
  cType,
  li,
  des,
  info,
  setInfo,
}) => {
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
  const [phone, setPhone] = React.useState(tel);
  const [about, setAbout] = React.useState(info);
  const [companyName, setCompanyName] = React.useState(name);
  const [linkedInAccout, setLinkedInAccout] = React.useState(li);
  const [website, setWebsite] = React.useState(web);
  const [address, setAddress] = React.useState(add);
  const [email, setEmail] = React.useState(emailid);
  const [companyType, setCompanyType] = React.useState(cType);
  const [designation, setDesidesignation] = React.useState(des);

  const { data: session } = useSession();

  const handleEditInfo = async () => {
    try {
      if (formToRender === "ContactInfo") {
        const res = await axios.put(`/api/private/user/${id}`, {
          phone: phone,
          social: linkedInAccout,
          name: companyName,
          ...(session.userType === "admin"
            ? { address: address, website: website, companyType: companyType }
            : {}),
        });
        session.name = res?.data?.name;
        session.companyName =
          res?.data?.userType !== "admin"
            ? res?.data?.company?.name
            : res?.data?.name;
        session.companyAddress =
          res?.data?.userType !== "admin"
            ? res?.data?.company?.address
            : res?.data?.address;
        session.phone = res?.data?.phone;

        session.social = res?.data?.social;
        session.companyWebsite =
          res?.data?.userType !== "admin"
            ? res?.data?.company?.website
            : res?.data?.website;
        session.companyType =
          res?.data?.userType !== "admin"
            ? res?.data?.company?.companyType
            : res?.data?.companyType;
        session.userType = res?.data?.userType;
        session.isCompany = res?.data?.isCompany;
        session.designation = res?.data?.designation;
        session.about = res?.data?.about ? true : false;

        session.userType === "admin"
          ? res?.data?.website
          : res?.data?.company?.website;
        setTel(res?.data?.phone);
        session?.userType === "admin" && setWeb(res?.data?.website);
        session?.userType === "admin" && setAdd(res?.data?.address);
        session?.userType === "admin" && setCType(res?.data?.companyType);
        setLi(res?.data?.social);
        setName(res?.data?.name);
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
      notify("Something went wrong", "error");
    }
  };

  const About = (
    <div className="flex gap-2 w-full">
      <textarea
        id="about"
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        rows="6"
        cols="50"
        name="about"
        form="usrform"
        autoComplete="about"
        placeholder="About Company"
        className="relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-[#003A9B] focus:border-[#2557a7] focus:outline-none focus:ring-[#2557a7] sm:text-sm"
      ></textarea>
    </div>
  );

  const ContactInfo = (
    <>
      {" "}
      <div className="flex gap-2 w-full">
        <input
          id="email"
          readOnly
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          type="text"
          autoComplete="email"
          required
          className="relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-[#003A9B] focus:border-[#2557a7] focus:outline-none focus:ring-[#2557a7] sm:text-sm"
          placeholder="email"
        />
      </div>
      <div className="flex gap-2 w-full">
        <input
          id="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          name="companyName"
          type="tel"
          autoComplete="companyName"
          required
          className="relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-[#003A9B] focus:border-[#2557a7] focus:outline-none focus:ring-[#2557a7] sm:text-sm"
          placeholder={
            session?.userType === "admin" ? "Your Company Name" : "Your Name"
          }
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
          className="relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-[#003A9B] focus:border-[#2557a7] focus:outline-none focus:ring-[#2557a7] sm:text-sm"
          placeholder={
            session?.userType === "admin"
              ? "Company Phone Number"
              : "Phone Number"
          }
        />
      </div>
      {session?.userType === "admin" && (
        <div className="flex gap-2 w-full">
          <input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            name="address"
            type="text"
            autoComplete="address"
            required
            className="relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-[#003A9B] focus:border-[#2557a7] focus:outline-none focus:ring-[#2557a7] sm:text-sm"
            placeholder="Company Location"
          />
        </div>
      )}
      {session?.userType === "admin" && (
        <div className="flex gap-2 w-full">
          <input
            id="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            name="text"
            type="website"
            autoComplete="website"
            required
            className="relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-[#003A9B] focus:border-[#2557a7] focus:outline-none focus:ring-[#2557a7] sm:text-sm"
            placeholder="Company Website "
          />
        </div>
      )}
      {session?.userType === "admin" && (
        <div className="flex gap-2 w-full">
          <select
            id="companyType"
            value={companyType}
            onChange={(e) => setCompanyType(e.target.value)}
            name="text"
            required
            className="relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-[#003A9B] focus:border-[#2557a7] focus:outline-none focus:ring-[#2557a7] sm:text-sm"
          >
            <option value="">Select Company Type</option>
            <option value="Direct">Direct</option>
            <option value="Agency">Agency</option>
          </select>
        </div>
      )}
      <div className="flex gap-2 w-full">
        <input
          id="linkedInAccout"
          value={linkedInAccout}
          onChange={(e) => setLinkedInAccout(e.target.value)}
          name="text"
          type="linkedInAccout"
          autoComplete="linkedInAccout"
          required
          className="relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-[#003A9B] focus:border-[#2557a7] focus:outline-none focus:ring-[#2557a7] sm:text-sm"
          placeholder={
            session?.userType === "admin"
              ? "Company LinkedIn Account"
              : "Your LinkedIn Account"
          }
        />
      </div>
      {session?.userType !== "admin" && (
        <div className="flex gap-2 w-full">
          <input
            id="designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            name="text"
            type="designation"
            autoComplete="designation"
            required
            className="relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-[#003A9B] focus:border-[#2557a7] focus:outline-none focus:ring-[#2557a7] sm:text-sm"
            placeholder="your Designation "
          />
        </div>
      )}
    </>
  );
  return (
    <animated.div
      style={props}
      className="bg-gray-50 w-full md:w-1/2 px-2 md:px-4  py-4 md:py-8 rounded-md flex gap-4 justify-between items-center hover:bg-gray-200 cursor-pointer  hover:shadow-m"
    >
      <div className=" flex flex-col gap-8 w-full">
        {formToRender === "ContactInfo" ? ContactInfo : About}
        <div className="w-full flex justify-between sm:justify-center  items-center gap-2">
          <button
            className="self-center w-1/2 sm:w-1/3 px-3 py-2 rounded-md text-white font-semibold bg-primary-100 hover:bg-[#003A9B]"
            onClick={() => {
              handleEditInfo();
              toggoleContactInfo();
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
