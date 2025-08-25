import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackArrow = ({ className = '', navigateto="/" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(navigateto)}
      className={`absolute top-5 left-5 flex items-center text-gray-600 hover:text-black transition-colors ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className="w-6 h-6 mr-1"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      <span className="text-sm font-medium">Back</span>
    </button>
  );
};

export default BackArrow;
