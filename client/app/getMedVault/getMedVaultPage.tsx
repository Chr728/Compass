'use client';
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
            if (!db.objectStoreNames.contains('data')) {
              db.createObjectStore('data', {
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
      const db = await openDB('medVault', 1);

      await db.delete('folders', folderId);
      const allData = await db.getAll('data');

      const documentsToDelete = allData.filter(
        (doc) => doc.folderId == folderId
      );

      const deletePromises = documentsToDelete.map((doc) =>
        db.delete('data', doc.id)
      );
      await Promise.all(deletePromises);

      const updatedFolders = await db.getAll('folders');
      setData(updatedFolders);
      setIsExportDisabled(updatedFolders.length === 0);

      router.push('/getMedVault');
    } catch (error) {
      console.error(
        'Error deleting folder and associated data from IndexedDB:',
        error
      );
    }
  };

  const exportData = async () => {
    try {
      const db = await openDB('medVault', 1);
      const folders = await db.getAll('folders');
      const documents = await db.getAll('data');
      const exportData = { folders, documents };

      for (const doc of exportData.documents) {
        const filePromises = doc.files.map(async (file: any) => {
          const base64String = await readFileAsBase64(file);
          return base64String;
        });
        doc.files = await Promise.all(filePromises);
      }

      const exportString = JSON.stringify(exportData);

      const blob = new Blob([exportString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'medVaultExport.json';
      a.click();
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const importData = async (event: any) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async () => {
        const jsonString = reader.result as string;
        const importedData = JSON.parse(jsonString);

        const db = await openDB('medVault', 1);

        await db.clear('folders');
        await db.clear('data');

        if (importedData.folders && importedData.folders.length > 0) {
          for (const folder of importedData.folders) {
            await db.add('folders', folder);
          }
        }

        if (importedData.documents && importedData.documents.length > 0) {
          for (const document of importedData.documents) {
            document.files = await Promise.all(
              document.files.map(async (fileString: string) => {
                const res = await fetch(fileString);
                return await res.blob();
              })
            );

            await db.add('data', document);
          }
        }

        const updatedFolders = await db.getAll('folders');
        setData(updatedFolders);
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('Error importing data:', error);
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
              onClick={exportData}
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
                onPush={() => router.push(`/getMedVault/${folder.id}`)}
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
            <input
              type="file"
              accept=".json"
              onChange={importData}
              style={{ display: 'none' }}
              id="fileInput"
            />
            <label htmlFor="fileInput">
              <div className="bg-white rounded-lg p-4 shadow-xl flex items-center justify-center cursor-pointer mt-4">
                <div className="text-center flex flex-col items-center">
                  <img
                    src="/Download.svg"
                    alt="Download"
                    className="w-12 h-12"
                  />
                  <h3 className="font-semibold text-lg text-darkgrey">
                    Import Data
                  </h3>
                  <p className="text-sm text-darkgrey mt-4">
                    Import previously exported data or Add Folder
                  </p>
                </div>
              </div>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
