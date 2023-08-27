import { useEffect, useState, useRef } from "react";
import axios from "axios";
import notify from "@/utils/tostNotification";
import { useRouter } from "next/router";

const Footer = () => {
  const router = useRouter();

  const showPage = (el) => {
    const newSlug = el.title.replace(/\s/g, "-").trim();
    router.push(
      {
        pathname: `/${el.title}`,
      },
      `/${newSlug}`
    );
  };
  const [pageList, setPageList] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const pageResponse = await axios.get(`/api/private/page`);
        setPageList(pageResponse.data.foundPages);
      } catch (error) {
        notify("Something went wrong", "error");
      }
    }
    fetchData();
  }, []);
  return (
    <div className=" text-center flex flex-row sm:flex-col items-start sm:items-center justify-around sm:justify-center text-gray-600 mt-14 bg-tertiary-100/20 gap-4 py-6 px-2">
      <ul className="flex flex-col sm:flex-row justify-center items-center gap-2  cursor-pointer h-auto">
        {pageList?.map((el, index) => {
          if (pageList.length === index + 1) {
            return (
              <li
                key={el._id}
                onClick={() => {
                  showPage(el);
                }}
                className=""
              >
                {el.title}{" "}
              </li>
            );
          } else {
            return (
              <li
                key={el._id}
                onClick={() => {
                  showPage(el);
                }}
                className=""
              >
                {el.title} |
              </li>
            );
          }
        })}
      </ul>
      <ul className="flex flex-col sm:flex-row justify-center items-center gap-2  cursor-pointer h-auto">
        <li className="order-last sm:order-first">© 2023</li>
      </ul>
    </div>
  );
};

export default Footer;
