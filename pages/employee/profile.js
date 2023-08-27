import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PencilSquareIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import notify from "../../utils/tostNotification";
import axios from "axios";
import { useSession } from "next-auth/react";
import InfoEditForm from "../../components/employee/InfoEditForm";
import Info from "../../components/Info";
import CircularProgress from "../../components/CircularProgress";
import dateFormater from "../../utils/dateFormater";
import imageResizer from "../../utils/imageResizer";
import { cloudinaryUploader } from "../../utils/cloudinaryUploader";
import _ from "lodash";

const Profile = () => {
  const { data: session } = useSession();
  const [showContactInfo, setShowContactInfo] = useState(true);
  const [showEmploymentInfo, setShowEmploymentInfo] = useState(true);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(true);
  const [linkedIn, setLinlinkedIn] = useState("");
  const [tel, setTel] = useState("");
  const [add, setAdd] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pf, setPf] = useState([]);
  const [cEmployer, setCEmployer] = useState("");
  const [cEmployment, setCEmployment] = useState("");
  const [aFrom, setAFrom] = useState("");
  const [info, setInfo] = useState("");
  const [image, setImage] = useState({});
  const [percentage, setPercentage] = useState(0);

  //toggle the contact information edit form
  const toggoleContactInfo = () => {
    setShowContactInfo(!showContactInfo);
  };
  //toggle the employment information edit form
  const toggoleEmploymentInfo = () => {
    setShowEmploymentInfo(!showEmploymentInfo);
  };
  //toggle the additional information edit form
  const toggoleAdditionalInfo = () => {
    setShowAdditionalInfo(!showAdditionalInfo);
  };
  const progressRef = useRef();
  const okRef = useRef();

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

  //fetch initla data
  useEffect(() => {
    async function fetchData() {
      try {
        const userResponse = await axios.get(`/api/public/user/${session?.id}`);
        setName(userResponse?.data?.name);
        setLastName(userResponse?.data?.lastName);
        setLinlinkedIn(userResponse?.data?.social);
        setAdd(userResponse?.data?.address);
        setTel(userResponse?.data?.phone);
        setAFrom(userResponse?.data?.availableFrom);
        setImage(userResponse?.data?.image ? userResponse?.data?.image : {});
        setPf(userResponse?.data?.privateFields);
        setInfo(userResponse?.data?.about);
        setCEmployer(userResponse?.data?.currentEmployer);
        setCEmployment(userResponse?.data?.currentEmployment);
      } catch (error) {
        notify("Something went wrong", "error");
      }
    }
    fetchData();
  }, []);
  //Set the the percentage of file to be upload
  useEffect(() => {
    let timeOutId;
    let timeOutId1;
    if (percentage <= 0) {
      if (progressRef?.current) {
        progressRef.current.style.display = "none";
        okRef.current.style.display = "none";
      }
    }
    if (percentage >= 1 && percentage <= 100) {
      progressRef.current.style.display = "flex";
      okRef.current.style.display = "none";
    }
    if (percentage === 100) {
      timeOutId = setTimeout(() => {
        progressRef.current.style.display = "none";
        okRef.current.style.display = "block";
      }, 1000);
    }
    if (percentage === 100) {
      timeOutId1 = setTimeout(() => {
        okRef.current.style.display = "none";
      }, 2000);
    }

    return () => {
      clearTimeout(timeOutId);
      clearTimeout(timeOutId1);
    };
  }, [percentage]);
  //Function to upload Image
  const handleUpload = async (e) => {
    let uploadedImage;
    let workprocess = 0;
    if (e.target.files && e.target.files.length > 0) {
      try {
        const file = e.target.files[0];
        const resizedImage = await imageResizer(file);
        setImage((pS) => ({ ...pS, url: resizedImage }));
        //Upload the image to cloudinary
        const uploadRes = await cloudinaryUploader.uploadImage(
          resizedImage,
          "profile_pic",
          setPercentage
        );
        workprocess = 1;
        uploadedImage = {
          url: uploadRes.url,
          publicId: uploadRes.public_id,
        };
        if (image?.publicId) {
          await cloudinaryUploader.deleteImage(image?.publicId);
          setImage((pS) => ({ ...pS, publicId: uploadRes.public_id }));
          workprocess = 2;
        }
        const imageRes = await axios.put(`/api/private/user/${session?.id}`, {
          image: uploadedImage,
        });
      } catch (error) {
        if (workprocess === 0) {
          notify(error.message, "error");
        }
        if (workprocess === 1) {
          try {
            await cloudinaryUploader.deleteImage(uploadedImage?.publicId);
          } catch (error) {
            notify("Something went wrong", "error");
          }
        }
        if (workprocess === 2) {
          notify("Something went wrong", "error");
        }
      }
    }
  };

  let displayName =
    name && lastName
      ? name + " " + lastName
      : !name && lastName
      ? lastName
      : name && !lastName
      ? name
      : "your name";

  return session?.role === "employee" ? (
    <div className="min-h-screen px-6 sm:px-10 py-10 flex flex-col items-center gap-6">
      <div className=" flex sm:flex-row flex-col justify-center items-center gap-10">
        <div className="flex gap-4 items-center order-last sm:order-first ">
          <p className="text-xl sm:text-3xl font-semibold uppercase text-gray-600">
            {displayName}
          </p>
        </div>
        <div className=" group relative w-16 h-16 rounded-full bg-gray-500 cursor-pointer ">
          <CheckCircleIcon
            ref={okRef}
            className="absolute rounded-full w-16 h-16 z-50 text-[#003A9B] "
          />
          {!image?.url ? (
            <div className="absolute rounded-full w-16 h-16 flex justify-center items-center font-semibold text-sm">
              LOGO
            </div>
          ) : (
            <Image
              fill
              src={image?.url}
              object-fit="contain"
              alt="CN"
              className="absolute rounded-full w-16 h-16 "
            />
          )}
          <div className="cursor-pointer absolute rounded-full w-16 h-16 bg-black/50 hidden group-hover:flex  items-center justify-center z-20 ">
            <label htmlFor="image" className="cursor-pointer">
              <PencilSquareIcon className=" w-6 h-6   text-white " />
              <input
                type="file"
                id="image"
                accept="image/jpeg, image/png"
                className="hidden"
                onChange={(e) => handleUpload(e)}
              />
            </label>
          </div>

          <CircularProgress percentage={percentage} ref={progressRef} />
        </div>
      </div>
      <div className="w-full flex flex-col items-center mt-10 sm:mt-0">
        <h2 className="text-primary-100 text-xl font-semibold">
          Contact Details
        </h2>
        <hr className="w-1/2 mb-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-100" />
      </div>
      {showContactInfo ? (
        <Info
          pf={pf}
          toggoleContactInfo={toggoleContactInfo}
          session={session}
          fields={{
            name: name,
            email: session?.user?.email,
            phone: tel,
            address: add,
            linkedIn: linkedIn,
          }}
        />
      ) : (
        <InfoEditForm
          formToRender="ContactInfo"
          id={session?.id}
          toggoleContactInfo={toggoleContactInfo}
          setTel={setTel}
          setAdd={setAdd}
          setLi={setLinlinkedIn}
          setName={setName}
          setLastName={setLastName}
          setPf={setPf}
          emailid={session?.user?.email}
          name={name}
          lastName={lastName}
          tel={tel}
          add={add}
          pf={pf}
          li={linkedIn}
        />
      )}
      <div className="w-full flex flex-col items-center mt-10 sm:mt-0">
        <h2 className="text-primary-100 text-xl font-semibold">
          Employment Details
        </h2>
        <hr className="w-1/2 mb-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-100" />
      </div>

      {showEmploymentInfo ? (
        <Info
          pf={pf}
          toggoleContactInfo={toggoleEmploymentInfo}
          session={session}
          fields={{
            currentEmployer: cEmployer,
            currentEmployment: cEmployment,
            availableFrom: dateFormater(aFrom),
          }}
        />
      ) : (
        <InfoEditForm
          formToRender="EmploymentInfo"
          id={session?.id}
          toggoleContactInfo={toggoleEmploymentInfo}
          setCEmployer={setCEmployer}
          setCEmployment={setCEmployment}
          setPf={setPf}
          setAFrom={setAFrom}
          aFrom={aFrom}
          cEmployer={cEmployer}
          cEmployment={cEmployment}
          pf={pf}
        />
      )}

      <div className="w-full flex flex-col items-center mt-10 sm:mt-0">
        <h2 className="text-primary-100 text-xl font-semibold">
          Additional Information
        </h2>
        <hr className="w-1/2 mb-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-100" />
      </div>
      {showAdditionalInfo ? (
        <Info
          pf={pf}
          toggoleContactInfo={toggoleAdditionalInfo}
          session={session}
          fields={{
            about: info,
          }}
        />
      ) : (
        <InfoEditForm
          formToRender="About"
          id={session?.id}
          toggoleContactInfo={toggoleAdditionalInfo}
          setPf={setPf}
          setInfo={setInfo}
          info={info}
          pf={pf}
        />
      )}
    </div>
  ) : (
    <div className="h-screen flex justify-center items-center text-gray-600">
      <p className=" flex justify-center items-center gap-2">
        <span className="text-2xl">401</span>{" "}
        <span className="block w-[1px] h-6 bg-gray-600" /> You are not
        authorized to visit this page
      </p>
    </div>
  );
};

Profile.requiredAuth = true;
export default Profile;
