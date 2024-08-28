import React from 'react';

interface ShieldIconProps {
  className?: string;
}

const ShieldIcon: React.FC<ShieldIconProps> = ({ className }) => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d="M24 3L6 9v15c0 11.1 7.68 21.48 18 24 10.32-2.52 18-12.9 18-24V9L24 3z"
        fill="url(#shieldGradient)"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M24 9L12 13.5v10.5c0 6.945 5.04 13.755 12 15.75 6.96-1.995 12-8.805 12-15.75V13.5L24 9z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.7"
      />
      <path
        d="M24 15L16.5 18v7.5c0 4.14 3.36 8.205 7.5 9.75 4.14-1.545 7.5-5.61 7.5-9.75V18L24 15z"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        opacity="0.5"
      />
      {/* Identity representation */}
      <circle cx="24" cy="20" r="4.5" fill="white" />
      <path
        d="M24 26c-3.75 0-6.75 2.25-8.25 5.25 2.25 2.25 5.25 3.75 8.25 3.75s6-1.5 8.25-3.75C30.75 28.25 27.75 26 24 26z"
        fill="white"
      />
      {/* Additional details */}
      <path
        d="M24 6L9 11v13c0 9.35 6.56 18.1 15 20.5 8.44-2.4 15-11.15 15-20.5V11L24 6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.3"
      />
      <path
        d="M24 12L15 16v8c0 5.52 4.2 10.68 9 12.5 4.8-1.82 9-6.98 9-12.5v-8l-9-4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.3"
      />
    </svg>
  );
};

export default ShieldIcon;
