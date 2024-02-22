import React from 'react';
import { MdDeleteForever } from 'react-icons/md';

import {
  Heart,
  Tb,
  Tooth,
  Nose,
  Ear,
  Eye,
  Kidneys,
  FemaleReproductiveSystem,
  Gallbladder,
  Wheelchair,
  Dna,
  ICertificatePaper,
  IntestinalPain,
  Body,
  ChildCognition,
  Joints,
} from 'healthicons-react/dist/filled';

import { ClinicalF } from 'healthicons-react/dist/outline';

interface CardFolderProps {
  icon: string;
  name: string;
  text: string;
  onDelete: () => void;
  onPush?: () => void;
}

const iconComponents: { [key: string]: React.ReactNode } = {
  Heart: <Heart />,
  Tb: <Tb />,
  Tooth: <Tooth />,
  Nose: <Nose />,
  Ear: <Ear />,
  Eye: <Eye />,
  Kidneys: <Kidneys />,
  FemaleReproductiveSystem: <FemaleReproductiveSystem />,
  Gallbladder: <Gallbladder />,
  Wheelchair: <Wheelchair />,
  Dna: <Dna />,
  ICertificatePaper: <ICertificatePaper />,
  IntestinalPain: <IntestinalPain />,
  Body: <Body />,
  ChildCognition: <ChildCognition />,
  Joints: <Joints />,
  ClinicalF: <ClinicalF />,
};

const CardFolder: React.FC<CardFolderProps> = ({
  icon,
  name,
  text,
  onDelete,
  onPush,
}) => {
  const IconComponent = iconComponents[icon];

  return (
    <div className="relative w-[170px] h-[178.40px] bg-white rounded-[20px] shadow-lg mt-4 flex flex-col items-center justify-center">
      <MdDeleteForever
        className="absolute top-2 right-2 text-red-500 cursor-pointer"
        style={{ color: 'var(--Red, #FF7171)', width: '25px', height: '30px' }}
        onClick={onDelete} // Call onDelete function when delete button is clicked
      />
      <div
        className="w-12 h-12 bg-gray-300 rounded-full text-4xl flex items-center justify-center mb-2"
        onClick={onPush}
      >
        {IconComponent} {/* Render the corresponding icon component */}
      </div>
      <h2 className="text-darkgrey text-lg font-bold mb-1" onClick={onPush}>
        {name}
      </h2>
      <p className="text-darkgrey text-sm" onClick={onPush}>
        {text}
      </p>
    </div>
  );
};

export default CardFolder;
