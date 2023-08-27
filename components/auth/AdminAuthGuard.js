import useHasMounted from "../../hooks/useHasMounted";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

const AdminAuthGuard = ({ children }) => {
  const { data: session, status } = useSession();
  const hasMounted = useHasMounted();
  const router = useRouter();

  React.useEffect(() => {
    if (!session?.user?.email)
      router.push({
        pathname: `/admin/signin`,
      });
  }, [session?.user?.email]);
  //return nothing
  if (!hasMounted) return null;
  if (session?.user?.email) {
    return children;
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center text-white text-4xl"></div>
  );
};

export default AdminAuthGuard;
