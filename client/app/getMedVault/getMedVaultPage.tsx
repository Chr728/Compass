// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import IconButton from '../components/IconButton';
import CardFolder from '../components/CardFolder';
import { openDB } from 'idb'; // Import openDB from idb

// Define and export default function component
export default function GetMedVaultPage() {
  // Define state variables
  const [isExportDisabled, setIsExportDisabled] = useState(true); // Initialize export button as disabled
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  // Function to fetch data from IndexedDB
  useEffect(() => {
    const fetchData = async () => {
      const db = await openDB('medVaultDB', 1);
      const folders = await db.getAll('folders');
      if (folders && folders.length > 0) {
        setIsExportDisabled(false); // Enable export button if there's data
        setData(folders);
      } else {
        setIsExportDisabled(true); // Disable export button if there's no data
      }
    };
    fetchData();
  }, []);

  // Function to delete folder
  const deleteFolder = async (folderId: any) => {
    const db = await openDB('medVaultDB', 1);
    await db.delete('folders', folderId);
    // Refresh data after deletion
    const updatedFolders = await db.getAll('folders');
    setData(updatedFolders);
    setIsExportDisabled(updatedFolders.length === 0); // Update export button based on updated data length
  };

  // JSX structure for the component
  return (
    <div className="bg-eggshell h-screen flex flex-col">
      <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
        <button onClick={() => router.push('/health')}>
          <Header headerText="MedVault"></Header>
        </button>
      </span>
      <div className="rounded-3xl flex flex-col mt-4 mb-44 w-full md:max-w-[800px] md:min-h-[550px] p-4">
        <div className="flex justify-between items-center">
          <div>
            <IconButton
              type="button"
              icon="/Upload.svg"
              outlined={true}
              text="Export Data"
              style={{ width: '120px', fontSize: '14px' }}
              disabled={isExportDisabled} // Set disabled based on isExportDisabled state
            />
          </div>
          <div>
            <IconButton
              type="button"
              icon="/Add.svg"
              text="Add Folder"
              style={{ width: '120px', fontSize: '14px', float: 'right' }}
              onClick={() => router.push(`/createMedVault`)}
            />
          </div>
        </div>
        {data && data.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 mt-4 mb-24">
            {data.map((folder: any, index: any) => (
              <CardFolder
                key={index}
                icon={'/acti.svg'}
                name={folder.folderName}
                text={folder.specialization}
                onDelete={() => deleteFolder(folder.id)}
              />
            ))}
          </div>
        ) : (
          <div>
            <img
              src="/compass-removebg.png"
              alt="Logo"
              className="smallImage m-auto"
              width={250}
              height={250}
              style={{ alignItems: 'center', justifyContent: 'center' }}
            />
            <div
              className="bg-white rounded-lg p-4 shadow-xl flex items-center justify-center cursor-pointer"
              onClick={() => {
                // Handle button click action here
              }}
            >
              <div className="text-center flex flex-col items-center">
                <img src="/Download.svg" alt="Download" className="w-12 h-12" />
                <h3 className="font-semibold text-lg text-darkgrey">
                  Import Data
                </h3>
                <p className="text-sm text-darkgrey mt-4">
                  Import previously exported data or Add Folder
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
