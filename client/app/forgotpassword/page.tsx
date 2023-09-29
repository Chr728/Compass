"use client";
import Input from "../components/Input";
import Button from "../components/Button";
import Link from "next/link";
import Image from "next/image";
import { useFormik } from "formik";
import { useState } from "react";
import { auth } from "../config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useSearchParams } from "next/navigation";

export default function ForgotPassword() {
  const searchParams = useSearchParams();

  let errors: {
    email?: string;
  } = {};

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        if (values.email) {
          sendPasswordResetEmail(auth, values.email).catch((error) => {
            console.log(error.code);
            console.log(error.message);
            if (error.code == "auth/user-not-found") {
              errors.email = "This email is not on record";
            }
          });
          setLoggedIn(false);
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
    validate: (values) => {
      if (!values.email) {
        errors.email = "Email is required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        errors.email = "Invalid email format";
      }
      // TO BE ADDED
      //   else if (
      //     // If email does not exist in the database
      //   ) {
      //     errors.email = 'No account found with this email';
      //   }
      return errors;
    },
  });

  const [loggedIn, setLoggedIn] = useState<boolean>(
    searchParams.get("loggedIn") === "true"
  );

  const handleVisibility = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault();
    setLoggedIn((previous) => !previous);
  };

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
      {loggedIn ? (
        <span className="flex items-baseline font-bold md:font-sans text-darkgrey text-[24px] mx-4 mt-4">
          <Link href="/settings">
            <Image
              src="/icons/LeftArrow.svg"
              alt="LeftArrow icon"
              width={10}
              height={10}
              className="mr-4"
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
          Password Change
        </span>
      ) : null}
      <form
        className="rounded-3xl bg-white flex flex-col m-auto w-full md:max-w-[800px] md:h-[400px] p-8"
        onSubmit={formik.handleSubmit}
      >
        <div className="mb-6">
          {loggedIn ? (
            <p className="text-[34px] text-darkgrey font-sans font-bold">
              Password Change
            </p>
          ) : (
            <p className="text-[34px] text-darkgrey font-sans font-bold">
              Reset Password
            </p>
          )}
          <p className="text-darkgrey text-[16px] font-sans leading-[22px]">
            Enter your email for a password reset link.
          </p>
        </div>

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
        <div className="md:mt-auto mt-6 w-full">
          {formik.errors.email ? (
            <Button
              type="submit"
              text="Send Reset Link"
              style={{ width: "100%", cursor: "not-allowed" }}
            />
          ) : (
            <Button
              type="submit"
              text="Send Reset Link"
              style={{ width: "100%" }}
            />
          )}
        </div>

        {loggedIn ? null : (
          <p className="text-blue font-sans text-[16px] leading-[22px] mb-4 mt-6">
            <Link href="/login">Back to Sign in</Link>
          </p>
        )}
      </form>
    </div>
  );
}
