import Image from "next/image";
import axios from "axios";
import { useSession, getSession } from "next-auth/react";
import Info from "../../../components/Info";
import dateFormater from "../../../utils/dateFormater";
import { useEffect } from "react";
import createHttpError from "http-errors";
import httpStatusCodes from "../../../utils/httpStatusCodes";


const Profile = ({user,pf}) => {
  const { data: session } = useSession();


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

  return (
    <div className="min-h-screen px-6 sm:px-10 py-10 flex flex-col items-center gap-6">
      <div className="  flex sm:flex-row flex-col justify-center items-center gap-10">
        <div className="flex gap-4 items-center">
          <p className="text-3xl font-semibold uppercase text-gray-600">
        {user?.name} {pf.includes('lastName') ? user?.lastName :"" }
          </p>
        </div>
        <div className=" group relative w-16 h-16 rounded-full bg-gray-500 cursor-pointer ">
          
          {!user?.image?.url ? (
            <div className="absolute rounded-full w-16 h-16 flex justify-center items-center font-semibold text-sm">
            </div>
          ) : (
            <Image
              fill
              src={user?.image?.url}
              object-fit="contain"
              alt="CN"
              className="absolute rounded-full w-16 h-16 "
            />
          )}
          
        </div>
      </div>
      <div className="w-full flex flex-col items-center">
        <h2 className="text-primary-100 text-xl font-semibold">
          Contact Details
        </h2>
        <hr className="w-1/2 mb-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-100" />
      </div>
      
        <Info
        editButton={false}
          fields={{
            email: pf.includes('email')?user?.email:"User Does not want share this information",
            phone: pf.includes('phone')?user?.phone:"User Does not want share this information",
            address: pf.includes('address')?user?.address:"User Does not want share this information",
            linkedIn:pf.includes('social')?user?.social:"User Does not want share this information",
          }}
        />
     
      
      <div className="w-full flex flex-col items-center">
        <h2 className="text-primary-100 text-xl font-semibold">
          Employment Details
        </h2>
        <hr className="w-1/2 mb-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-100" />
      </div>
        <Info
            editButton={false}
          fields={{
            currentEmployer: pf.includes('currentEmployer')?user?.currentEmployer:"User Does not want share this information",
            currentEmployment: pf.includes('currentEmployment')?user?.currentEmployment:"User Does not want share this information",
            availableFrom: pf.includes('availableFrom')?dateFormater(user?.availableFrom):"User Does not want share this information",
          }}
        />
     

      <div className="w-full flex flex-col items-center">
        <h2 className="text-primary-100 text-xl font-semibold">
          Additional Information
        </h2>
        <hr className="w-1/2 mb-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-100" />
      </div>

        <Info
          editButton={false}
          fields={{
             about: pf.includes('about')?user?.about:"User Does not want share this information",
          }}
        />
      
    </div>
  ) 
};
export async function getServerSideProps(context) {
 const { id,jobId } = context.query;
  const { req } = context;
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  let user = null;
  let pf=null;
  if (session?.user?.email) {
    try {
      const response = await axios.get(
        `${process.env.BASE_URL}/api/public/user/${id}`
      );
      let userWithpassWord = response?.data;
      delete userWithpassWord.password;
      user = userWithpassWord;
      const jobResponse= await axios.get(
        `${process.env.BASE_URL}/api/public/job/${jobId}`
      ); 
      const result=jobResponse?.data;
     
     pf=result?.applicants?.filter(el=>el.user===id)[0]?.publicFields
      
    } catch (error) {
      createHttpError(
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        "Something went wrong"
      );
    }
  }
  return {
    props: {
      user,
      pf
    },
  };
}


Profile.requiredAuth = true;
export default Profile;
