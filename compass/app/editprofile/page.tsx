'use client';
import Image from 'next/image';
import Button from '../components/Button';
import Input from '../components/Input';
import Link from 'next/link';
import { useFormik } from 'formik';

export default function EditProfile() {
    const formik = useFormik({
        initialValues: {
            fname: '',
            lname: '',
            street:'',
            city: '',
            province: '',
            postalCode: '',
            phone: '',
          },
          onSubmit: (values) => {
            console.log(values);
          },
          validate: (values) => {
            let errors: {
                phone?: string;
                postalCode?: string;
              } = {};

            if(values.postalCode) {
                if (!/[A-Z][0-9][A-Z] ?[0-9][A-Z][0-9]$/i.test(values.postalCode)) {
                  errors.postalCode = 'Invalid Postal Code';
                }
              }

            if(values.phone){
                if (!/^[0-9]{10}$/i.test(values.phone)) {
                  errors.phone = 'Please enter a 10 digit number';
                }
            }

            return errors;
        },
    });

    return (
        <div className="bg-eggshell min-h-screen flex flex-col">
        <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
        <Link href="">
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
            className="rounded-3xl bg-white flex flex-col m-auto w-full md:max-w-[800px] md:min-h-[550px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
            onSubmit={formik.handleSubmit}
        >
             <div className="mt-3 mb-3">
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
            </div>

            <div className="mt-3">
              <label
                htmlFor="street"
                className="font-sans font-medium text-grey text-[16px]"
              >
                Street Address
              </label>
              <br />
              <Input
                name="street"
                id="street"
                type="text"
                style={{ width: '100%' }}
                onChange={formik.handleChange}
                value={formik.values.street}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="mt-3">
              <label
                htmlFor="city"
                className="font-sans font-medium text-grey text-[16px]"
              >
                City
              </label>
              <br />
              <Input
                name="city"
                id="city"
                type="text"
                style={{ width: '100%' }}
                onChange={formik.handleChange}
                value={formik.values.city}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="mt-3">
              <label
                htmlFor="province"
                className="font-sans font-medium text-grey text-[16px]"
              >
                Province
              </label>
              <br />
              <Input
                name="province"
                id="province"
                type="text"
                style={{ width: '100%' }}
                onChange={formik.handleChange}
                value={formik.values.province}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="mt-3">
                <label
                  htmlFor="postalCode"
                  className="font-sans font-medium text-grey text-[16px]"
                >
                  Postal Code
                </label>
                <br />
                <Input
                  name="postalCode"
                  id="postalCode"
                  type="text"
                  style={{ width: '100%' }}
                  onChange={formik.handleChange}
                  value={formik.values.postalCode}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.postalCode && formik.errors.postalCode && (
                  <p className="text-[16px] text-red font-sans">
                    {formik.errors.postalCode}
                  </p>
                )}
              </div>

              <div className="mt-3 mb-8">
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

            <div className="mx-auto">
                <Button
                type="submit"
                text="Submit"
                style={{ width: '180px' }}
                />
            </div>
              
        </form>
        </div>
    )
}