import { useAuthContext } from "@/context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
  const { isAuthenticated } = useAuthContext();
  console.log(isAuthenticated);
  // const isAuthenticated = false;

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex flex-1 items-center justify-center flex-col py-10 ">
            {" "}
            <Outlet />
          </section>
          <img
            src="/assets/images/bannr.jpg"
            alt="logo"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat "
          />
        </>
      )}
    </>
  );
};
export default AuthLayout;
