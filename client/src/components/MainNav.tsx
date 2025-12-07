import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "./ui/button";
import UsernameMenu from "./UsernameMenu";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const MainNav = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  useEffect(() => {
    const toastShownBefore = localStorage.getItem("toastShown");
    const isToastShown = toastShownBefore ? JSON.parse(toastShownBefore) : false;

    // Check if the user is authenticated and the toast hasn't been shown yet
    if (isAuthenticated && !isToastShown) {
      toast.success("Welcome back!", {
        duration: 3000,
        icon: "😉"
      });
      // Updating localStorage to indicate that the toast has been shown
      localStorage.setItem("toastShown", JSON.stringify(true));
    }
  }, [isAuthenticated]);


  return(
    <div>
    <span className="flex space-x-2 items-center">
      {isAuthenticated ? (
        <>
          <Link to="/order-status" className="
    font-bold 
    text-black-600 
    hover:text-customOrange-500
    transition 
    duration-300 
    ease-in-out 
    transform 
    hover:scale-105"
    >
             Order Status 
          </Link>
           <UsernameMenu /> 
        </>
        ) : ( <Button className="bg-customBlue-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:text-white hover:bg-customBlue-100 hover:border-customBlue-500 hover:border transition-all duration-300 ease-in-out transform hover:scale-105"
      onClick={async() => await loginWithRedirect()}
    >
        Log In
    </Button>
    )}
    </span>
    </div>
  );
}

export default MainNav;