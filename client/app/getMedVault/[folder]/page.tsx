'use client';
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { useRouter } from 'next/navigation';
import { openDB } from 'idb';
import IconButton from '../../components/IconButton';

interface Prop {
  params: {
    folder: string;
  };
}

export default function GetFolder({ params }: Prop) {
  const router = useRouter();
  const [folderData, setFolderData] = useState<any>(null);

  useEffect(() => {
    const fetchFolderData = async () => {
      try {
        const db = await openDB('medVault', 1); // Open the same IndexedDB instance
        const folderId = parseInt(params.folder); // Convert folder ID to integer
        const folder = await db.get('folders', folderId);
        if (folder) {
          setFolderData(folder);
        } else {
          console.error('Folder not found in IndexedDB');
        }
      } catch (error) {
        console.error('Error fetching folder data from IndexedDB:', error);
      }
    };

    fetchFolderData();
  }, [params.folder]);

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
      <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
        <button onClick={() => router.push('/getMedVault')}>
          <Header headerText="Folders"></Header>
        </button>
      </span>
      <div className="rounded-3xl flex flex-col mt-4 w-full md:max-w-[800px] md:min-h-[550px] p-4">
        <div className="flex justify-between items-center">
          <div>
            {/* Display specialization in bold and doctor's name in regular text */}
            <p className="text-[color:var(--Dark-Grey,#2C2738)] text-2xl not-italic font-bold leading-[normal] font-family: IBM Plex Sans">
              {folderData?.specialization}
            </p>
            <p className="text-darkgrey ml-2 font-family: IBM Plex Sans">
              {folderData?.folderName}
            </p>
          </div>
          <div>
            <IconButton
              type="button"
              icon="/Add.svg"
              text="Add Document"
              style={{ width: '150px', fontSize: '14px', float: 'right' }}
              onClick={() =>
                router.push(`/getMedVault/${folderData.id}/createDocument`)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
