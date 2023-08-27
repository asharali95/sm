import { useEffect, useState } from "react";
import MagicLinkSignInForm from "../../components/auth/MagicLinkSignInForm";
import CredentialSignInForm from "../../components/auth/CredentialSignInForm";
import { useRouter } from "next/router";
import Register from "../../components/auth/Register";
import ResetPasswordModal from "../../components/auth/ResetPasswordModal";
import { useSession } from "next-auth/react";

const SignIn = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState("");
  const [jobId, setJobId] = useState("");

  const toggleForm = () => {
    setShowSignIn(!showSignIn);
  };
  const { data: session } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (session?.user?.email) {
      router.push("/");
      return;
    }
    setOrigin(router.query.origin);
    setJobId(router.query.jobId);
    // let userRole = ["employee", "employer"];
    // if (!userRole.includes(router.query.role)) {
    //   router.push("/");
    // }
  }, [router.query.origin, session]);

  return router.query.role === "employee" ? (
    <MagicLinkSignInForm origin={origin} jobId={jobId} />
  ) : router.query.role === "employer" || router.query.role === "owner" ? (
    showSignIn ? (
      <div className="h-[calc(100vh_-_140px)] flex flex-col items-center justify-center px-2 pt-8 pb-4 overflow-hidden">
        <div
          style={{ backdropFilter: "blur(20px)" }}
          className="w-full bg-tertiary-100/40  rounded-md shadow  md:mt-0 sm:max-w-md xl:p-0"
        >
          <Register setShowSignIn={setShowSignIn} />
          <div className="px-8 flex gap-2 -mt-6 mb-8 text-sm font-light text-gray-600 ">
            <p> Already have an account? </p>
            <span
              onClick={toggleForm}
              className="font-medium text-primary-600 hover:underline cursor-pointer"
            >
              Login here
            </span>
          </div>
        </div>
      </div>
    ) : (
      <div className=" h-[calc(100vh_-_140px)] flex flex-col items-center justify-center px-2 py-4 overflow-hidden">
        <div
          style={{ backdropFilter: "blur(20px)" }}
          className=" w-full bg-tertiary-100/40  rounded-md shadow  md:mt-0 sm:max-w-md xl:p-0"
        >
          <CredentialSignInForm />
          <div className="px-8 flex flex-col sm:flex-row gap-2 items-center justify-between -mt-4 mb-8 text-sm font-light text-gray-600 ">
            {router.query.role === "employer" && (
              <div className="flex gap-2">
                <p> Need an account? </p>
                <span
                  onClick={toggleForm}
                  className="font-medium text-primary-600 hover:underline cursor-pointer underline"
                >
                  Register here
                </span>
              </div>
            )}

            <span
              onClick={() => setOpen(!open)}
              className="font-medium text-primary-600 hover:underline cursor-pointer underline"
            >
              Forgot password
            </span>
          </div>

          {open && <ResetPasswordModal open={open} setOpen={setOpen} />}
        </div>
      </div>
    )
  ) : (
    <div className="h-screen"></div>
  );
};

export default SignIn;
