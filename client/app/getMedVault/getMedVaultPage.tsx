import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import IconButton from '../components/IconButton';
import CardFolder from '../components/CardFolder';
import { openDB } from 'idb';

export default function GetMedVaultPage() {
  const [isExportDisabled, setIsExportDisabled] = useState(true);
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const db = await openDB('medVault', 1, {
          upgrade(db) {
            if (!db.objectStoreNames.contains('folders')) {
              db.createObjectStore('folders', {
                keyPath: 'id',
                autoIncrement: true,
              });
            }
          },
        });
        const folders = await db.getAll('folders');
        if (folders && folders.length > 0) {
          setIsExportDisabled(false);
          setData(folders);
        } else {
          setIsExportDisabled(true);
        }
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };
    initializeDatabase();
  }, []);

  const deleteFolder = async (folderId: any) => {
    try {
      const db = await openDB('medVault', 1); // Use the correct database name
      await db.delete('folders', folderId);
      const updatedFolders = await db.getAll('folders');
      setData(updatedFolders);
      setIsExportDisabled(updatedFolders.length === 0);
    } catch (error) {
      console.error('Error deleting folder from IndexedDB:', error);
    }
  };

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
      <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
        <button onClick={() => router.push('/health')}>
          <Header headerText="MedVault"></Header>
        </button>
      </span>
      <div className="rounded-3xl flex flex-col mt-4 w-full md:max-w-[800px] md:min-h-[550px] p-4">
        <div className="flex justify-between items-center">
          <div>
            <IconButton
              type="button"
              icon="/Upload.svg"
              outlined={true}
              text="Export Data"
              style={{ width: '120px', fontSize: '14px' }}
              disabled={isExportDisabled}
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
          <div className="grid grid-cols-2 gap-4 mt-4 mb-20 ">
            {data.map((folder: any) => (
              <CardFolder
                key={folder.id}
                icon={folder.icon}
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
