import React from 'react';

export const TndIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 8V12L14 14M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 21V21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-50"
    />
  </svg>
);

export default TndIcon;
