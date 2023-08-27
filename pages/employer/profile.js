import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PencilSquareIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useSession } from "next-auth/react";
import InfoEditForm from "../../components/employer/InfoEditForm";
import Info from "../../components/Info";
import CircularProgress from "../../components/CircularProgress";
import { cloudinaryUploader } from "../../utils/cloudinaryUploader";
import imageResizer from "../../utils/imageResizer";
import notify from "../../utils/tostNotification";

const Profile = () => {
  const { data: session } = useSession();
  const [showContactInfo, setShowContactInfo] = useState(true);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(true);
  const [tel, setTel] = useState("");
  const [web, setWeb] = useState("");
  const [add, setAdd] = useState("");
  const [name, setName] = useState("");

  const [des, setDes] = useState("");

  const [cType, setCType] = useState("");
  const [linkedIn, setLinlinkedIn] = useState("");
  const [info, setInfo] = useState("");
  const [image, setImage] = useState({});
  const [isExternal, setIsExternal] = useState(false);
  const [percentage, setPercentage] = useState(0);

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

  //toggle the information edit form
  const toggoleContactInfo = () => {
    setShowContactInfo(!showContactInfo);
  };

  const toggoleAdditionalInfo = () => {
    setShowAdditionalInfo(!showAdditionalInfo);
  };

  const progressRef = useRef();
  const okRef = useRef();

  //fetch initla data
  useEffect(() => {
    async function fetchData() {
      try {
        const userResponse = await axios.get(`/api/public/user/${session?.id}`);
        setDes(userResponse?.data?.designation);
        setWeb(
          session?.userType === "admin"
            ? userResponse?.data?.website
            : userResponse?.data?.company?.website
        );
        setTel(userResponse?.data?.phone);
        setName(userResponse?.data?.name);
        setAdd(
          session?.userType === "admin"
            ? userResponse?.data?.address
            : userResponse?.data?.company?.address
        );

        setCType(
          session?.userType === "admin"
            ? userResponse?.data?.companyType
            : userResponse?.data?.company?.companyType
        );
        setInfo(userResponse?.data?.about);
        setLinlinkedIn(userResponse?.data?.social);
        setImage(userResponse?.data?.image ? userResponse?.data?.image : "");
        setName(
          userResponse?.data?.name ? userResponse?.data?.name : "Comapany Name"
        );
        setIsExternal(userResponse?.data?.isExternal);
      } catch (error) {
        notify("Something went wrong", "error");
      }
    }
    fetchData();
  }, []);

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
  //Function to handle upload file
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

  return session?.role === "employer" ? (
    <div className="min-h-screen px-6 sm:px-10 py-10 flex flex-col items-center gap-6">
      <div className=" flex sm:flex-row flex-col justify-center items-center gap-10">
        <div className="flex flex-col gap-2 items-center">
          <p className="text-xl sm:text-3xl font-semibold uppercase text-gray-600">
            {name
              ? name
              : session?.userType === "admin"
              ? "Your Compmany Name"
              : "Your Name"}
          </p>
          {isExternal && (
            <p className=" bg-red-500 text-white text-xs py-1 px-2 font-semibold ">
              External
            </p>
          )}
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
                className="hidden"
                onChange={(e) => handleUpload(e)}
              />
            </label>
          </div>

          <CircularProgress percentage={percentage} ref={progressRef} />
        </div>
      </div>
      <div className="w-full flex flex-col items-center">
        <h2 className="text-primary-100 text-xl font-semibold">
          Contact Details
        </h2>
        <hr className="w-1/2 mb-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-100" />
      </div>
      {showContactInfo ? (
        <Info
          toggoleContactInfo={toggoleContactInfo}
          session={session}
          fields={{
            name: name,
            email: session?.user?.email,
            phone: tel,
            address: add,
            website: web,
            companyType: cType,
            linkedIn: linkedIn,
            ...(session.userType !== "admin" ? { designation: des } : {}),
          }}
        />
      ) : (
        <InfoEditForm
          formToRender="ContactInfo"
          id={session?.id}
          toggoleContactInfo={toggoleContactInfo}
          setTel={setTel}
          setAdd={setAdd}
          setDes={setDes}
          setWeb={setWeb}
          setLi={setLinlinkedIn}
          setCType={setCType}
          setName={setName}
          emailid={session?.user?.email}
          name={name}
          tel={tel}
          web={web}
          des={des}
          add={add}
          cType={cType}
          li={linkedIn}
        />
      )}
      {session?.userType === "admin" && (
        <>
          <div className="w-full flex flex-col items-center">
            <h2 className="text-primary-100 text-xl font-semibold">About</h2>
            <hr className="w-1/2 mb-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-100" />
          </div>{" "}
          {showAdditionalInfo ? (
            <Info
              toggoleContactInfo={toggoleAdditionalInfo}
              fields={{
                about: info,
              }}
            />
          ) : (
            <InfoEditForm
              formToRender="About"
              id={session?.id}
              setInfo={setInfo}
              info={info}
              toggoleContactInfo={toggoleAdditionalInfo}
            />
          )}
        </>
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
