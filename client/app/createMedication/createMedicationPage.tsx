import React, { useEffect } from 'react';
import Header from '../components/Header';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import Input from '../components/Input';
import Button from '../components/Button';
import { useUser } from '../contexts/UserContext';
// import { createMedication } from '../http/medicationAPI';

export default function MedicationPage() {
    const logger = require('../../logger');
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            name: '',
            date: '',
            time: '',
            dosage: 0.0,
            unit: '',
            frequency: '',
            route: '',
            notes: ''
        },
        onSubmit: async (values)=> {
            try{
                const data = {
                    medicationName: values.name,
                    dateStarted: values.date,
                    time: values.time,
                    dosage: values.dosage,
                    unit: values.unit,
                    frequency: values.frequency,
                    route: values.route,
                    notes: values.notes
                };
                const result = await createMedication(data);
                logger.info('Medication entry created:', result);
        router.push('/');
            } catch (error) {
                logger.error('Error creating medication entry:', error);
            }

        }

    });

    return (
        <div className="bg-eggshell min-h-screen flex flex-col">
            <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
                <button onClick={() => router.push('/getDiabeticJournals')}>
                <Header headerText="Add Other Medications"></Header>
                </button>
            </span>

            <form
                className="rounded-3xl bg-white flex flex-col mb-8 w-full md:max-w-[800px] md:min-h-[550px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
                onSubmit={formik.handleSubmit}
            >
                <div className="self-end -mt-4">
                    <p className="text-red text-[20px]"> *
                        <span className="font-sans font-medium text-grey text-[16px]"> indicates a required field</span>
                    </p>
                </div>
                <div className="mt-3">
                    <label
                        htmlFor="name"
                        className="font-sans font-medium text-grey text-[16px]"
                    >
                    <span className="text-red text-[20px]"> *</span>
                    Medication Name
                    </label>
                    <br />
                    <Input 
                        name="name"
                        id="name"
                        type="text"
                        style={{ width: '100%' }}
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        onBlur={formik.handleBlur}
                    />
                    {
                        formik.touched.name && !formik.values.name && (
                            <p className="text-red text-[14px]">This field can't be left empty.</p>
                    )}      
                </div>


                <div className="mt-3 mb-3">
                    <label
                        htmlFor="name"
                        className="font-sans font-medium text-grey text-[16px]"
                    >
                    <span className="text-red text-[20px]"> *</span>
                    Date Started
                    </label>
                    <br />
                    <div className="max-w-[225px]">
                        <Input 
                            name="date"
                            id="date"
                            type="date"
                            style={{ width: '100%' }}
                            onChange={formik.handleChange}
                            value={formik.values.date}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    {
                        formik.touched.date && !formik.values.date && (
                            <p className="text-red text-[14px]">This field can't be left empty.</p>
                    )}      
                </div>

                <div className="mt-3 mb-3">
                    <label
                        htmlFor="name"
                        className="font-sans font-medium text-grey text-[16px]"
                    >
                    Time
                    </label>
                    <br />
                    <div className="max-w-[225px]">
                        <Input 
                            name="time"
                            id="time"
                            type="time"
                            style={{ width: '100%' }}
                            onChange={formik.handleChange}
                            value={formik.values.time}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    {
                        formik.touched.time && !formik.values.time && (
                            <p className="text-red text-[14px]">This field can't be left empty.</p>
                    )}      
                </div>

                <div className="flex">
                    <div className="mt-3">
                        <label
                        htmlFor="dosage"
                        className="font-sans font-medium text-grey text-[16px]"
                        >
                        Dosage
                        </label>
                        <br />
                        <Input
                        name="dosage"
                        id="dosage"
                        type="number"
                        style={{ width: '75%' }}
                        onChange={formik.handleChange}
                        value={formik.values.dosage.toString()}
                        onBlur={formik.handleBlur}
                        />
                    </div>

                    <div className="mt-3  ml-2"
                        style={{
                            width: '50%',
                            marginLeft :'-2%'
                        }}
                    >
                        <label
                            htmlFor="unit"
                            className="font-sans font-medium text-grey text-[16px]"
                        >
                        Unit
                        </label>
                        <br />
                        <select
                            className="text-darkgrey h-[52px] p-2"
                            name="unit"
                            id="unit"
                            style={{
                                width: '100%',
                                border: '1px solid #DBE2EA',
                                borderRadius: '5px',
                            }}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.unit}
                        >
                            <option value="">Choose one</option>
                            <option value="gtts">drop (gtts)</option>
                            <option value="tsp">teaspoon (tsp)</option>
                            <option value="tbsp">tablespoon (tbsp)</option>
                            <option value="mL">millilitre (mL)</option>
                            <option value="fl">fluid ounce (fl oz)</option>
                            <option value="mcg">microgram (mcg)</option>
                            <option value="mg">milligram (mg)</option>
                            <option value="g">gram (g)</option>
                            <option value="oz">ounce (oz)</option>
                            <option value="other">other</option>
                        </select>        
                    </div>
                </div>

                <div className="mt-3">
                    <label htmlFor="frequency" className="font-sans font-medium text-grey text-[16px]">Frequency</label>
                    <br/>
                    <select
                        name="frequency"
                        id="frequency"
                        onChange={formik.handleChange}
                        value={formik.values.frequency}
                        onBlur={formik.handleBlur}
                        className="p-2 w-full h-[52px] border border-solid border-lightgrey rounded-md text-grey focus:outline-blue shadow-[0_4px_8px_0_rgba(44,39,56,0.04)]"
                    >
                        <option value="">Choose one</option>
                        <option value="onceMorning">Once a day (morning)</option>
                        <option value="onceEvening">Once a day (evening)</option>
                        <option value="twice">Twice a day</option>
                        <option value="thrice">Three times a day</option>
                        <option value="four">Four times a day</option>
                        <option value="five">Five times a day</option>
                        <option value="six">Six times a day</option>
                        <option value="thirtymin">Every 30 minutes</option>
                        <option value="onehour">Every 1 hour</option>
                        <option value="twohours">Every 2 hours</option>
                        <option value="fourhours">Every 4 hours</option>
                        <option value="sixhours">Every 6 hours</option>
                        <option value="eighthours">Every 8 hours</option>
                        <option value="beforemeals">Before meals</option>
                        <option value="aftermeals">After meals</option>
                        <option value="beforebed">Before bedtime</option>
                        <option value="rtc">Round-the-clock (RTC)</option>
                        <option value="prn">As needed (PRN)</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="mt-3">
                    <label htmlFor="route" className="font-sans font-medium text-grey text-[16px]">Route</label>
                    <br/>
                    <select
                        name="route"
                        id="route"
                        onChange={formik.handleChange}
                        value={formik.values.route}
                        onBlur={formik.handleBlur}
                        className="p-2 w-full h-[52px] border border-solid border-lightgrey rounded-md text-grey focus:outline-blue shadow-[0_4px_8px_0_rgba(44,39,56,0.04)]"
                    >
                        <option value="">Choose one</option>
                        <option value="oral">Oral</option>
                        <option value="sublingual">Sublingual</option>
                        <option value="enteral">Enteral</option>
                        <option value="rectal">Rectal</option>
                        <option value="inhalation">Inhalation</option>
                        <option value="intramuscular">Intramuscular</option>
                        <option value="subcutaneous">Subcutaneous</option>
                        <option value="transdermal">Transdermal</option>
                        <option value="topical">Topical</option>
                        <option value="other">Other</option>
                    </select>
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
                        value={formik.values.notes}
                        className="w-full border border-solid border-lightgrey text-darkgrey rounded-md shadow-[0_4px_8px_0_rgba(44,39,56,0.04)]"
                        rows={4}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>

                <div className="mx-auto space-x-2 mb-8">
                    <Button
                        type="button"
                        text="Cancel"
                        style={{ width:"140px", backgroundColor: "var(--Red, #FF7171)" }}
                        onClick={() => router.push("/moodjournal")}
                    />
                    <Button type="submit" text="Submit" style={{ width: "140px" }} />
                </div>

            </form>
            
    </div>
    )
}
