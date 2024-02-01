'use client';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import Image from 'next/image';
import Button from '../components/Button';
import Input from '../components/Input';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';

export default function Register() {
  const logger = require('../../logger');
  const {error, signUp} = useAuth();
  const formik= useFormik({
    initialValues: {
      email: '',
      password: '',
      confPassword: '',
      fname: '',
      lname: '',
      phone: '',
      birthdate: '',
      sex: '',
    },
    onSubmit: (values) => {
        try{
            const data = {
                email: values.email,
                password: values.password,
                firstName: values.fname,
                lastName: values.lname,
                phoneNumber: values.phone,
                birthDate: values.birthdate,
                sex: values.sex,
            }
            signUp(data)
        } catch (error){
            console.log('error signing up')
            logger.error(error)
            formik.setSubmitting(false);
        }

    },
    validate: (values) => {
      let errors: {
        email?: string;
        password?: string;
        confPassword?: string;
        fname?: string;
        lname?: string;
        phone?: string;
        birthdate?: string;
        sex?: string;
      } = {};

      if (!values.email) {
        errors.email = 'Email Required';
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        errors.email = 'Invalid email format';
      }
      if (!values.password) {
        errors.password = 'Password Required';
      } else if (values.password.length < 6){
        errors.password = 'Password must be at least 6 characters long';
      }
      if (!values.confPassword) {
        errors.confPassword = 'Confirmation of Password Required';
      }
      if (!(values.confPassword.localeCompare(values.password) === 0)) {
        errors.confPassword = 'Passwords provided must match';
      }
      if (!values.fname) {
        errors.fname = 'First Name Required';
      } else if (
        !/^[^0-9 ][^\d]*[^0-9 ]$/i.test(values.fname)
      ){
        errors.fname = 'Names cannot contain numbers and must not begin or end with a space.';
      }
      if (!values.lname) {
        errors.lname = 'Last Name Required';
      } else if(
        !/^[^0-9 ][^\d]*[^0-9 ]$/i.test(values.lname)
      ){
        errors.lname = 'Names cannot contain numbers and must not begin or end with a space.';
      }
      if(!values.phone){
        errors.phone='Phone Number Required';
        } else if (!/^[0-9]{10}$/i.test(values.phone)) {
          errors.phone = 'Please enter a 10 digit number';
        }
      if(!values.birthdate){
        errors.birthdate='Birthdate Required';
      }
      if (!values.sex) {
        errors.sex = 'Sex Required';
      }
     
      return errors;
    },
  });


  useEffect(() => {
    const fields = ['email', 'password', 'confPassword', 'fname', 'lname', 'phone', 'birthdate', 'sex'];

    fields.forEach(field => {
      const input = document.getElementById(field) as HTMLInputElement;
      if (input.value.length !== 0) {
        formik.setFieldTouched(field, true);
      }
  });
  }, [formik.values]);
 
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState<boolean>(false);

  const handlePasswordVisibility = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault();
    setPasswordVisibility((previous) => !previous);
  };

  const handleConfirmPasswordVisibility = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault();
    setConfirmPasswordVisibility((previous) => !previous);
  };

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
      <span className="flex items-baseline font-bold md:font-normal text-darkgrey text-[24px] mx-4 mt-4 xl:hidden">
        <Link href="/">
          <Image
            src="/icons/LeftArrow.svg"
            alt="LeftArrow icon"
            width={10}
            height={10}
            className="mr-4 md:hidden"
            style={{ width: 'auto', height: 'auto' }}
          />
        </Link>
        Registration
      </span>
      <form
        className="rounded-3xl bg-white flex flex-col m-auto w-full md:max-w-[800px] md:min-h-[550px] pt-4 px-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
        onSubmit={formik.handleSubmit}
      >
            <div>
              <label
                htmlFor="email"
                className="mb-4 font-sans font-medium text-grey text-[16px]"
              >
                Email Address
              </label>
              <br />
              <Input
                name="email"
                id="email"
                type="text"
                style={{ width: '100%' }}
                onChange={formik.handleChange}
                value={formik.values.email}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-[16px] text-red font-sans">
                  {formik.errors.email}
                </p>
              )}
            </div>
            
            <div className="mt-3 relative">
              <label
                htmlFor="password"
                className="font-sans font-medium text-grey text-[16px]"
              >
                Password
              </label>
              <br />
              <Input
                name="password"
                id="password"
                type={passwordVisibility ? 'text' : 'password'}
                style={{ width: '100%' }}
                onChange={formik.handleChange}
                value={formik.values.password}
                onBlur={formik.handleBlur}
              />
              <div
                className="absolute right-2 bottom-3"
                onClick={handlePasswordVisibility}
              >
                {passwordVisibility ? (
                  <Image
                    src="/icons/visibleEye.svg"
                    alt="Eye icon"
                    width={24}
                    height={24}
                  />
                ) : (
                  <Image
                    src="/icons/invisibleEye.svg"
                    alt="Eye icon"
                    width={24}
                    height={24}
                    style={{ width: 'auto', height: 'auto' }}
                  />
                )}
              </div>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-[16px] text-red font-sans">
                {formik.errors.password}
              </p>
            )}

            <div className="mt-3 relative">
              <label
                htmlFor="confPassword"
                className="font-sans font-medium text-grey text-[16px]"
              >
                Confirm Password
              </label>
              <br />
              <Input
                name="confPassword"
                id="confPassword"
                type={confirmPasswordVisibility ? 'text' : 'password'}
                style={{ width: '100%' }}
                onChange={formik.handleChange}
                value={formik.values.confPassword}
                onBlur={formik.handleBlur}
              />
              <div
                className="absolute right-2 bottom-3"
                onClick={handleConfirmPasswordVisibility}
              >
                {confirmPasswordVisibility ? (
                  <Image
                    src="/icons/visibleEye.svg"
                    alt="Eye icon"
                    width={24}
                    height={24}
                  />
                ) : (
                  <Image
                    src="/icons/invisibleEye.svg"
                    alt="Eye icon"
                    width={24}
                    height={24}
                    style={{ width: 'auto', height: 'auto' }}
                  />
                )}
              </div>
            </div>
            {formik.touched.confPassword && formik.errors.confPassword && (
              <p className="text-[16px] text-red font-sans">
                {formik.errors.confPassword}
              </p>
            )}

            <div className="mt-3">
              <label
                htmlFor="fname"
                className="font-sans font-medium text-grey text-[16px]"
              >
                First Name
              </label>
              <br />
              <Input
                name="fname"
                id="fname"
                type="text"
                style={{ width: '100%' }}
                onChange={formik.handleChange}
                value={formik.values.fname}
                onBlur={formik.handleBlur}
              />
              {formik.touched.fname && formik.errors.fname && (
                <p className="text-[16px] text-red font-sans">
                  {formik.errors.fname}
                </p>
              )}
            </div>
            
            <div className="mt-3">
              <label
                htmlFor="lname"
                className="font-sans font-medium text-grey text-[16px]"
              >
                Last Name
              </label>
              <br />
              <Input
                name="lname"
                id="lname"
                type="text"
                style={{ width: '100%' }}
                onChange={formik.handleChange}
                value={formik.values.lname}
                onBlur={formik.handleBlur}
              />
              {formik.touched.lname && formik.errors.lname && (
                <p className="text-[16px] text-red font-sans">
                  {formik.errors.lname}
                </p>
              )}
            </div>

              <div className="mt-3">
                <label
                  htmlFor="phone"
                  className="font-sans font-medium text-grey text-[16px]"
                >
                  Phone Number
                </label>
                <br />
                <Input
                  name="phone"
                  id="phone"
                  type="text"
                  style={{ width: '100%' }}
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="text-[16px] text-red font-sans">
                    {formik.errors.phone}
                  </p>
                )}
              </div>
              <div className="mt-3">
                <label
                  htmlFor="birthdate"
                  className="font-sans font-medium text-grey text-[16px]"
                >
                  Birthdate
                </label>
                <br />
                <Input
                  name="birthdate"
                  id="birthdate"
                  type="date"
                  style={{ width: '100%' }}
                  onChange={formik.handleChange}
                  value={formik.values.birthdate}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.birthdate && formik.errors.birthdate && (
                  <p className="text-[16px] text-red font-sans">
                    {formik.errors.birthdate}
                  </p>
                )}
              </div>
              <div className="mt-3 relative">
                <label
                  htmlFor="sex"
                  className="font-sans font-medium text-grey text-[16px]"
                >
                  Sex
                </label>
                <br />
                <select
                  name="sex"
                  id="sex"
                  onChange={formik.handleChange}
                  value={formik.values.sex}
                  onBlur={formik.handleBlur}
                  className="p-2 w-full h-[52px] border border-solid border-lightgrey rounded-md text-grey focus:outline-blue shadow-[0_4px_8px_0_rgba(44,39,56,0.04)]"
                >
                  <option value="">Choose one</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            {formik.touched.sex && formik.errors.sex && (
              <p className="text-[16px] text-red font-sans">
                {formik.errors.sex}
              </p>
            )}
        <Button
          type="submit"
          text="Finish"
          isSubmitting={formik.isSubmitting}
          style={{ width: '140px', alignSelf: 'center', marginTop: '14px' }}
        />
      </form>
    </div>
  );
}
