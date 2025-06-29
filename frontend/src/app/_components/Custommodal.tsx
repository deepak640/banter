import React from 'react';
import { IoCloseSharp } from 'react-icons/io5';

const Custommodal = ({ children, isOpen, onCancel, title }: {
  children: React.ReactNode;
  isOpen: boolean;
  onCancel: () => void;
  title: string;
}) => {
  return (
    <>
      {isOpen && (
        <div
          className="bg-[#3939395c] fixed inset-0 z-50 flex items-center justify-center h-full bg-opacity-50 transition-opacity duration-300 ease-in-out"
          style={{ opacity: isOpen ? 1 : 0 }}
        >
          <div
            className="bg-white text-black rounded-lg shadow-xl w-5/12 min-w-[300px] mx-4 p-6 relative transform transition-transform duration-300 ease-in-out"
            style={{
              transform: isOpen ? 'scale(1)' : 'scale(0.95)',
              opacity: isOpen ? 1 : 0,
            }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <button
              className="absolute top-5 cursor-pointer right-5 text-gray-500 hover:text-gray-700"
              onClick={onCancel}
            >
              <IoCloseSharp size={20} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">{title}</h1>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Custommodal;
