'use client';
import Button from '../components/Button';
import Input from '../components/Input';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { createSpeedDial } from '../http/speedDialAPI'; 
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

export default function CreateContactPage() {
  const logger = require('../../logger');
  const router = useRouter();
  const { user } = useAuth();
  
  const formik = useFormik({
    initialValues: {
      contactName: '', // Initialize the form fields with empty values
      phone: '',
    },

    onSubmit: async (values) => {
      try {
        const userId = user?.uid || '';
        const data = {
          contactName: values.contactName,
          phone: values.phone,
        };
        const result = await createSpeedDial(data); 
        router.push('/contacts');
      } catch (error) {
        logger.error('Error creating speed dial entry:', error);
      }
    },
  });


  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
       <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
              <button onClick={() => router.push('/contacts')}>
              <Header headerText="Create Speed Dial"></Header>
              </button>
              </span>
      <form
      className="rounded-3xl bg-white flex flex-col mb-8 w-full md:max-w-[800px] md:min-h-[550px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
      onSubmit={formik.handleSubmit}
      >
      
  <div className="mt-3">
    <label
      htmlFor="Name"
      className="font-sans font-medium text-grey text-[16px]"
    >
      Contact Name
    </label>
    <span className="text-red text-[20px]"> *</span>
    <br />
    <Input
      name="contactName"
      id="contactName"
      type="text"
      style={{ width: '100%' }}
      onChange={formik.handleChange}
      value={formik.values.contactName}
      onBlur={formik.handleBlur}
    />
    {/* Check if the field is touched */}
    {formik.touched.contactName && (
      // Check if the field is empty
      !formik.values.contactName && 
      (
        <p className="text-red text-[14px]">This field can't be left empty.</p>
      ) 
    )}
  </div>

  <div className="mt-3">
    <label
      htmlFor="Phone Number"
      className="font-sans font-medium text-grey text-[16px]"
    >
      Phone Number
    </label>
    <span className="text-red text-[20px]"> *</span>
    <br />
    <Input
      name="phone"
      id="phone"
      type="text"
      style={{ width: '100%' }}
      onChange={formik.handleChange}
      value={formik.values.phone}
      onBlur={formik.handleBlur}
    />
    {/* Check if the field is touched */}
    {formik.touched.phone && (
      // Check if the field is empty
      !formik.values.phone && 
      (
        <p className="text-red text-[14px]">This field can't be left empty.</p>
      ) 
    )}
  </div>
 
  
      <div className='mt-10 pb-4 self-center'>
      <div className="mt-5 mb-5 space-x-2">
        <Button
          type="button"
          text="Cancel"
          style={{ width: '140px', backgroundColor: 'var(--Red, #FF7171)' }}
          onClick={() => router.push("/contacts")}
        />


<Button
          type="submit"
          text="Submit"
          disabled={
            !(formik.isValid && formik.dirty) || // Check if the form is valid and dirty
            !formik.values.contactName || // Check if contact name is missing or empty
            !formik.values.phone // Check if phone is missing or empty
          }
          style={{ width: '140px', textAlign: 'center' }}
          onClick={() => router.push("/contacts")}
        />
        </div>
      </div>
    </form>
    </div>
  );
}