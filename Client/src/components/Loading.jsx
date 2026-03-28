import React from 'react'

const Loading = ({ size = "sm", color = "white" }) => {
    const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4"
  };
  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} border-t-transparent border-${color} rounded-full animate-spin`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default Loading;