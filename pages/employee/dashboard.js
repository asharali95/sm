import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import useHasMounted from "../../hooks/useHasMounted";
import InterestJobList from "../../components/InterestJobList";
import SavedJobList from "../../components/SavedJobList";
import notify from "../../utils/tostNotification";
import CardSkeleton from "../../components/CardSkeleton";

function Dashboard() {
  const { data: session } = useSession();
  const hasMounted = useHasMounted();
  const [interestJob, setInterestJob] = useState(true);
  const [jobList, setJobList] = useState(null);
  const [loading, setLoading] = useState(false);
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
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const jobResponse = await axios.get(
          `/api/private/user/getJobList/${session?.id}`
        );
        setLoading(false);
        setJobList(jobResponse?.data);
      } catch (error) {
        notify("Something went wrong", "error");
      }
    }
    fetchData();
  }, []);
  if (!hasMounted) return null;

  return session?.role === "employee" ? (
    <>
      <div className="min-h-screen px-10 flex flex-col  items-center mt-10 ">
        <div className=" flex gap-6 justify-center items-center">
          <div
            onClick={() => setInterestJob(true)}
            className={`rounded-md  ${
              !interestJob
                ? "bg-gray-100 text-gray-600 hover:text-white"
                : "bg-secondary-100 text-white"
            } px-3 py-2 hover:bg-secondary-200  text-sm font-semibold cursor-pointer active:scale-95`}
          >
            Interest List
          </div>
          <div
            onClick={() => setInterestJob(false)}
            className={`rounded-md  ${
              interestJob
                ? "bg-gray-100 text-gray-600 hover:text-white"
                : "bg-primary-100 text-white"
            } px-3 py-2 hover:bg-primary-200  text-sm font-semibold cursor-pointer active:scale-95`}
          >
            Saved Jobs
          </div>
        </div>
        <div className=" w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6 ">
          {loading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : interestJob ? (
            <InterestJobList jobList={jobList} setJobList={setJobList} />
          ) : (
            <SavedJobList jobList={jobList} setJobList={setJobList} />
          )}
        </div>
      </div>
    </>
  ) : (
    <div className="h-screen flex justify-center items-center text-gray-600">
      <p className=" flex justify-center items-center gap-2">
        <span className="text-2xl">401</span>{" "}
        <span className="block w-[1px] h-6 bg-gray-600" /> You are not
        authorized to visit this
      </p>
    </div>
  );
}

Dashboard.requiredAuth = true;

export default Dashboard;
