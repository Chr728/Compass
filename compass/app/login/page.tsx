'use client';
import {useState} from 'react'
import Input from '../components/Input';
import Button from '../components/Button';
import Link from 'next/link';
import Image from 'next/image'

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [visible, setVisible] = useState<boolean>(false);

    
    const [emailError, setEmailError] = useState<string>();
    const [passwordError, setPasswordError] = useState<string>();
    
    const handleEmail = (e:React.ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault();
        setEmail(e.target.value);
    }
    const handlePassword = (e:React.ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault();
        setPassword(e.target.value);
    }

    const handleSubmit = (e:React.FormEvent): void => {
        e.preventDefault();
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)){
            setEmailError("Please enter a valid email address");
        }
        else {
            setEmailError("");
        }
        if(password===""){
            setPasswordError("Please enter a valid password");
            // console.log(password);
        }
        else{
            setPasswordError("");
        }

        console.log(passwordError);
        console.log(emailError);
        if(emailError==="" && passwordError===""){
            setEmail("");
            setPassword("");
        }
    }

    const handleVisibility = (e:React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        e.preventDefault();
        setVisible(previous => !previous)
    }

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
        <form className="rounded-3xl bg-white flex flex-col m-auto w-full md:max-w-[800px] md:h-[600px] p-8" onSubmit={handleSubmit}>
                <div className="mb-6">
                    <p className="text-[34px] text-darkgrey font-sans font-bold">Sign In</p>
                    <p className="text-darkgrey text-[16px] font-sans leading-[22px]">Don&apos;t have an account yet?</p>
                    <p className="text-blue font-sans text-[16px] leading-[22px]"><Link href='/register'>Sign Up now</Link></p> 
                </div>

                <div>
                    <label htmlFor='email' className="text-grey font-medium">Email</label>
                    <br/>
                    <Input name="email" id="email" type="text" value={email} onChange={handleEmail} style={{ width: '100%' }}/>
                </div>
                {emailError && <p className="text-[16px] text-red font-sans">Please enter a valid email address</p>}
               

                <div className="relative mt-6">
                    <label htmlFor='password' className="text-grey font-medium">Password</label>
                    <br/>
                    <Input name="password" id="password" type={visible ? "text":"password"} value={password} onChange={handlePassword} style={{ width: '100%' }}/>
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
                {passwordError && <p className="text-[16px] text-red font-sans">Please enter a valid password</p>}


                <div className="md:mt-auto mt-6 w-full">
                    <Button type="submit" text="Sign In" style={{ width: '100%' }} />
                </div>

                <p className="text-blue font-sans text-[16px] leading-[22px] mb-4 mt-6"><Link href='/reset'>Forgot Password?</Link></p>

        </form>
    </div>
  )
}
