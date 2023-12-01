import Header from '../components/Header';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import Input from '../components/Input';
import Button from '../components/Button';
import { createMedication } from '../http/medicationAPI';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Custom403 from '../pages/403';

export default function CreateMedicationPage() {
    const logger = require('../../logger');
    const router = useRouter();
    const user = useAuth();

    useEffect(() => {
        if (!user){
          router.push("/login")
        }
    }, [user]);
    
    if (!user) {
      return <div><Custom403/></div>
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            date: '',
            time: '',
            dosage: '',
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
                router.push('/getMedications');
            } catch (error) {
                logger.error('Error creating medication entry:', error);
            }

        },

        validate: async (values) => {
            let errors: {
                name?:string;
                date?: string;
                time?:string;
                dosage?:string;
                unit?: string;
                frequency?: string;
                route?: string;
                notes?: string;
            } = {};

            if (!values.name){
                errors.name = "This field cannot be left empty."
            }
            if (!values.date){
                errors.date = "This field cannot be left empty."
            }

            if (!values.time){
                errors.time = "This field cannot be left empty."
            }

            if (parseFloat(values.dosage) <=0 ) {
                    errors.dosage = "This field cannot be negative or zero.";
            }
            else if (!values.dosage) {
                errors.dosage = "This field cannot be left empty.";
            }

            if(!values.unit){
                errors.unit = "This field cannot be left empty."
            }

            if(!values.frequency){
                errors.frequency = "This field cannot be left empty."
            }

            if(!values.route){
                errors.route = "This field cannot be left empty."
            }
            return errors;
        }
    });


    return (
        <div className="bg-eggshell min-h-screen flex flex-col">
            <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
                <button onClick={() => router.push('/getMedications')}>
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
                        formik.touched.name && formik.errors.name && (
                            <p className="text-red text-[14px]">{formik.errors.name}</p>
                    )}      
                </div>


                <div className="mt-3 mb-3">
                    <label
                        htmlFor="date"
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
                        formik.touched.date && formik.errors.date && (
                            <p className="text-red text-[14px]">{formik.errors.date}</p>
                    )}      
                </div>

                <div className="mt-3 mb-3">
                    <label
                        htmlFor="time"
                        className="font-sans font-medium text-grey text-[16px]"
                    >
                        <span className="text-red text-[20px]"> *</span>
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
                        {
                            formik.touched.time && formik.errors.time && (
                                <p className="text-red text-[14px]">{formik.errors.time}</p>
                        )} 
                    </div>
                </div>

                <div className="flex">
                    <div className="mt-3">
                        <label
                        htmlFor="dosage"
                        className="font-sans font-medium text-grey text-[16px]"
                        >
                            <span className="text-red text-[20px]"> *</span>
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
                         {
                            formik.touched.dosage && formik.errors.dosage && (
                                <p className="text-red text-[14px] mr-2">{formik.errors.dosage}</p>
                        )} 
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
                            <span className="text-red text-[20px]"> *</span>
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
                            <option value="drop (gtts)">drop (gtts)</option>
                            <option value="teaspoon (tsp)">teaspoon (tsp)</option>
                            <option value="tablespoon (tbsp)">tablespoon (tbsp)</option>
                            <option value="millilitre (mL)">millilitre (mL)</option>
                            <option value="fluid ounce (fl oz)">fluid ounce (fl oz)</option>
                            <option value="microgram (mcg)">microgram (mcg)</option>
                            <option value="milligram (mg)">milligram (mg)</option>
                            <option value="gram (g)">gram (g)</option>
                            <option value="ounce (oz)">ounce (oz)</option>
                            <option value="Other">Other</option>
                        </select>   
                        {
                            formik.touched.unit && formik.errors.unit && (
                                <p className="text-red text-[14px]">{formik.errors.unit}</p>
                        )}      
                    </div>
                </div>

                <div className="mt-3">
                    <label htmlFor="frequency" className="font-sans font-medium text-grey text-[16px]">
                        <span className="text-red text-[20px]"> *</span>
                        Frequency
                    </label>
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
                        <option value="Once a day (morning)">Once a day (morning)</option>
                        <option value="Once a day (evening)">Once a day (evening)</option>
                        <option value="Twice a day">Twice a day</option>
                        <option value="Three times a day">Three times a day</option>
                        <option value="Four times a day">Four times a day</option>
                        <option value="Five times a day">Five times a day</option>
                        <option value="Six times a day">Six times a day</option>
                        <option value="Every 30 minutes">Every 30 minutes</option>
                        <option value="Every 1 hour">Every 1 hour</option>
                        <option value="Every 2 hours">Every 2 hours</option>
                        <option value="Every 4 hours">Every 4 hours</option>
                        <option value="Every 6 hours">Every 6 hours</option>
                        <option value="Every 8 hours">Every 8 hours</option>
                        <option value="Before meals">Before meals</option>
                        <option value="After meals">After meals</option>
                        <option value="Before bedtime">Before bedtime</option>
                        <option value="Round-the-clock (RTC)">Round-the-clock (RTC)</option>
                        <option value="As needed (PRN)">As needed (PRN)</option>
                        <option value="Other">Other</option>
                    </select>
                        {
                            formik.touched.frequency && formik.errors.frequency && (
                                <p className="text-red text-[14px]">{formik.errors.frequency}</p>
                        )} 
                </div>

                <div className="mt-3">
                    <label htmlFor="route" className="font-sans font-medium text-grey text-[16px]">
                        <span className="text-red text-[20px]"> *</span>
                        Route
                    </label>
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
                        <option value="Oral">Oral</option>
                        <option value="Sublingual">Sublingual</option>
                        <option value="Enteral">Enteral</option>
                        <option value="Rectal">Rectal</option>
                        <option value="Inhalation">Inhalation</option>
                        <option value="Intramuscular">Intramuscular</option>
                        <option value="Subcutaneous">Subcutaneous</option>
                        <option value="Transdermal">Transdermal</option>
                        <option value="Topical">Topical</option>
                        <option value="Other">Other</option>
                    </select>
                        {
                            formik.touched.route && formik.errors.route && (
                                <p className="text-red text-[14px]">{formik.errors.route}</p>
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
                        onClick={() => router.push("/getMedications")}
                    />
                    <Button 
                        type="submit" 
                        text="Submit" 
                        style={{ width: "140px" }} 
                    />
                </div>

            </form>
            
    </div>
    )
}
