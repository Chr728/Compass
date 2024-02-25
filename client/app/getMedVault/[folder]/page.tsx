'use client';
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { useRouter } from 'next/navigation';
import { openDB } from 'idb';
import IconButton from '../../components/IconButton';
import CardFolder from '../../components/CardFolder';
import FileDetailsModal from '../../components/FileDetailsModal'; // Import your modal component

interface Prop {
  params: {
    folder: string;
  };
}

export default function GetFolder({ params }: Prop) {
  const router = useRouter();
  const [folderData, setFolderData] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showFileDetailsModal, setShowFileDetailsModal] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchFolderData = async () => {
      try {
        const db = await openDB('medVault', 1);
        const folderId = parseInt(params.folder);
        const folder = await db.get('folders', folderId);
        if (folder) {
          setFolderData(folder);
          const allDocuments = await db.getAll('data');
          const folderDocuments = allDocuments.filter(
            (document) => document.folderId == folderId
          );
          setDocuments(folderDocuments);
        } else {
          console.error('Folder not found in IndexedDB');
        }
      } catch (error) {
        console.error('Error fetching folder data from IndexedDB:', error);
      }
    };

    fetchFolderData();
  }, [params.folder]);

  const deleteDocument = async (documentId: any) => {
    try {
      const db = await openDB('medVault', 1);
      await db.delete('data', documentId);
      const updatedDocuments = await db.getAll('data');
      setDocuments(updatedDocuments);
    } catch (error) {
      console.error('Error deleting document from IndexedDB:', error);
    }
  };

  const viewDocumentDetails = (document: any) => {
    setSelectedDocument(document);
    setShowFileDetailsModal(true);
  };

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
            <p className="text-[color:var(--Dark-Grey,#2C2738)] text-2xl not-italic font-bold leading-[normal] font-family: IBM Plex Sans">
              {folderData?.specialization}
            </p>
            <p className="text-darkgrey font-family: IBM Plex Sans">
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
        <div className="grid grid-cols-2 gap-4 mt-4 mb-20">
          {documents.map((document) => (
            <CardFolder
              key={document.id}
              icon={'ClinicalF'}
              name={document.documentName}
              text={document.dateOfAnalysis}
              onDelete={() => deleteDocument(document.id)}
              onView={() => viewDocumentDetails(document)} // Add this onClick event
            />
          ))}
        </div>
      </div>
      {showFileDetailsModal && (
        <FileDetailsModal
          document={selectedDocument}
          onClose={() => setShowFileDetailsModal(false)}
        />
      )}
    </div>
  );
}
