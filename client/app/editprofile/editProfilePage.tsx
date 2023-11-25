'use client';
import Image from 'next/image';
import Button from '../components/Button';
import Input from '../components/Input';
import Link from 'next/link';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import {useUser} from '../contexts/UserContext';

export default function EditProfile() {
    const router = useRouter();
    const {updateCurrentUser, userInfo} = useUser();
    const {firstName, lastName, phoneNumber} = userInfo;
    const formik = useFormik({
        initialValues: {
            fname: firstName,
            lname: lastName,
            phone: phoneNumber,
          },
          onSubmit: (values) => {
            const data = {
                firstName: values.fname,
                lastName: values.lname,
                phoneNumber: values.phone,
            }
            updateCurrentUser(data);
            router.push("/profile");
          },
          validate: (values) => {
            let errors: {
                fname?:string;
                lname?:string;
                phone?: string;
              } = {};
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
            return errors;
        },
    });

    return (
        <div className="bg-eggshell min-h-screen flex flex-col">
        <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
        <Link href="/profile">
            <Image
            src="/icons/LeftArrow.svg"
            alt="LeftArrow icon"
            width={10}
            height={10}
            className="mr-4 md:hidden"
            style={{ width: 'auto', height: 'auto' }}
            />
        </Link>
        Edit Profile
        </span>

        <form
            className="rounded-3xl bg-white flex flex-col mx-auto my-24 w-full md:max-w-[800px] md:min-h-[550px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
            onSubmit={formik.handleSubmit}
        >
          <div>
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

          <div className="mt-4">
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

          <div className="mt-4 mb-8">
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

          <div className="mx-auto space-x-2">
            <Button
              type="button"
              text="Cancel"
              style={{ width: '140px', backgroundColor: 'var(--Red, #FF7171)' }}
              onClick={ () => router.push("/profile")}
            />

            <Button
              type="submit"
              text="Submit"
              disabled={!(formik.isValid && formik.dirty)}
              style={{ width: '140px' }}
            />
          </div>
              
        </form>
      </div>      
    )
}