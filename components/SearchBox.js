import axios from "axios";
import React, { useEffect, useState } from "react";
import notify from "../utils/tostNotification";

const SearchBox = ({
  setAllJobs,
  setSingleJob,
  setShowLoadMore,
  setLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("");
  //Track fetch record based on search term and searchfiled,so that we dont need to refetch data
  //in case of search all job,if we dont perform any search before or no result found for performed
  //search
  const [counter, setCounter] = useState(1);
  //Reset the searchTerm value if selected serchField is all Job
  useEffect(() => {
    if (searchField === "all") {
      setSearchTerm("");
    }
  }, [searchField]);

  const handleSearch = async () => {
    //if no search type selected give message to a select
    if (searchField === "Search By") {
      notify("Please select search type", "warning");
      return;
    }
    //if search type selected but no search term given,give message to type some search term
    if (
      (searchField === "location" ||
        searchField === "title" ||
        searchTerm === "recruiter") &&
      searchTerm === ""
    ) {
      notify("Please type some keyword to search", "warning");
      return;
    }
    setLoading(true);
    try {
      if (searchField === "all") {
        if (counter > 1) {
          const response = await axios.get(
            `/api/public/job?page=1&limit=5`
          );
          let jobs = response?.data;
          setAllJobs(jobs?.data);
          setSingleJob(jobs?.data?.[0]);
          setShowLoadMore(true);
          setCounter(1);
        } else {
          return;
        }
      }
      //make request with selected search type and search term.
      if (
        searchField === "location" ||
        searchField === "title" ||
        searchField === "recruiter" ||
        searchField === "keyword"
      ) {
        const response = await axios.get(
          `/api/public/search?searchCollection=jobs&searchTerm=${searchTerm}&searchField=${
            searchField === "keyword" ? "location,title,recruiter" : searchField
          }`
        );

        const data = response?.data?.foundItem;

        //if no result found give warning message
        if (data.length <= 0) {
          notify("No jobs found", "warning");
          return;
        }
        if (data.length >= 1) {
          //Increase the counter if records found againt the search
          setCounter((pS) => pS + 1);
          setAllJobs(data);
          setSingleJob(data[0]);
          setShowLoadMore(false);
        }
      }
    } catch (error) {
      notify("Something Went wrong", "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className=" xxs:w-[70%] sm:w-1/2 w-1/2 flex xxs:flex-col  xs:flex-row   items-center justify-between p-4 gap-2  bg-black/30 rounded-xl shadow-lg hover:shadow-xl  
    "
    >
      <div className="flex xxs:w-[100%] xs:w-[50%] rounded-lg">
        <input
          value={searchTerm}
          disabled={searchField === "all"}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-100 outline-none w-full placeholder:text-xs sm:placeholder:text-sm placeholder:text-gray-400 py-1 px-2 rounded-lg"
          type="text"
          placeholder="Search by keyword, job name or location"
        />
      </div>
      <div className="xxs:w-[100%] xs:w-[50%] flex gap-1">
        <select
          defaultValue="searchBy"
          onChange={(e) => {
            setSearchField(e.target.value);
          }}
          className="bg-gray-100 border border-gray-100 text-gray-500 text-sm rounded-lg  focus:outline-none w-full p-1   "
        >
          <option value="searchBy">Search By</option>
          <option value="location">Location</option>
          <option value="title">Job Title</option>
          <option value="recruiter">Company</option>
          <option value="keyword">Keywords</option>
          <option value="all">All Jobs</option>
        </select>

        <button
          onClick={handleSearch}
          className="bg-primary-100 flex justify-center items-center p-1  text-white font-semibold rounded-lg hover:shadow-lg transition duration-300 cursor-pointer w-[30%]"
        >
          Go
        </button>
      </div>
    </div>
  );
};

export default SearchBox;
