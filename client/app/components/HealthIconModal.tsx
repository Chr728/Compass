/* eslint-disable react/jsx-key */
import React, { useState } from 'react';
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

const HealthIconModal = ({ isOpen, onClose, onSelect }: any) => {
  const [selectedIcon, setSelectedIcon] = useState(null);

  const allIcons = [
    { name: 'Heart', component: <Heart /> },
    { name: 'Tb', component: <Tb /> },
    { name: 'Tooth', component: <Tooth /> },
    { name: 'Nose', component: <Nose /> },
    { name: 'Ear', component: <Ear /> },
    { name: 'Eye', component: <Eye /> },
    { name: 'Kidneys', component: <Kidneys /> },
    {
      name: 'FemaleReproductiveSystem',
      component: <FemaleReproductiveSystem />,
    },
    { name: 'Gallbladder', component: <Gallbladder /> },
    { name: 'Wheelchair', component: <Wheelchair /> },
    { name: 'Dna', component: <Dna /> },
    { name: 'ICertificatePaper', component: <ICertificatePaper /> },
    { name: 'IntestinalPain', component: <IntestinalPain /> },
    { name: 'Body', component: <Body /> },
    { name: 'ChildCognition', component: <ChildCognition /> },
    { name: 'Joints', component: <Joints /> },
  ];

  const handleIconSelect = (icon: any) => {
    setSelectedIcon(icon);
    onSelect(icon);
  };

  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>
        <div className="relative bg-lightgrey rounded-lg p-8 max-w-screen-md mx-auto">
          <h1 className="text-xl font-bold mb-4 text-white text-center">
            Folder Icon
          </h1>
          <div className="grid grid-cols-4 gap-4">
            {allIcons.map((icon, index) => (
              <div
                key={index}
                className={`p-4 bg-white rounded-md cursor-pointer ${
                  selectedIcon === icon ? 'border-2 border-blue-500' : ''
                }`}
                onClick={() => handleIconSelect(icon)}
              >
                {icon.component}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthIconModal;
