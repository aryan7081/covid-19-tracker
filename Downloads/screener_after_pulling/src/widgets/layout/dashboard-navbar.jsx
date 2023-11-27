import {useState, useEffect} from 'react';
import React, { useRef } from 'react';
import {
  Navbar,
} from "@material-tailwind/react";
import {
  useMaterialTailwindController,
} from "@/context";
import { useNavigate } from 'react-router-dom';
import SearchBox from "./searchBox";
import { useSupabase } from '../../supabaseProvider';
import {fetchTypeaheadResults} from '@/utils/api';


function BellIcon() {
  return (
    <div>
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        viewBox="0 0 29 29"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
  <path
    d="M 15.934 4.124 C 15.934 3.479 15.412 2.957 14.767 2.957 C 14.123 2.957 13.601 3.479 13.601 4.124 V 5.874 C 13.601 5.906 13.602 5.938 13.604 5.97 C 10.292 6.523 7.767 9.403 7.767 12.872 V 17.54 C 7.767 18.124 7.289 19.136 6.765 20.069 C 6.028 21.381 6.163 22.964 7.57 23.499 C 8.985 24.038 11.248 24.54 14.767 24.54 C 18.287 24.54 20.55 24.038 21.964 23.499 C 23.371 22.964 23.506 21.381 22.769 20.069 C 22.246 19.136 21.767 18.124 21.767 17.54 V 12.873 C 21.767 9.403 19.243 6.524 15.93 5.97 C 15.933 5.938 15.934 5.906 15.934 5.874 V 4.124 Z"
    fill="#667185"
  />
  <path
    d="M 11.174 25.502 C 11.218 25.54 11.27 25.585 11.331 25.634 C 11.507 25.774 11.757 25.956 12.074 26.137 C 12.702 26.496 13.631 26.874 14.767 26.874 C 15.903 26.874 16.832 26.496 17.461 26.137 C 17.777 25.956 18.028 25.774 18.203 25.634 C 18.264 25.585 18.317 25.54 18.36 25.502 C 17.34 25.629 16.151 25.707 14.767 25.707 C 13.384 25.707 12.194 25.629 11.174 25.502 Z"
    fill="#667185"
  />
      </svg>
    </div>
  )
}

function ProfileIcon() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { supabase } = useSupabase();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    const logout = async () => {
      const x = await supabase.auth.signOut();
      console.log(x, 'x');
    }
    logout();
    console.log('Logging out...');
    // Handle logout functionality here
  };

  return (
    <div className="relative inline-block text-left">
      <div onClick={toggleDropdown} className="cursor-pointer w-6 h-6">
        <svg
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 12.767 11.624 C 14.976 11.624 16.767 9.833 16.767 7.624 C 16.767 5.415 14.976 3.624 12.767 3.624 C 10.558 3.624 8.767 5.415 8.767 7.624 C 8.767 9.833 10.558 11.624 12.767 11.624 Z"
            fill="#F56630"
          />
          <path
            d="M 6.073 18.624 C 4.416 21.294 9.9 22.624 12.767 22.624 C 15.634 22.624 21.118 21.294 19.462 18.624 C 18.216 16.616 15.696 14.624 12.767 14.624 C 9.838 14.624 7.319 16.616 6.073 18.624 Z"
            fill="#F56630"
          />
        </svg>
      </div>
      {dropdownOpen && (
        <div className="origin-top-right absolute right-0 mt-4 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
const NotificationDropdown = () => {
  return (
    <div className="absolute top-12 right-0 w-64 bg-white shadow-lg rounded-md p-4 z-10">
      {/* Replace this with your actual notifications */}
      <div className="mb-2 text-gray-400">No Notifications</div>
    </div>
  );
};

const StrategiesDropdown = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef();

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <a
        href="/strategies"
        className="text-black hover:text-gray-600"
        onClick={(e) => {
          e.preventDefault();
          setDropdownVisible(!isDropdownVisible);
        }}
      >
        Strategies
      </a>
      {isDropdownVisible && (
        <div
          className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10 text-black"
          ref={dropdownRef}
        >
          <a href="/dashboard/strategy/create" className="block px-4 py-2 hover:bg-gray-200">
            Create Strategy
          </a>
          <a href="/dashboard/strategies" className="block px-4 py-2 hover:bg-gray-200">
            My strategy
          </a>
        </div>
      )}
    </div>
  );
};


export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Navbar
    color="white"
    className={`rounded-sm px-0 py-1 w-full shadow`}
    fullWidth>
    <div className="mx-auto flex justify-between items-center w-full">
      
        <div className="flex items-center pl-4 cursor-pointer"
          onClick={() => navigate(`/dashboard/explore`)}
          >
            <img src="/img/logo.png" alt="Logo" className="h-9 w-auto" />
            
        </div>
        {/* Left empty space */}
        <div className="flex-grow"></div>

        {/* SearchBox in the center */}
        <div className="flex justify-center flex-grow items-center ml-20">
          <SearchBox
            placeholder="Search for ticker"
            onSelect={(item) => navigate(`/dashboard/stock?ticker=${item.ticker}&exchange=${item.exchange}`)}
            fetchResults={fetchTypeaheadResults}
            renderItem={(ticker) => <>{ticker.name}</>}
            searchKey="ticker"
          />
        </div>

        {/* Icons on the right */}
        <div className="flex items-center justify-end flex-grow 2xl:mr-20">
          <div className="flex items-center space-x-8 mr-5">
              <a href="/dashboard/explore" className="text-black hover:text-gray-600">Explore</a>
              <StrategiesDropdown />
              <a href="/dashboard/faq" className="text-black hover:text-gray-600">FAQ</a>
              
          </div>
          <div className="flex items-center w-32 h-9 gap-8">
            <div className="flex h-8 w-0.5 bg-gray-300"></div>
            <div className="flex items-center gap-10">
                <div className="relative flex flex-col items-end">
                  <div className="h-8 w-1 relative" ref={dropdownRef}>
                    <div className="w-7 h-7 relative cursor-pointer" onClick={() => setDropdownVisible(!isDropdownVisible)}>
                      <BellIcon />
                    </div>
                    {isDropdownVisible && <NotificationDropdown />}
                  </div>
                </div>
                <div className="flex items-center gap-2.5 bg-[#FFECE5] rounded-full p-1.5">
                    <ProfileIcon />
                </div>
            </div>
          </div>
        </div>
    </div>
    </Navbar>
);
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
