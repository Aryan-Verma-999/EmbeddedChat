import React from 'react';

const Sparkles = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Large Sparkle */}
    <path d="M16 4 Q16 16 4 16 Q16 16 16 28 Q16 16 28 16 Q16 16 16 4 Z" />
    {/* Medium Sparkle */}
    <path d="M25 2 Q25 7 20 7 Q25 7 25 12 Q25 7 30 7 Q25 7 25 2 Z" />
  </svg>
);

export default Sparkles;
