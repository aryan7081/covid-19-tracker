import {useState, useEffect} from 'react';
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';


function SearchBox({ placeholder, onSelect, fetchResults, renderItem }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const dropdownRef = useRef();
    // Other states and methods remain the same
  

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setSearchResults([]);
        }
    };
    
    const handleDropdownClick = (e) => {
        e.stopPropagation();
        console.log("e.currentTarget.dataset", e.currentTarget.dataset);
        const identifier = JSON.parse(e.currentTarget.dataset.identifier);
        console.log("identifier", identifier)
        onSelect(identifier);
        setSearchResults([]);
        setSearchTerm("");
    };
    
      useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);
    
      const handleSearchChange = async (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        if (value.length > 2) {
          const results = await fetchResults(value);
          setSearchResults(results);
        } else {
          setSearchResults([]);
        }
    };
    
    return (
      <div className="relative mb-1 mt-1 w-full">
          <div className="relative"> {/* Additional div for positioning the icon */}
          <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="border rounded p-2 text-black w-full pl-12 border-[#FCB59A] focus:outline-none focus:border-[#FCB59A] focus:ring-1 focus:ring-[#FCB59A]" 
              placeholder="Search for ticker"
          />

              {/* Search Icon */}
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
                  {/* Replace with your actual search icon */}
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
              </span>
          </div>
          
          {searchResults && searchResults.length > 0 && (
            <div ref={dropdownRef} className="absolute mt-2 w-full bg-white border border-gray-300 rounded shadow-lg z-20">
                {searchResults.map((item, index) => (
                    <div 
                      key={index}
                      data-identifier={JSON.stringify(item)}
                      onClick={handleDropdownClick}
                      className="cursor-pointer p-2 hover:bg-gray-200 text-black flex flex-row justify-between"
                    >
                      <div>
                        {item.name}
                      </div>
                      <div className='text-gray-500 mr-2 text-sm font-inter'>
                        {item.exchange}
                      </div>
                    </div>
                ))}
            </div>
        )}
      </div>
  )
  
  }
  

export default SearchBox;
