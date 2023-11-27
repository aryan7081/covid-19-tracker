import React, { useEffect, useState } from "react";

import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { getUserInfo } from "@/utils/api";
import mixpanel from "mixpanel-browser";
import { MIXPANEL_PROJECT_TOKEN } from "./configs/globalVariable";
import Onboarding from "./layouts/onboarding";
import { Chat } from "./pages/dashboard";
import Data from "./components/dashboard/data";
import FAQPage from "./pages/dashboard/screener/FAQ";

const MobileWarningMessage = () => {
  return (
    <div className="bg-gray-500 p-4 text-center text-white">
      <p>Please open this app on a desktop for the best experience.</p>
    </div>
  );
};

function App() {
  // Define your desired threshold for desktop view (e.g., 768px)
  const desktopThreshold = 768;
  const [userInfo, setUserInfo] = useState(null); // State to store user info
  const navigate = useNavigate();

  useEffect(() => {
    // setCookiesEnabled()
    mixpanel.init(MIXPANEL_PROJECT_TOKEN, {
      track_pageview: true,
      persistence: "localStorage",
    });
  }, []);

  // Initialize a state variable to track the screen width
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Update the screenWidth state when the window is resized
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const fetchUserInfo = async () => {
    console.log("fetching");
    try {
      const response = await getUserInfo(); // Replace with your API endpoint
      if (!response) {
        navigate("/auth/signIn");
        return;
      }
      setUserInfo(response); // Update user info state
      localStorage.setItem("user", JSON.stringify(response));
      console.log(response);
      const currentPath = window.location.pathname;
      if (response.not_registered) {
        navigate("/onboarding/add");
      } else if (!response.is_beta) {
        navigate("/auth/welcome");
      } else if (
        (currentPath.startsWith("/auth/") ||
          currentPath.startsWith("/onboarding/")) &&
        response.is_beta
      ) {
        navigate("/dashboard/explore");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    // Wait for the session object to be available in localStorage
    const waitForSession = () => {
      const sessionData = localStorage.getItem("session"); // Replace with the actual key used in localStorage
      if (sessionData) {
        fetchUserInfo();
      }
    };

    waitForSession();
  }, []); // Empty dependency array to run only once when the component mounts

  return (
    <div>
      
      {/* Conditionally render the warning message for mobile users */}
      {screenWidth < desktopThreshold &&
      !window.location.pathname.startsWith("/auth") ? (
        <MobileWarningMessage />
      ) : (
        // Render your app content for desktop users with conditional dashboard loading
        <Routes>
          {userInfo && userInfo.is_beta ? (
            <>
              <Route path="dashboard/*" element={<Dashboard />} />
              <Route
                path="/"
                element={<Navigate to="/dashboard/explore" replace />}
              />



              
            </>
          ) : null}
          <>
            <Route path="/auth/*" element={<Auth />} />
            <Route path="/onboarding/*" element={<Onboarding />} />
            
          </>
        </Routes>
      )}
    </div>
  );
}

export default App;
