'use client';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import Button from '../components/Button';
import FormLabel from '../components/FormLabel';
import Header from '../components/Header';
import Input from '../components/Input';
import { useProp } from '../contexts/PropContext';


export default function CreateBloodPressureJournalPage() {
    const logger = require('../../logger');
    const router = useRouter();
    const { handlePopUp} = useProp();
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
        >
             <div className="mt-3 mb-3">
                <FormLabel htmlFor={ 'date' } label={'Date'}></FormLabel>                               
                <Input 
                    name="date"
                    id="date"
                    type="date"
                    style={{ width: '75%' }}
                    value=""  // value field to be added - formik
                    required={true} 
                />
            </div>
            <div className="mt-3">
                <FormLabel htmlFor={ 'time' } label={'Time'}></FormLabel>                               
                <Input
                    name="time"
                    id="time"
                    type="time"
                    value="" // value field to be added - formik
                    style={{ width: '75%' }}
                />
            </div>
          <div className="mt-3">
            <FormLabel htmlFor={ 'bloodPressure' } label={'Blood Pressure'}></FormLabel>                               
            <Input
                name="bloodPresure"
                id="bloodPresure"
                type="number"
                style={{ width: '75%' }}
                value="" // value field to be added - formik
            />
          </div>
          <div className="mt-3">
            <FormLabel htmlFor={ 'pulseRate' } label={'Pulse Rate'}></FormLabel>                               
            <Input
                name="pulseRate"
                id="pulseRate"
                type="number"
                style={{ width: '75%' }}
                value="" // value field to be added - formik
            />
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
                  rows={2}
                  value="" // value field to be added - formik
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
