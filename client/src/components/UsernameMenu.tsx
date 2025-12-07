import { CircleUserRound } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

const UsernameMenu = () => {
    const {user, logout} = useAuth0();
    // Function to handle logout and clear localStorage
    const handleLogout = () => {
    // clear all cart items from localStorage upon logout
     Object.keys(localStorage)
    .filter(key => key.startsWith('cartItems-'))
    .forEach(key => localStorage.removeItem(key));
    
    // clears all menuItems from localStorage upon logout
     Object.keys(localStorage)
    .filter(key => key.startsWith('menuItem-'))
    .forEach(key => localStorage.removeItem(key));

    localStorage.removeItem("toastShown"); // Clear localStorage item
    logout(); // Logout user
    toast.success("Logged out successfully!", {
      duration: 3000,
      icon: "👋"
    });
  };
  return(
    <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center px-3 font-bold hover:text-customOrange-500 gap-2 hover: transition-all duration-300 ease-in-out transform hover:scale-105">
        {user?.picture ? (
        <div className="relative w-9 h-9 group">
          <img
            src={user.picture}
            alt={user.name}
            className="w-full h-full rounded-full object-cover shadow-md transition-all duration-300 ease-in-out group-hover:ring-2 group-hover:ring-customGrey-200 group-hover:shadow-xl"
            />
        </div>
      ) : (
        <CircleUserRound size={32} className="hover:text-customOrange-500" />
      )}
      <span>{user?.name}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
        <DropdownMenuItem>
            <Link to="/manage-restaurant" className="font-bold hover:text-customOrange-500">
                Manage Restaurant
            </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem>
            <Link to="/user-profile" className="font-bold hover:text-customOrange-500">
                User Profile
            </Link>
            </DropdownMenuItem>
            
       
        <Separator/>
        <DropdownMenuItem>
            <Button onClick={handleLogout} className="flex flex-1 font-bold bg-customOrange-500"> 
            Log Out
            </Button>
        </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UsernameMenu;