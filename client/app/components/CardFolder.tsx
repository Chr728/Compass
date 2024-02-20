import React from 'react';
import { MdDeleteForever } from 'react-icons/md';

interface CardFolderProps {
  icon: string; // Image URL for the icon
  name: string; // Name of the folder
  text: string; // Additional details or description
}

const CardFolder: React.FC<CardFolderProps> = ({ icon, name, text }) => {
  return (
    <div className="relative w-[170px] h-[178.40px] bg-white rounded-[20px] shadow-lg mt-4 flex flex-col items-center justify-center">
      <MdDeleteForever
        className="absolute top-2 right-2 text-red-500 cursor-pointer"
        style={{
          color: 'var(--Red, #FF7171)',
          width: '25px',
          height: '30px',
        }}
        onClick={() => {}}
      />
      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mb-2">
        <img
          src={icon}
          alt="Folder Icon"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <h2 className="text-darkgrey text-lg font-bold mb-1">{name}</h2>
      <p className="text-darkgrey text-sm">{text}</p>
    </div>
  );
};

export default CardFolder;
