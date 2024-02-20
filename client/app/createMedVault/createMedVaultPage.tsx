'use client';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import FormLabel from '../components/FormLabel';
import { useFormik } from 'formik';

export default function CreateMedVaultPage() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      folderName: '',
      specialization: '',
    },
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
      <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
        <button onClick={() => router.push('/getMedVault')}>
          <Header headerText="Add Folder" />
        </button>
      </span>

      <div className="flex justify-center items-center">
        <div className="w-40 h-40 flex justify-center items-center rounded-lg overflow-hidden shadow-lg">
          <img
            src={'/Upload.svg'}
            alt="Folder Icon"
            className="w-24 h-24 object-cover"
          />
        </div>
      </div>

      <form
        className="rounded-3xl flex flex-col mt-4 mb-44 w-full md:max-w-[800px] md:min-h-[550px] p-4"
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
              onClick={() => router.push('/getMedVault')}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
