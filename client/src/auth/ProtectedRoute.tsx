import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const {isAuthenticated, isLoading} = useAuth0();

// outlet means render all the child routes of this component
// if the user is authenticated
// its kind of like a children prop that we get whenever we have nested components
// and if they are not logged in then return to the homepage
// replace means it indicates to be a new URL

  if(isLoading) {
    return null;
  }

  if(isAuthenticated) {
    return <Outlet />
  }

  return <Navigate to="/" replace />
};

export default ProtectedRoute;