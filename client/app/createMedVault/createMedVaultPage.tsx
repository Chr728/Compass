'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import FormLabel from '../components/FormLabel';
import { useFormik } from 'formik';
import { openDB } from 'idb';
import HealthIconModal from '../components/HealthIconModal';
import { ICertificatePaper } from 'healthicons-react/dist/filled'; // Import ICertificatePaper icon

export default function CreateMedVaultPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [selectedIcon, setSelectedIcon] = useState({
    name: 'ICertificatePaper',
    component: <ICertificatePaper />,
  });

  const formik = useFormik({
    initialValues: {
      folderName: '',
      specialization: '',
    },
    onSubmit: async (values) => {
      // Save data to IndexedDB along with the selected icon
      console.log(selectedIcon.name);

      await saveData({ ...values, icon: selectedIcon.name });

      // Redirect to getMedVault page
      router.push('/getMedVault');
    },
  });

  const saveData = async (values: any) => {
    const db = await openDB('medVault', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('folders')) {
          const foldersStore = db.createObjectStore('folders', {
            keyPath: 'id',
            autoIncrement: true,
          });
          console.log(foldersStore);
        }
      },
    });

    const tx = db.transaction('folders', 'readwrite');
    const store = tx.objectStore('folders');
    await store.add(values);
    await tx.done;
    db.close();
  };

  const handleIconSelect = (icon: any) => {
    setSelectedIcon(icon);
    setIsModalOpen(false); // Close the modal after selecting an icon
  };

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
      <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
        <button onClick={() => router.push('/getMedVault')}>
          <Header headerText="Add Folder" />
        </button>
      </span>

      <div className="flex justify-center items-center">
        <div
          className={`w-40 h-40 flex justify-center items-center rounded-lg overflow-hidden shadow-lg ${
            selectedIcon ? 'text-5xl' : ''
          }`}
          onClick={() => setIsModalOpen(true)}
        >
          {selectedIcon ? ( // Display the selected icon if any
            selectedIcon.component
          ) : (
            <ICertificatePaper /> // Default to ICertificatePaper
          )}
        </div>
      </div>

      <HealthIconModal // Render the HealthIconModal component
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Close the modal when clicking outside or on close button
        onSelect={handleIconSelect} // Pass the handleIconSelect function to handle icon selection
      />

      <form
        className="rounded-3xl flex flex-col mt-4 w-full md:max-w-[800px] md:min-h-[550px] p-4"
        onSubmit={formik.handleSubmit}
      >
        <div className="mt-3">
          <FormLabel htmlFor={'folderName'} label={"Doctor's Name"}></FormLabel>
          <Input
            name="folderName"
            id="folderName"
            type="text"
            style={{ width: '100%' }}
            onChange={formik.handleChange}
            value={formik.values.folderName}
            onBlur={formik.handleBlur}
          />
        </div>
        <div className="mt-3">
          <FormLabel
            htmlFor={'specialization'}
            label={"Doctor's Specialization"}
          ></FormLabel>
          <Input
            name="specialization"
            id="specialization"
            type="text"
            style={{ width: '100%' }}
            onChange={formik.handleChange}
            value={formik.values.specialization}
            onBlur={formik.handleBlur}
          />
        </div>

        <div className="mt-10 pb-4 self-center">
          <div className="mt-5 mb-5 space-x-2">
            <Button
              type="submit"
              text="Add Folder"
              style={{ width: '180px', textAlign: 'center' }}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
