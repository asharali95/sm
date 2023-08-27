import useHasMounted from "../../hooks/useHasMounted";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";

const AuthGuard = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const hasMounted = useHasMounted();
  const isUser = !!session?.user;
  React.useEffect(() => {
    if (status === "loading") return;
    if (!isUser) router.push(router.push({ pathname: "/" }));
  }, [isUser, status]);

  if (!hasMounted) {
    return null;
  }
  if (isUser) {
    return children;
  }
  return (
    <div className="w-screen h-screen flex justify-center items-center text-white text-4xl"></div>
  );
};

export default AuthGuard;
