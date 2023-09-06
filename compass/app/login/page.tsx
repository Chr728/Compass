'use client';
import {useState} from 'react'
import Input from '../components/Input';
import Button from '../components/Button';
import Link from 'next/link';
import Image from 'next/image'
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';

export default function Login() {
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        onSubmit: values => {
            console.log(values);
            // redirect to home page on form submission
            router.push('/');
        },
        validate: values => {
            let errors : {
                email?: string;
                password?:string;
            } = {};
            if(!values.email){
                errors.email= "Email is required";
            }
            else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
                errors.email = 'Invalid email format';
            }

            if(!values.password){
                errors.password="Password is required";
            }

            return errors;
        }
    })

 
    const [visible, setVisible] = useState<boolean>(false);

    const handleVisibility = (e:React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        e.preventDefault();
        setVisible(previous => !previous)
    }

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
        <form className="rounded-3xl bg-white flex flex-col m-auto w-full md:max-w-[800px] md:h-[600px] p-8" onSubmit={formik.handleSubmit}>
                <div className="mb-6">
                    <p className="text-[34px] text-darkgrey font-sans font-bold">Sign In</p>
                    <p className="text-darkgrey text-[16px] font-sans leading-[22px]">Don&apos;t have an account yet?</p>
                    <p className="text-blue font-sans text-[16px] leading-[22px]"><Link href='/register'>Sign Up now</Link></p> 
                </div>

                <div>
                    <label htmlFor='email' className="text-grey font-medium">Email</label>
                    <br/>
                    <Input name="email" id="email" type="text" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} style={{ width: '100%' }}/>
                </div>
                {formik.touched.email && formik.errors.email ? <p className="text-[16px] text-red font-sans">{formik.errors.email}</p> : null}
                
                <div className="relative mt-6">
                    <label htmlFor='password' className="text-grey font-medium">Password</label>
                    <br/>
                    <Input name="password" id="password" type={visible ? "text":"password"} value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} style={{ width: '100%' }}/>
                    <div className="absolute right-2 bottom-3" onClick={handleVisibility}>
                        {visible? <Image
                                src="/icons/visibleEye.svg"
                                alt="Eye icon"
                                width={24}
                                height={24}
                                /> : <Image
                                src="/icons/invisibleEye.svg"
                                alt="Eye icon"
                                width={24}
                                height={24}
                                style={{ width: 'auto', height: 'auto'}}
                                />}
                    </div>
                </div>
                {formik.touched.password && formik.errors.password ? <p className="text-[16px] text-red font-sans">{formik.errors.password}</p> : null}
            
                <div className="md:mt-auto mt-6 w-full">
                    {formik.errors.password || formik.errors.email ? 
                    <Button type="submit" text="Sign In" style={{ width: '100%', cursor: 'not-allowed' }} />
                    : 
                    <Button type="submit" text="Sign In" style={{ width: '100%' }} />
                     }

                    
                </div>

                <p className="text-blue font-sans text-[16px] leading-[22px] mb-4 mt-6"><Link href='/reset'>Forgot Password?</Link></p>

        </form>
    </div>
  )
}
