'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import FormLabel from '../../../components/FormLabel';
import { useFormik } from 'formik';
import { openDB } from 'idb';

export default function CreateDocumentPage() {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const maxFiles = 5;

  const formik = useFormik({
    initialValues: {
      documentName: '',
      dateOfAnalysis: '',
    },
    onSubmit: async (values) => {
      await storeDocument(values);
      router.push(`/getMedVault/${getFolderIdFromURL()}`);
    },
  });

  const getFolderIdFromURL = () => {
    const urlParts = window.location.pathname.split('/');
    return urlParts[urlParts.length - 2];
  };

  const handleFileChange = (event: any) => {
    const files = Array.from(event.target.files).slice(0, maxFiles);
    if (selectedFiles.length < maxFiles) {
      setSelectedFiles((prevFiles) => [
        ...prevFiles,
        ...files.slice(0, maxFiles - prevFiles.length),
      ]);
    }
  };

  const handleFileRemove = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const storeDocument = async (formData: any) => {
    try {
      const db = await openDB('medVault', 1);
      const folderId = getFolderIdFromURL();
      const documentData = { ...formData, folderId, files: selectedFiles };
      await db.add('data', documentData);
    } catch (error) {
      console.error('Error storing document in IndexedDB:', error);
    }
  };

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
      <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
        <button onClick={() => router.push('/getMedVault')}>
          <Header headerText="Add Document" />
        </button>
      </span>

      <div>
        {selectedFiles.length === 0 && (
          <img
            src="/compass-removebg.png"
            alt="Logo"
            className="smallImage m-auto"
            width={230}
            height={230}
            style={{ alignItems: 'center', justifyContent: 'center' }}
          />
        )}
        {selectedFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-4 m-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative border p-4 rounded-xl">
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-200">
                    <div className="flex flex-col items-center max-w-full">
                      <img
                        src="/documents.svg"
                        alt="PDF Icon"
                        className="w-12 h-12"
                      />
                      <span
                        className="text-darkgrey text-sm truncate"
                        style={{ maxWidth: '80px' }}
                      >
                        {file.name}
                      </span>
                    </div>
                  </div>
                )}
                <span
                  className="absolute text-darkgrey top-0 right-0 cursor-pointer rounded-full p-1"
                  onClick={() => handleFileRemove(index)}
                >
                  X
                </span>
              </div>
            ))}
          </div>
        )}

        <input
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          multiple
          id="fileInput"
        />
        <label htmlFor="fileInput" className="flex justify-center items-center">
          <div className="bg-white p-4 shadow-xl flex items-center justify-center cursor-pointer w-[307px] h-[132px] rounded-[20px]">
            <div className="text-center flex flex-col items-center">
              <img src="/Upload.svg" alt="Download" className="w-12 h-12" />
              <h3 className="font-semibold text-lg text-darkgrey">
                Click to Upload File
              </h3>
              <p className="text-sm text-grey mt-1">
                (Max 5 files, supported formats: jpg, jpeg, png, pdf)
              </p>
            </div>
          </div>
        </label>

        <form
          className="rounded-3xl flex flex-col mt-4 w-full md:max-w-[800px] md:min-h-[550px] p-4"
          onSubmit={formik.handleSubmit}
        >
          <div className="mt-3">
            <FormLabel htmlFor="documentName" label="Document Name" />
            <Input
              name="documentName"
              id="documentName"
              type="text"
              style={{ width: '100%' }}
              onChange={formik.handleChange}
              value={formik.values.documentName}
              onBlur={formik.handleBlur}
            />
          </div>
          <div className="mt-3">
            <FormLabel htmlFor="dateOfAnalysis" label="Date of Analysis" />
            <Input
              name="dateOfAnalysis"
              id="dateOfAnalysis"
              type="date"
              style={{ width: '100%' }}
              onChange={formik.handleChange}
              value={formik.values.dateOfAnalysis}
              onBlur={formik.handleBlur}
            />
          </div>

          <div className="mt-10 pb-4 self-center">
            <div className="mt-5 mb-20 space-x-2">
              <Button
                type="submit"
                text="Save"
                style={{ width: '180px', textAlign: 'center' }}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
