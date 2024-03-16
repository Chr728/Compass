"use client";
import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Link from "next/link";
import Image from "next/image";
import { useFormik } from "formik";
import { useAuth, AuthProvider } from "../contexts/AuthContext";
import NextImage from "next/image";
import compassImage from "@/public/compass-removebg.png";

export default function Login() {
  const { user, login, error } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        await login(values.email, values.password);
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
    validate: (values) => {
      let errors: {
        email?: string;
        password?: string;
      } = {};
      if (!values.email) {
        errors.email = "Email is required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        errors.email = "Invalid email format";
      }

      if (!values.password) {
        errors.password = "Password is required";
      }

      return errors;
    },
  });

  const [visible, setVisible] = useState<boolean>(false);

  const handleVisibility = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault();
    setVisible((previous) => !previous);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center overflow-hidden">
      <div
        className={
          "w-full flex flex-col justify-center items-center space-y-0 px-2"
        }
      >
        <NextImage src={compassImage} height={250} alt="Compass Logo" />
      </div>
      <form
        className="rounded-3xl bg-white flex flex-col  w-full md:max-w-[800px] md:h-[600px] p-8"
        onSubmit={formik.handleSubmit}
      >
        {/*<div className="">*/}
        {/*  <p className="text-[34px] text-darkgrey font-sans font-bold w-full text-center">*/}
        {/*    Sign In*/}
        {/*  </p>*/}
        {/*</div>*/}
        <div>
          <label htmlFor="email" className="text-grey font-medium">
            Email
          </label>
          <br />
          <Input
            name="email"
            id="email"
            type="text"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{ width: "100%" }}
          />
        </div>
        {formik.touched.email && formik.errors.email ? (
          <p className="text-[16px] text-red font-sans">
            {formik.errors.email}
          </p>
        ) : null}

        <div className="relative mt-6">
          <label htmlFor="password" className="text-grey font-medium">
            Password
          </label>
          <br />
          <Input
            name="password"
            id="password"
            type={visible ? "text" : "password"}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{ width: "100%" }}
          />
          <div className="absolute right-2 bottom-3" onClick={handleVisibility}>
            {visible ? (
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
                style={{ width: "auto", height: "auto" }}
              />
            )}
          </div>
        </div>
        {formik.touched.password && formik.errors.password ? (
          <p className="text-[16px] text-red font-sans">
            {formik.errors.password}
          </p>
        ) : null}
        <p className="text-blue font-sans text-[16px] leading-[22px] w-full flex justify-end mt-1">
          <Link href="/forgotpassword">Forgot Password?</Link>
        </p>
        <div className="md:mt-auto mt-6 w-full">
          {error && (
            <p className="md:text-center text-[16px] text-red font-sans mb-2">
              {error}
            </p>
          )}
          {formik.errors.password || formik.errors.email ? (
            <Button
              type="submit"
              text="Sign In"
              style={{ width: "100%", cursor: "not-allowed" }}
            />
          ) : (
            <Button type="submit" text="Sign In" style={{ width: "100%" }} />
          )}
        </div>
      </form>
      <div className={"w-full flex justify-center h-full"}>
        <div className={"flex flex-col items-center justify-center"}>
          <p className="text-darkgrey text-[16px] font-sans leading-[22px]">
            Don&apos;t have an account yet?
          </p>
          <p className="text-blue font-sans text-[16px] leading-[22px]">
            <Link href="/register">Sign Up now</Link>
          </p>
        </div>
      </div>
      {/* Banner for installation instructions */}
      <style jsx global>{`
        #installInstructions {
          display: none;
          cursor: pointer;
          min-width: 300px;
        }

        @media (display-mode: browser) {
          #installInstructions {
            display: block;
          }
        }
      `}</style>

      <button
        id="installInstructions"
        className="mt-20 bg-blue text-[16px] text-white font-sans font-medium rounded-md h-[40px] shadow-[0px_4px_8px_0px_rgba(44,39,56,0.08),0px_2px_4px_0px_rgba(44,39,56,0.08)]"
      >
        <Link href="/installinstructions">
          Need help with installation? Click here.
        </Link>
      </button>
      <p className={"w-full h-full text-grey text-center mt-2"}>
        &copy; Compass 2023
      </p>
    </div>
  );
}
