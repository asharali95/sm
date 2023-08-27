import createHttpError from "http-errors";
import { useRouter } from "next/router";
import React from "react";
import httpStatusCodes from "../utils/httpStatusCodes";
import axios from "axios";
import Image from "next/image";

const Page = ({ result }) => {
  return (
    <div className="min-h-screen px-10 flex flex-col  gap-8 items-start mt-10 w-full text-gray-900">
      <div className="self-center py-6 mb-4 font-semibold text-gray-600 text-2xl">
        {result?.title}
      </div>
      <Image
        
        width="400"
        height="150"
        src={result?.image?.url}
        className="w-screen h-96"
      />
      <div>{result?.para1}</div>
      <div>{result?.para2}</div>
      <div>{result?.para3}</div>
      <div>{result?.para4}</div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { pageId } = context.query;

  let paageTitle = pageId.split("-").join(" ");
  let result;
  try {
    const response = await axios.get(
      `${process.env.BASE_URL}/api/private/page/${paageTitle}`
    );
    result = response?.data?.updatedPage?.[0];
  } catch (error) {
    createHttpError(
      httpStatusCodes.INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }

  return {
    props: {
      result,
    },
  };
}

export default Page;
