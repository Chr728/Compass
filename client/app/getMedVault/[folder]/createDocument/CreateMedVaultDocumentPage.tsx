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

  const formik = useFormik({
    initialValues: {
      documentName: '',
      dateOfAnalysis: '',
    },
    onSubmit: async (values) => {
      // Handle form submission here
      console.log('Form Values:', values);
      // Redirect to getMedVault page
      router.push('/getMedVault');
    },
  });

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
      <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
        <button onClick={() => router.push('/getMedVault')}>
          <Header headerText="Add Document" />
        </button>
      </span>

      <div>
        <img
          src="/compass-removebg.png"
          alt="Logo"
          className="smallImage m-auto"
          width={230}
          height={230}
          style={{ alignItems: 'center', justifyContent: 'center' }}
        />
        <div className="flex justify-center items-center">
          <div
            className="bg-white p-4 shadow-xl flex items-center justify-center cursor-pointer w-[307px] h-[132px] rounded-[20px]"
            onClick={() => {
              // Handle button click action here
            }}
          >
            <div className="text-center flex flex-col items-center">
              <img src="/Upload.svg" alt="Download" className="w-12 h-12" />
              <h3 className="font-semibold text-lg text-darkgrey">
                Click to Upload File
              </h3>
            </div>
          </div>
        </div>

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
