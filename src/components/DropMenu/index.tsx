import React, { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";

interface DropMenuProps {
  onClick?: () => void;
  ref?: React.RefObject<HTMLDivElement>;
  firstOption?: string;
}

export const DropMenu = ({ onClick, ref, firstOption }: DropMenuProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        <FaEllipsisV />
      </button>
      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
          <button
            onClick={() => {
              setShowDropdown(false);
              onClick();
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            {firstOption}
          </button>
        </div>
      )}
    </div>
  );
};
