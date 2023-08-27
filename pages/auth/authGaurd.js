import useHasMounted from "../../hooks/useHasMounted";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

const AuthGuard = ({ children }) => {
  const { data: session, status } = useSession();
  const hasMounted = useHasMounted();
  const router = useRouter();
  const isUser = !!session?.user?.email;
  React.useEffect(() => {
    if (!isUser) router.push({ pathname: "/" });
  }, [isUser]);
  //return nothing
  if (!hasMounted) return null;
  if (isUser) {
    return children;
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center text-white text-4xl"></div>
  );
};

export default AuthGuard;
