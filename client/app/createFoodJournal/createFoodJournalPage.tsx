'use client';
import Button from '../components/Button';
import Input from '../components/Input';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { createFoodIntakeJournal } from '../http/foodJournalAPI'; 
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

export default function CreateFoodJournalPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const formik = useFormik({
    initialValues: {
      date: '', // Initialize the form fields with empty values
      time: '',
      foodName: '',
      mealType: '',
      servingNumber: 0.0,
      notes: '',
    },

    onSubmit: async (values) => {
      try {
        const userId = user?.uid || '';
        const data = {
          date: values.date,
          time: values.time,
          foodName: values.foodName,
          mealType: values.mealType,
          servingNumber: values.servingNumber,
          notes: values.notes,
        };
        const result = await createFoodIntakeJournal(data); 
        router.push('/getFoodJournals');
      } catch (error) {
        console.error('Error creating food journal entry:', error);
      }
    },
  });


  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
       <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
              <button onClick={() => router.push('/getFoodJournals')}>
              <Header headerText="Create Food Journal"></Header>
              </button>
              </span>
      <form
      className="rounded-3xl bg-white flex flex-col mb-8 w-full md:max-w-[800px] md:min-h-[550px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
      onSubmit={formik.handleSubmit}
    >
      <div className="mt-3 mb-3">
        <label
          htmlFor="date"
          className="font-sans font-medium text-grey text-[16px]"
        >
          Date
        </label>
        <span className="text-red text-[20px]"> *</span>
        <br />
        <Input 
    name="date"
    id="date"
    type="date"
    style={{ width: '100%' }}
    onChange={formik.handleChange}
    value={formik.values.date}
    onBlur={formik.handleBlur}
    required={true} 
    />
{formik.touched.date && !formik.values.date && (
        <p className="text-red text-[14px]">This field can't be left empty.</p>
      )}      </div>

      <div className="mt-3">
        <label
          htmlFor="time"
          className="font-sans font-medium text-grey text-[16px]"
        >
          Time
        </label>
        <span className="text-red text-[20px]"> *</span>
        <br />
        <Input
    name="time"
    id="time"
    type="time"
    style={{ width: '100%' }}
    onChange={formik.handleChange}
    value={formik.values.time}
    onBlur={formik.handleBlur}
  />
{formik.touched.time && !formik.values.time && (
        <p className="text-red text-[14px]">This field can't be left empty.</p>
      )}      
      </div>

      
  <div className="mt-3">
    <label
      htmlFor="foodName"
      className="font-sans font-medium text-grey text-[16px]"
    >
      Name of Food
    </label>
    <span className="text-red text-[20px]"> *</span>
    <br />
    <Input
      name="foodName"
      id="foodName"
      type="text"
      style={{ width: '100%' }}
      onChange={formik.handleChange}
      value={formik.values.foodName}
      onBlur={formik.handleBlur}
    />
    {/* Check if the field is touched */}
    {formik.touched.foodName && (
      // Check if the field is empty
      !formik.values.foodName && 
      (
        <p className="text-red text-[14px]">This field can't be left empty or zero.</p>
      ) 
    )}
  </div>
 
  <div className="mt-3" >
    <label
      htmlFor="mealType"
      className="font-sans font-medium text-grey text-[16px]"
    >
      Meal Type
    </label>
    
    <span className="text-red text-[20px]"> *</span>
    <br />
    <select
      className="text-darkgrey"
      name="mealType"
      id="mealType"
      style={{
        width: '100%',
        border: '1px solid #DBE2EA', // Border style
        borderRadius: '5px',
        marginTop: '5px',
      }}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values.mealType}
    >
      <option className="text-darkgrey" value="Breakfast">
        Breakfast
      </option>
      <option className="text-darkgrey" value="Morning snack">
        Morning snack
      </option>
      <option className="text-darkgrey" value="Lunch">
        Lunch
      </option>
      <option className="text-darkgrey" value="Afternoon Snack">
        Afternoon Snack
      </option>
      <option className="text-darkgrey" value="Dinner">
        Dinner
      </option>
      <option className="text-darkgrey" value="Bedtime Snack">
        Bedtime Snack
      </option>
      <option className="text-darkgrey" value="Other">
        Other
      </option>
    </select>
    {formik.touched.mealType && !formik.values.mealType && (
      <p className="text-red text-[14px]">This field can't be left empty.</p>
    )}
  </div>




      <div className="mt-3">
        <label
          htmlFor="servingNumber"
          className="font-sans font-medium text-grey text-[16px]"
        >
         Number of Servings
        </label>
        <span className="text-red text-[20px]"> *</span>
        <br />
        <Input
          name="servingNumber"
          id="servingNumber"
          type="number"
          style={{ width: '100%' }}
          onChange={formik.handleChange}
          value={formik.values.servingNumber.toString()}
          onBlur={formik.handleBlur}
        />
        

       {/* Check if the field is touched */}
  {formik.touched.servingNumber && (
    // Check if the field is empty
    !formik.values.servingNumber && (
      <p className="text-red text-[14px]">This field can't be left empty or zero.</p>
    ) || (
      // Check if the field is less than or equal to zero
      formik.values.servingNumber <= 0 && (
        <p className="text-red text-[14px]">You can't enter a negative servings number or a number of zero.</p>
      )
    )
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
                <Input
                  name="notes"
                  id="notes"
                  type="text"
                  style={{ width: '100%' }}
                  onChange={formik.handleChange}
                  value={formik.values.notes}
                  onBlur={formik.handleBlur}
                />
              </div>
      <div className='mt-10 pb-4 self-center'>
      <div className="mt-5 mb-5 space-x-2">
        <Button
          type="button"
          text="Cancel"
          style={{ width: '140px', backgroundColor: 'var(--Red, #FF7171)' }}
          onClick={() => router.push("/getFoodJournals")}
        />


<Button
          type="submit"
          text="Submit"
          disabled={
            !(formik.isValid && formik.dirty) || // Check if the form is valid and dirty
            formik.values.servingNumber === 0 || // Check if Number of Servings is zero
            formik.values.servingNumber < 0 || // Check if Number of Servings is less than zero
            !formik.values.mealType || // Check if Meal Type is missing or empty
            !formik.values.date || // Check if date is missing or empty
            !formik.values.time || // Check if time is missing or empty
            !formik.values.foodName || // Check if foodName is missing or empty
            !formik.values.servingNumber // Check if Number of Servings is missing or empty
          }
          style={{ width: '140px', textAlign: 'center' }}
          onClick={() => router.push("/getFoodJournals")}
        />
        </div>
      </div>
    </form>
    </div>
  );
}