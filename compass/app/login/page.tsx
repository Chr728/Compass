'use client';
import {useState} from 'react'
import Input from '../components/Input';
import Button from '../components/Button';
import Link from 'next/link';
import Image from 'next/image'

export default function Login() {
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [visible, setVisible] = useState<boolean>(false);

    const handleName = (e:React.ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault();
        setName(e.target.value);
       
    }
    const handlePassword = (e:React.ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault();
        setPassword(e.target.value);
    }

    const handleSubmit = (e:React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        
    }

    const handleVisibility = (e:React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        e.preventDefault();
        setVisible(previous => !previous)
    }

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
        
        <form className="rounded-3xl bg-white flex flex-col m-auto w-full md:max-w-[800px] md:h-[600px] p-8">
                <div className="mb-6">
                    <p className="text-[34px] text-darkgrey font-sans font-bold">Sign In</p>
                    <p className="text-darkgrey text-[16px] font-sans leading-[22px]">Don't have an account yet?</p>
                    <p className="text-blue font-sans text-[16px] leading-[22px]"><Link href='/register'>Sign Up now</Link></p> 
                </div>

                <div className="mb-6">
                    <label htmlFor='email' className="text-grey font-medium">Email</label>
                    <br/>
                    <Input name="email" id="email" type="text" value={name} onChange={handleName} style={{ width: '100%' }}/>
                </div>

                <div className="relative">
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


                <div className="md:mt-auto mt-6 w-full">
                    <Button type="submit" text="Sign In" style={{ width: '100%' }} onClick={handleSubmit}/>
                </div>

    
                <p className="text-blue font-sans text-[16px] leading-[22px] mb-4 mt-6"><Link href='/reset'>Forgot Password?</Link></p>

        </form>
    </div>
  )
}
