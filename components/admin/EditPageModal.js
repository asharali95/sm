import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { PlusCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import ImagePlaceholder from "../../public/images/image_placeholder.png";
import imageResizer from "../../utils/imageResizer";
import { cloudinaryUploader } from "../../utils/cloudinaryUploader";
// import notify from "../utils/tostNotification";
import axios from "axios";
import _ from "lodash";
import notify from "../../utils/tostNotification";

const EditPageModal = ({ pageToEdit, setOpen, setPageToEdit, setPageList }) => {
  const initialData = {};

  if (pageToEdit) {
    initialData.title = pageToEdit?.title;
    initialData.para1 = pageToEdit?.para1;
    initialData.para2 = pageToEdit?.para2;
    initialData.para3 = pageToEdit?.para3;
    initialData.para4 = pageToEdit?.para4;
  }
  const { data: session } = useSession();
  const [title, setTitle] = useState(pageToEdit?.title || "");
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(
    pageToEdit?.image?.url || ImagePlaceholder
  );
  const [para1, setPara1] = useState(pageToEdit?.para1 || "");
  const [para2, setPara2] = useState(pageToEdit?.para2 || "");
  const [para3, setPara3] = useState(pageToEdit?.para3 || "");
  const [para4, setPara4] = useState(pageToEdit?.para4 || "");
  const [loading, setLoading] = useState(false);

  let changedData = {};

  changedData.title = title;
  changedData.para1 = para1;
  changedData.para2 = para2;
  changedData.para3 = para3;
  changedData.para4 = para4;

  // ${
  //   errorFields.includes("title")
  //     ? " ring-2 ring-opacity-30 ring-red-600 bg-red-300/5"
  //     : ""
  // }

  const resetForm = () => {
    setTitle("");
    setImageUrl("");
    setPara1("");
    setPara2("");
    setPara3("");
    setPara4("");
    setPageToEdit(null);
    setOpen(false);
  };

  const handleFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedImageUrl = URL.createObjectURL(e.target.files[0]);
      setImageUrl(selectedImageUrl);
      setFile(e.target.files[0]);
    }
  };
  //Romove file from preview
  const removeFile = (e) => {
    setImageUrl(ImagePlaceholder);
    setFile(null);
  };

  //Update User
  const handleEditPage = async () => {
    let image;
    let workprocess = 0;
    //Check if any data has changed
    if (
      _.isEqual(initialData, changedData) &&
      pageToEdit?.image?.url === imageUrl
    ) {
      notify("Nothing has changed", "warning");
      return;
    }

    // Check if any image selected
    if (imageUrl === ImagePlaceholder) {
      notify("Please select an image to upload", "warning");
      return;
    }

    const changesToSave = {};
    //Getting the changed data to save in db
    for (const key in initialData) {
      if (initialData[key] !== changedData[key]) {
        changesToSave[key] = changedData[key];
      }
    }
    //Update  the page data if any other field change except image
    setLoading(true);
    if (
      (imageUrl === ImagePlaceholder || imageUrl === pageToEdit?.image?.url) &&
      !_.isEmpty(changesToSave)
    ) {
      try {
        const pageRes = await axios.put(
          `/api/private/page/${pageToEdit?._id}`,
          { ...changesToSave }
        );
        let updatedPage = pageRes?.data?.updatedPage;

        setPageList((pl) => {
          return pl.map((el) => {
            if (el._id === updatedPage._id) {
              return updatedPage;
            } else {
              return el;
            }
          });
        });
        notify("Page has been edited successfully", "success");
      } catch (error) {
        notify("Something went wrong", "error");
      } finally {
        setLoading(false);
        resetForm();
      }
      return;
    }
    //Update page the data with image
    if (imageUrl !== ImagePlaceholder && pageToEdit?.image?.url !== imageUrl) {
      try {
        const resizedImage = await imageResizer(file, 300, 150);
        //Upload the image to cloudinary
        const uploadRes = await cloudinaryUploader.uploadImage(
          resizedImage,
          "page_pic"
        );

        workprocess = 1;
        image = {
          url: uploadRes?.url,
          publicId: uploadRes?.public_id,
        };
        changesToSave.image = image;

        const pageRes = await axios.put(
          `/api/private/page/${pageToEdit?._id}`,
          {
            ...changesToSave,
          }
        );
        let updatedPage = pageRes?.data?.updatedPage;
        setPageList((pl) => {
          return pl.map((el) => {
            if (el._id === updatedPage._id) {
              return updatedPage;
            } else {
              return el;
            }
          });
        });
        notify("Page has been edited successfully", "success");
        workprocess = 2;
        if (pageToEdit?.image?.publicId) {
          await cloudinaryUploader.deleteImage(pageToEdit?.image?.publicId);
        }
      } catch (error) {
        if (workprocess === 1) {
          try {
            await cloudinaryUploader.deleteImage(image.publicId);
          } catch (error) {
            notify("Something went wrong", "error");
          }
        }
        if (workprocess === 2) {
          notify("Something went wrong", "error");
        }
      } finally {
        setLoading(false);
        resetForm();
      }
    }
  };

  return (
    <div
      style={{ height: "100%" }}
      className=" bg-gray-700/30  z-50 fixed inset-0 flex justify-center items-center  "
    >
      <div
        className="px-3 flex flex-col  items-center justify-center  bg-gray-50 w-[90%] md:w-1/2 py-10  rounded-lg   max-h-[90%]
      animate__animated animate__slideInRight relative
        "
      >
        <XCircleIcon
          className="absolute  w-8 h-8  -top-2 -right-2  z-50 text-gray-600 cursor-pointer  "
          onClick={() => {
            setPageToEdit(null);
            setOpen(!open);
          }}
        />
        <div className="w-[95%] self-start flex flex-col items-center justify-center gap-1 mb-6">
          <p className=" text-gray-500 font-semibold">Edit Page</p>
          <hr className="w-full mb-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-100" />
        </div>
        <div
          className="flex flex-col w-full scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-500 scrollbar-thumb-rounded-full
        scrollbar-track-rounded-full  scrollbar-track-h-20 scrollbar-track-mt-2 overflow-y-scroll gap-4"
        >
          <div className="w-full flex justify-center items-center mt-7">
            <div className="relative border-[1px] border-dotted border-gray-400  h-[160px] w-[150px] sm:w-[300px]  group cursor-pointer">
              <Image
                src={imageUrl}
                alt="Page Image"
                width={300}
                height={155}
                className="object-cove  w-[150px] sm:w-[300px] h-[155px] p-2"
              />

              <div
                onClick={() => {
                  removeFile();
                }}
                className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-gray-500 flex justify-center items-center text-white  text-sm  cursor-pointer"
              >
                X
              </div>
              <div className="absolute -translate-x-1/2 left-1/2 -translate-y-1/2 top-1/2 group-hover:block hidden">
                <label htmlFor="image">
                  <PlusCircleIcon className="w-12 h-12 text-gray-600/50 cursor-pointer" />
                </label>
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  onChange={(e) => handleFile(e)}
                />
              </div>
            </div>
          </div>

          <div className={`w-full flex justify-center items-center`}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              id="job-title"
              name="title"
              type="text"
              required
              className={`
             
              
               w-[90%] appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm`}
              placeholder="Page Title"
            />
          </div>

          <div className={`w-full flex justify-center items-center`}>
            {/* <Error errorArray={inputError} fieldName={"title"} /> */}
          </div>

          <div className={`w-full flex justify-center items-center`}>
            <textarea
              value={para1}
              onChange={(e) => setPara1(e.target.value)}
              placeholder="Paragraph one"
              name="para1"
              cols={40}
              rows={6}
              className={`  w-[90%] appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm`}
            />
          </div>
          <div className={`w-full flex justify-center items-center`}>
            <textarea
              value={para2}
              onChange={(e) => setPara2(e.target.value)}
              placeholder="Paragraph one"
              name="para2"
              cols={40}
              rows={6}
              className={`  w-[90%] appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm`}
            />
          </div>
          <div className={`w-full flex justify-center items-center`}>
            <textarea
              value={para3}
              onChange={(e) => setPara3(e.target.value)}
              placeholder="Paragraph one"
              name="para3"
              cols={40}
              rows={6}
              className={`  w-[90%] appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm`}
            />
          </div>
          <div className={`w-full flex justify-center items-center`}>
            <textarea
              value={para4}
              onChange={(e) => setPara4(e.target.value)}
              placeholder="Paragraph one"
              name="para4"
              cols={40}
              rows={6}
              className={`  w-[90%] appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm`}
            />
          </div>

          <div className="flex justify-center gap-2 p-4">
            <button
              disabled={loading}
              onClick={handleEditPage}
              className=" px-3 py-2 bg-primary-100 text-white text-sm rounded-lg shadow-lg disabled:bg-slate-200 disabled:text-gray-700 disabled:cursor-not-allowed cursor-pointer"
            >
              Save
            </button>
            <button className=" px-3 py-2 bg-red-500 text-white text-sm rounded-lg shadow-lg cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPageModal;
