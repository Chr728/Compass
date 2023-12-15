'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '../components/Header';
import { useUser } from '../contexts/UserContext';


export default function AboutUsPage() {
  const logger = require('../../logger');
  const router = useRouter();
  const { userInfo } = useUser();
  
  useEffect(() => {
    if (!userInfo) {
      logger.warn('User not found.');
      alert('User not found.');
    } 
  }, [userInfo, router]);




    return (
      <div className="bg-eggshell min-h-screen flex flex-col">
        <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
          <button onClick={() => router.push('/settings')}>
            <Header headerText="About Us"></Header>
          </button>
        </span>
    
        
  <div className="rounded-3xl bg-white flex flex-col mt-4 mb-44 w-full md:max-w-[800px] md:min-h-[550px] p-4 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
       <div className="font-bold text-start text-darkgrey p-3 text-[20px]">About Compass</div>
  <div className="flex justify-between items-center">
     
        <br></br>    <br></br>
            <div className="font-sans text-start text-darkgrey p-4 text-[14px]">
                Compass is a medical wellness app that targets specifically people above 40 years old who might be interested in having some type of
                assistance to keep their healthy habits and lifestyles. Compass offers features of managing medical reminders, booking appointments,tracking
                user’s medications and treatments all in one consolidated application. In addition, having features of medical journals such as diabetic
                journals allows some patients to easily note their daily doses and treatment details making them able to follow the history of their
                treatments and use it as a reference for themselves or to show to their medical professional. Additionally,with the speed dial fast option
                to contact relatives during some emergency situations patients would be able to contact their relatives in a faster and easier way.
                With many features compass aims for users to be healthier and function hassle free.
             <p className={'w-full h-full text-grey text-center mt-32'}>&copy; Compass 2023</p>
</div>
  </div>

  </div>
      </div>
    );
    
}
