'use client';
import Button from '@/app/components/Button';
import { useAuth } from '@/app/contexts/AuthContext';
import { formatDateYearMonthDate } from '@/app/helpers/utils/datetimeformat';
import { getMoodJournal, updateMoodJournal } from '@/app/http/moodJournalAPI';
import Custom403 from '@/app/pages/403';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Menu from '../../../components/Menu';
import Input from '@/app/components/Input';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/app/components/Header';

export default function UpdateMoodEntry( {params: { updateEntryId } } : { params: { updateEntryId: string }} ) {
    const logger = require('../../../../logger');
    const { user } = useAuth();
    const router = useRouter();
    const [data, setData] = useState<any>();
    const [selectedMood, setSelectedMood] = useState<string>('');

    async function updateMoodEntry() {
        try {  
           const moodData = await getMoodJournal(updateEntryId);
           const updatedStressSignals = JSON.parse(moodData.data.stressSignals);
           const updatedMoodData = {
            ...moodData.data,
            stressSignals: updatedStressSignals, 
           }
           setData(updatedMoodData);
        } catch (error) {
            logger.error('Error fetching mood data');
        }
    }

    useEffect(() => {
        if (!user){
          router.push("/login")
        }

        if (user) {
            updateMoodEntry();
        }
    }, [user]);
    
    if (!user) {
      return <div><Custom403/></div>
    }
    const formik = useFormik({
        initialValues: {
            howAreYou:'',
            stressSignals: {
                tired: '',
                sleep: '',
                hunger:'',
                overeating:'',
                depressed: '',
                pressure:'',
                anxiety:'',
                attention: '',
                anger: '',
                headache:'',
            },
            date:'',
            notes: '',
          },
          onSubmit: async (values) => {
              const moodData = {
                howAreYou: values.howAreYou,
                stressSignals: values.stressSignals,
                date: values.date,
                notes: values.notes
              }
              await updateMoodJournal(updateEntryId, moodData)
              .then(result => {
                router.push(`/moodjournal/${updateEntryId}`)
              })             
          },

          validate: async (values) => {
            let errors : {
                howAreYou?: string;
                date?: string;
                stressSignals?: any,
                }
               = {};

            if(!values.howAreYou){
                errors.howAreYou="Mood required."
            }
            if(!values.date){
                errors.date="Date required."
            }
            if(!values.stressSignals.tired){
                errors.stressSignals = {...errors.stressSignals,  tired :"Value required." }
            }

            if(!values.stressSignals.sleep){
                errors.stressSignals = {...errors.stressSignals,  sleep :"Value required." }
                
            }

            if(!values.stressSignals.hunger){
                errors.stressSignals = {...errors.stressSignals,  hunger :"Value required." }
            }

            if(!values.stressSignals.overeating){
                errors.stressSignals = {...errors.stressSignals,  overeating :"Value required." }
            }

            if(!values.stressSignals.depressed){
                errors.stressSignals = {...errors.stressSignals,  depressed :"Value required." }
                
            }

            if(!values.stressSignals.pressure){
                errors.stressSignals = {...errors.stressSignals,  pressure :"Value required." }
                
            }
            if(!values.stressSignals.anxiety){
                errors.stressSignals = {...errors.stressSignals,  anxiety :"Value required." }
            }
            if(!values.stressSignals.attention){
                errors.stressSignals = {...errors.stressSignals,  attention :"Value required." }
            }
            if(!values.stressSignals.anger){
                errors.stressSignals = {...errors.stressSignals,  anger :"Value required." }
            }
            if(!values.stressSignals.headache){
                errors.stressSignals = {...errors.stressSignals,  headache :"Value required." }
            }

            return errors;
        },
    });

    useEffect(() =>{
        const  { setValues } = formik;
        setValues({
            howAreYou: data?.howAreYou || '',
            stressSignals: data?.stressSignals || '',
            date: formatDateYearMonthDate(data?.date || '') || '',
            notes: data?.notes || '',
        });
        setSelectedMood(data?.howAreYou);
      }, [data])

    const moodClick = (mood: string): void => {
        formik.setFieldValue("howAreYou", mood);
        setSelectedMood(mood);
    }

  return (
    <div 
    className="bg-eggshell min-h-screen flex flex-col">
      <span 
        className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4">
        <button onClick={() => router.push(`/moodjournal/${updateEntryId}`)}>
            <Header headerText="Edit an Entry - Mood"></Header>
        </button>
      {/* <Link 
      href=`/moodjournal/${updateEntryId}`>
        <Image
          src="/icons/LeftArrow.svg"
          alt="LeftArrow icon"
          width={10}
          height={10}
          className="mr-4"
          style={{ width: 'auto', height: 'auto' }}
        />
      </Link>
      Edit an Entry - Mood */}
    </span>
    <p 
            className="text-grey font-sans text-[16px] ml-4 mt-2">
            Choose atleast one way to describe your mood.
    </p>

    <form
      className="flex flex-col space-y-4 w-full mb-[74px]"
      onSubmit={ formik.handleSubmit }
    >
            <br/>
            <div className="m-2 w-1/2">
                <Input 
                name="date" 
                id="date" 
                type="date" 
                value={formik.values.date} 
                style={{width: '100%'}} 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur}
                />
                {formik.touched.date && formik.errors.date && (
                    <p className="text-[16px] text-red font-sans ml-[16px] mt-0">
                    {formik.errors.date}
                    </p>
                )}
            </div>
  
        <div className="flex flex-col rounded-2xl w-full text-darkgrey bg-white shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
            <div className="p-2">
                <Image
                    src="/icons/downArrow.svg"
                    alt="Down Arrow icon"
                    width={10}
                    height={10}
                    className="ml-2 text-grey inline-block"
                    style={{ width: 'auto', height: 'auto' }}
                />
                <p className="inline-block pl-2">
                    How are you?
                </p>
            </div>
            <div className="flex w-full justify-around p-2 break-words">
                <div 
                className={`text-center hover:bg-lightgrey hover:rounded-md p-2 w-1/5
                ${selectedMood === 'awesome' ? 'bg-lightgrey rounded-md': '' } `}
                onClick={ ( )=> moodClick("awesome")}>
                    <Image
                        src="/icons/wink.svg"
                        alt="Wink icon"
                        width={10}
                        height={10}
                        className="ml-2 text-grey inline-block"
                        style={{ width: 'auto', height: 'auto', marginLeft: '4px' }}
                    />
                    <p className="text-[14px]">Awesome</p>
                </div>

                <div className={`text-center hover:bg-lightgrey hover:rounded-md p-2 w-1/5
                                ${selectedMood === 'good' ? 'bg-lightgrey rounded-md': '' } `}
                onClick={ ( )=> moodClick("good")}>
                    <Image
                        src="/icons/smile.svg"
                        alt="smile icon"
                        width={10}
                        height={10}
                        className="ml-2 text-grey inline-block"
                        style={{ width: 'auto', height: 'auto', marginLeft: '4px' }}
                    />
                    <p className="text-[14px]">Good</p>
                </div>

                <div className={`text-center hover:bg-lightgrey hover:rounded-md p-2 w-1/5
                                ${selectedMood === 'sad' ? 'bg-lightgrey rounded-md': '' } `}
                onClick={ ( )=> moodClick("sad")}>
                    <Image
                        src="/icons/sad.svg"
                        alt="sad icon"
                        width={10}
                        height={10}
                        className="ml-2 text-grey inline-block"
                        style={{ width: 'auto', height: 'auto', marginLeft: '4px' }}
                    />
                    <p className="text-[14px]">Meh</p>
                </div>

                <div className={`text-center hover:bg-lightgrey hover:rounded-md p-2 w-1/5
                                ${selectedMood === 'bad' ? 'bg-lightgrey rounded-md': '' } `}
                onClick={ ( )=> moodClick("bad")}>
                    <Image
                        src="/icons/bad.svg"
                        alt="Bad icon"
                        width={10}
                        height={10}
                        className="ml-2 text-grey inline-block"
                        style={{ width: 'auto', height: 'auto', marginLeft: '4px' }}
                    />
                    <p className="text-[14px]">Bad</p>
                </div>

                <div className={`text-center hover:bg-lightgrey hover:rounded-md p-2 w-1/5
                                ${selectedMood === 'awful' ? 'bg-lightgrey rounded-md': '' } `}
                onClick={ ( )=> moodClick("awful")}>
                    <Image
                        src="/icons/awful.svg"
                        alt="Awful icon"
                        width={10}
                        height={10}
                        className="ml-2 text-grey inline-block"
                        style={{ width: 'auto', height: 'auto', marginLeft: '4px' }}
                    />
                    <p className="text-[14px]">Awful</p>
                </div>
                
            </div>
            {formik.touched.howAreYou && formik.errors.howAreYou && (
                    <p className="text-[16px] text-red font-sans">
                    {formik.errors.howAreYou}
                    </p>
                )}
        </div>

        <div className="flex flex-col space-y-4 p-2 rounded-2xl w-full text-darkgrey bg-white shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
            <span>
                <Image
                    src="/icons/downArrow.svg"
                    alt="Down Arrow icon"
                    width={10}
                    height={10}
                    className="ml-2 text-grey inline-block"
                    style={{ width: 'auto', height: 'auto', marginLeft: '4px' }}
                />
                <p className="inline-block m-2">
                    Stress Signals
                </p>
            </span>

            <div>
                <label htmlFor="tired" className="text-grey">I feel tired.</label>
                <br/>
                <select
                    name="stressSignals.tired"
                    id="tired"
                    onChange={formik.handleChange}
                    value={formik.values.stressSignals.tired}
                    onBlur={formik.handleBlur}
                    className="p-2 w-full h-[52px] border border-solid border-lightgrey rounded-md text-grey focus:outline-blue shadow-[0_4px_8px_0_rgba(44,39,56,0.04)]"
                    >
                    <option value="">Choose one</option>
                    <option value="always">Always</option>
                    <option value="often">Often</option>
                    <option value="sometimes">Sometimes</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                    </select>
                {formik.touched.stressSignals && formik.touched.stressSignals.tired && formik.errors.stressSignals && formik.errors.stressSignals.tired && (
                    <p className="text-[16px] text-red font-sans">
                        {formik.errors.stressSignals.tired} 
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="sleep" className="text-grey">I'm not sleeping well.</label>
                <br/>
                <select
                    name="stressSignals.sleep"
                    id="sleep"
                    onChange={formik.handleChange}
                    value={formik.values.stressSignals.sleep}
                    onBlur={formik.handleBlur}
                    className="p-2 w-full h-[52px] border border-solid border-lightgrey rounded-md text-grey focus:outline-blue shadow-[0_4px_8px_0_rgba(44,39,56,0.04)]"
                    >
                    <option value="">Choose one</option>
                    <option value="always">Always</option>
                    <option value="often">Often</option>
                    <option value="sometimes">Sometimes</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                    </select>
                    {formik.touched.stressSignals && formik.touched.stressSignals.sleep && formik.errors.stressSignals && formik.errors.stressSignals.sleep && (
                    <p className="text-[16px] text-red font-sans">
                        {formik.errors.stressSignals.sleep} 
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="hunger" className="text-grey">I'm not hungry.</label>
                <br/>
                <select
                    name="stressSignals.hunger"
                    id="hunger"
                    onChange={formik.handleChange}
                    value={formik.values.stressSignals.hunger}
                    onBlur={formik.handleBlur}
                    className="p-2 w-full h-[52px] border border-solid border-lightgrey rounded-md text-grey focus:outline-blue shadow-[0_4px_8px_0_rgba(44,39,56,0.04)]"
                    >
                    <option value="">Choose one</option>
                    <option value="always">Always</option>
                    <option value="often">Often</option>
                    <option value="sometimes">Sometimes</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                    </select>
                    {formik.touched.stressSignals && formik.touched.stressSignals.hunger && formik.errors.stressSignals && formik.errors.stressSignals.hunger && (
                    <p className="text-[16px] text-red font-sans">
                        {formik.errors.stressSignals.hunger} 
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="overeating" className="text-grey">I ate too much.</label>
                <br/>
                <select
                    name="stressSignals.overeating"
                    id="overeating"
                    onChange={formik.handleChange}
                    value={formik.values.stressSignals.overeating}
                    onBlur={formik.handleBlur}
                    className="p-2 w-full h-[52px] border border-solid border-lightgrey rounded-md text-grey focus:outline-blue shadow-[0_4px_8px_0_rgba(44,39,56,0.04)]"
                    >
                    <option value="">Choose one</option>
                    <option value="always">Always</option>
                    <option value="often">Often</option>
                    <option value="sometimes">Sometimes</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                    </select>
                    {formik.touched.stressSignals && formik.touched.stressSignals.overeating && formik.errors.stressSignals && formik.errors.stressSignals.overeating && (
                    <p className="text-[16px] text-red font-sans">
                        {formik.errors.stressSignals.overeating} 
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="depressed" className="text-grey">I feel sad or depressed.</label>
                <br/>
                <select
                    name="stressSignals.depressed"
                    id="depressed"
                    onChange={formik.handleChange}
                    value={formik.values.stressSignals.depressed}
                    onBlur={formik.handleBlur}
                    className="p-2 w-full h-[52px] border border-solid border-lightgrey rounded-md text-grey focus:outline-blue shadow-[0_4px_8px_0_rgba(44,39,56,0.04)]"
                    >
                    <option value="">Choose one</option>
                    <option value="always">Always</option>
                    <option value="often">Often</option>
                    <option value="sometimes">Sometimes</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                    </select>
                    {formik.touched.stressSignals && formik.touched.stressSignals.depressed && formik.errors.stressSignals && formik.errors.stressSignals.depressed && (
                    <p className="text-[16px] text-red font-sans">
                        {formik.errors.stressSignals.depressed} 
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="pressure" className="text-grey">I feel like things are just too much.</label>
                <br/>
                <select
                    name="stressSignals.pressure"
                    id="pressure"
                    onChange={formik.handleChange}
                    value={formik.values.stressSignals.pressure}
                    onBlur={formik.handleBlur}
                    className="p-2 w-full h-[52px] border border-solid border-lightgrey rounded-md text-grey focus:outline-blue shadow-[0_4px_8px_0_rgba(44,39,56,0.04)]"
                    >
                    <option value="">Choose one</option>
                    <option value="always">Always</option>
                    <option value="often">Often</option>
                    <option value="sometimes">Sometimes</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                    </select>
                    {formik.touched.stressSignals && formik.touched.stressSignals.pressure && formik.errors.stressSignals && formik.errors.stressSignals.pressure && (
                    <p className="text-[16px] text-red font-sans">
                        {formik.errors.stressSignals.pressure} 
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="attention" className="text-grey">I have trouble paying attention.</label>
                <br/>
                <select
                    name="stressSignals.attention"
                    id="attention"
                    onChange={formik.handleChange}
                    value={formik.values.stressSignals.attention}
                    onBlur={formik.handleBlur}
                    className="p-2 w-full h-[52px] border border-solid border-lightgrey rounded-md text-grey focus:outline-blue shadow-[0_4px_8px_0_rgba(44,39,56,0.04)]"
                    >
                    <option value="">Choose one</option>
                    <option value="always">Always</option>
                    <option value="often">Often</option>
                    <option value="sometimes">Sometimes</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                    </select>
                    {formik.touched.stressSignals && formik.touched.stressSignals.attention && formik.errors.stressSignals && formik.errors.stressSignals.attention && (
                    <p className="text-[16px] text-red font-sans">
                        {formik.errors.stressSignals.attention} 
                    </p>
                )}
            </div>

              <div>
                <label htmlFor="anxiety" className="text-grey">I feel nervous or anxious.</label>
                <br/>
                <select
                    name="stressSignals.anxiety"
                    id="anxiety"
                    onChange={formik.handleChange}
                    value={formik.values.stressSignals.anxiety}
                    onBlur={formik.handleBlur}
                    className="p-2 w-full h-[52px] border border-solid border-lightgrey rounded-md text-grey focus:outline-blue shadow-[0_4px_8px_0_rgba(44,39,56,0.04)]"
                    >
                    <option value="">Choose one</option>
                    <option value="always">Always</option>
                    <option value="often">Often</option>
                    <option value="sometimes">Sometimes</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                    </select>
                    {formik.touched.stressSignals && formik.touched.stressSignals.anxiety && formik.errors.stressSignals && formik.errors.stressSignals.anxiety && (
                    <p className="text-[16px] text-red font-sans">
                        {formik.errors.stressSignals.anxiety} 
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="anger" className="text-grey">I feel angry or irritated.</label>
                <br/>
                <select
                    name="stressSignals.anger"
                    id="anger"
                    onChange={formik.handleChange}
                    value={formik.values.stressSignals.anger}
                    onBlur={formik.handleBlur}
                    className="p-2 w-full h-[52px] border border-solid border-lightgrey rounded-md text-grey focus:outline-blue shadow-[0_4px_8px_0_rgba(44,39,56,0.04)]"
                    >
                    <option value="">Choose one</option>
                    <option value="always">Always</option>
                    <option value="often">Often</option>
                    <option value="sometimes">Sometimes</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                    </select>
                    {formik.touched.stressSignals && formik.touched.stressSignals.anger && formik.errors.stressSignals && formik.errors.stressSignals.anger && (
                    <p className="text-[16px] text-red font-sans">
                        {formik.errors.stressSignals.anger} 
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="headache" className="text-grey">I get headaches and/or colds.</label>
                <br/>
                <select
                    name="stressSignals.headache"
                    id="headache"
                    onChange={formik.handleChange}
                    value={formik.values.stressSignals.headache}
                    onBlur={formik.handleBlur}
                    className="p-2 w-full h-[52px] border border-solid border-lightgrey rounded-md text-grey focus:outline-blue shadow-[0_4px_8px_0_rgba(44,39,56,0.04)]"
                    >
                    <option value="">Choose one</option>
                    <option value="always">Always</option>
                    <option value="often">Often</option>
                    <option value="sometimes">Sometimes</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                    </select>
                    {formik.touched.stressSignals && formik.touched.stressSignals.headache && formik.errors.stressSignals && formik.errors.stressSignals.headache && (
                    <p className="text-[16px] text-red font-sans">
                        {formik.errors.stressSignals.headache} 
                    </p>
                )}
            </div>

            <div>
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
                    value={formik.values.notes}
                    className="w-full border border-solid border-lightgrey text-darkgrey rounded-md shadow-[0_4px_8px_0_rgba(44,39,56,0.04)]"
                    rows={4}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
            </div>

            <div className="mx-auto space-x-2">
                <Button
                    type="button"
                    text="Cancel"
                    style={{ width: "140px", backgroundColor: "var(--Red, #FF7171)" }}
                    onClick={() => router.push("/moodjournal")}
                />
                <Button type="submit" text="Submit" style={{ width: "140px" }} />
        </div>

        </div>
  </form> 
 
  </div> 
  )
}
