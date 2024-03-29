'use client';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import Button from '../components/Button';
import FormLabel from '../components/FormLabel';
import Header from '../components/Header';
import Input from '../components/Input';
import { useProp } from '../contexts/PropContext';
import { createBloodPressureJournal } from '../http/bloodPressureJournalAPI';



export default function CreateBloodPressureJournalPage() {
    const logger = require('../../logger');
    const router = useRouter();
    const { handlePopUp} = useProp();

    const formik = useFormik({
      initialValues: {
        date: "",
        time: "",
        bloodPressure: "",
        systolic: 0,
        diastolic: 0,
        pulse: 0,
        notes: "",
      },
      onSubmit: async (values) => {
        
        try {
          const [systolic, diastolic] = values.bloodPressure.split('/');

          const data = {
            date: values.date,
            time: values.time,
            systolic: parseInt(systolic, 10),
            diastolic: parseInt(diastolic, 10),
            pulse: values.pulse,
            notes: values.notes,
          };
          const result = await createBloodPressureJournal(data).then(
            (result) => {
              router.push("/getBloodPressureJournals");
            }
          );
        } catch (error) {
          handlePopUp("error", "Error creating blood pressure journal entry:");
        }
      },

      validate: (values) => {
        let errors: {
          date?: string;
          time?: string;
          bloodPressure?: string;
          pulse?: string;
          notes?: string;
        } = {};

        if(!values.bloodPressure) {
          errors.bloodPressure="This field can't be left empty."
        }
        else if(!/^\d{2,3}\/\d{2,3}$/i.test(values.bloodPressure)){
          errors.bloodPressure = "Blood pressure must be of the correct format (e.g. 120/80).";
        }

        if(!values.date){
          errors.date="This field can't be left empty.";
        }

        if(!values.time){
          errors.time="This field can't be left empty.";
        }

        if(!values.pulse){
          errors.pulse="This field can't be left empty.";
        }

        return errors;
      }

    })

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
       <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
            {/* link to be added */}
            <button onClick={() => router.push('/getBloodPressureJournals')}>
                <Header headerText="Add an Entry - Blood Pressure"></Header>
            </button>
        </span>
        <form
            className="rounded-3xl bg-white flex flex-col mb-8 w-full md:max-w-[800px] md:min-h-[550px] px-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
            onSubmit={formik.handleSubmit}>
             <div className="mt-3 mb-3">
                <FormLabel htmlFor={ 'date' } label={'Date'}></FormLabel>                               
                <Input 
                    name="date"
                    id="date"
                    type="date"
                    style={{ width: '75%' }}
                    value={formik.values.date}  
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required={true} 
                />
                {formik.touched.date && formik.errors.date && (
                  <p className="text-[16px] text-red font-sans">
                    {formik.errors.date}
                  </p>
                )}
            </div>
            <div className="mt-3">
                <FormLabel htmlFor={ 'time' } label={'Time'}></FormLabel>                               
                <Input
                    name="time"
                    id="time"
                    type="time"
                    value={formik.values.time} 
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur}
                    style={{ width: '75%' }}
                />
                {formik.touched.time && formik.errors.time && (
                  <p className="text-[16px] text-red font-sans">
                    {formik.errors.time}
                  </p>
                )}
            </div>
          <div className="mt-3">
            <FormLabel htmlFor={ 'bloodPressure' } label={'Blood Pressure'}></FormLabel>                               
            <Input
                name="bloodPressure"
                id="bloodPressure"
                type="text"
                style={{ width: '75%' }}
                value={formik.values.bloodPressure}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.touched.bloodPressure && formik.errors.bloodPressure && (
                  <p className="text-[16px] text-red font-sans">
                    {formik.errors.bloodPressure}
                  </p>
            )}
          </div>
          <div className="mt-3">
            <FormLabel htmlFor={ 'pulse' } label={'Pulse Rate'}></FormLabel>                               
            <Input
                name="pulse"
                id="pulse"
                type="number"
                style={{ width: '75%' }}
                value={formik.values.pulse.toString()}  
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.touched.pulse && formik.errors.pulse && (
                  <p className="text-[16px] text-red font-sans">
                    {formik.errors.pulse}
                  </p>
            )}
          </div>
          <div className="mt-3">
                <label
                  htmlFor="notes"
                  className="font-sans font-medium text-grey text-[16px]"
                >
                  Notes
                </label>
                <br />
                <textarea
                  name="notes"
                  id="notes"
                  className="w-full border border-solid border-lightgrey text-darkgrey rounded-md shadow-[0_4px_8px_0_rgba(44,39,56,0.04)]"
                  rows={4}
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
           </div>
           <div className='mt-2 pb-4 self-center'>
                <div className="mt-5 mb-14 space-x-2">
                    <Button
                    type="button"
                    text="Cancel"
                    style={{ width: '140px', backgroundColor: 'var(--Red, #FF7171)' }}
                    onClick={() => router.push("/getBloodPressureJournals")}
                    />
                    <Button
                        type="submit"
                        text="Submit"
                        style={{ width: '140px', textAlign: 'center' }}
                        onClick={() => router.push("/getBloodPressureJournals")}
                        />
                </div>
          </div>
    </form>
    </div>
  )
}
