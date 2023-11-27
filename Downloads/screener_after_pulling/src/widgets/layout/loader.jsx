import React from 'react';
import './loader.css'; // Import the CSS file here


function Loader({ size = 'medium', color = 'border-[rgba(245,102,48,1)]' }) {
    let sizeClass = 'w-16 h-16';
    if (size === 'small') sizeClass = 'w-6 h-6';
    if (size === 'large') sizeClass = 'w-32 h-32';
    
    return (
        <div className={`${sizeClass} border-t-2 rounded-full animate-spin ${color}`}></div>
    );
}

  
export default Loader;
