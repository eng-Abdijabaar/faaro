import { Navigate, Outlet } from "react-router";
import getRoleHome from "../lib/getRoleHome";
import useAuthStore from "../store/authStore";

const ProtectedRoute = ({ allowedRoles }) => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  if (!isAuthenticated || !user) {
    return <Navigate to="/signin" replace />;
  }

  if (
    allowedRoles?.length &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <Navigate
        to={getRoleHome(user.role)}
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;