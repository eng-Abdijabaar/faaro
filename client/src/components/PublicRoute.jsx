import { Navigate, Outlet } from "react-router";
import useAuthStore from "../store/authStore";
import getRoleHome from "../lib/getRoleHome";

const PublicRoute = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  if (isAuthenticated && user) {
    return (
      <Navigate
        to={getRoleHome(user.role)}
        replace
      />
    );
  }

  return <Outlet />;
};

export default PublicRoute;