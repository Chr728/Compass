"use client";

import React from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useFormik } from "formik";
import { useState } from "react";
import { auth } from "../config/firebase";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { useSearchParams } from "next/navigation";
import Header from "../components/Header";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";

export default function ChangePassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentVisible, setCurrentVisible] = useState<boolean>(false);
  const [newVisible, setNewVisible] = useState<boolean>(false);
  const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
  const [passwordChanged, setPasswordChanged] = useState<boolean>(
    searchParams.get("passwordChanged") === "true"
  );
  const [reauthError, setReauthError] = useState<boolean>(false);

  const handleCurrentVisibility = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault();
    setCurrentVisible((previous) => !previous);
  };
  const handleNewVisibility = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault();
    setNewVisible((previous) => !previous);
  };
  const handleConfirmVisibility = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault();
    setConfirmVisible((previous) => !previous);
  };

  let errors: {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  } = {};

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async (values) => {
      try {
        const user = auth.currentUser;

        if (!user) {
          console.error("User not authenticated.");
          return;
        }

        const credential = EmailAuthProvider.credential(
          user?.email || "",
          values.currentPassword
        );
        try {
          await reauthenticateWithCredential(user, credential);
          setReauthError(false);
        } catch (error) {
          console.error("Reauthentication failed:", error);
          setReauthError(true);
        }
        // Ensure the new password is not the same as the current password
        if (values.newPassword !== values.currentPassword) {
          await updatePassword(user, values.newPassword);
          setPasswordChanged(true);
          Swal.fire({
            title: "Success!",
            text: "Password changed successfully!",
            icon: "success",
          }).then((result) => {
            // Redirect to settings page after closing the alert
            if (result.isConfirmed || result.isDismissed) {
              router.push("/settings");
            }
          });
        } else {
          console.error(
            "New password cannot be the same as the current password."
          );
        }
      } catch (error) {
        console.error("Password change failed:", error);
      }
    },
    validate: (values) => {
      if (!values.currentPassword) {
        errors.currentPassword = "Current Password is required";
      }
      if (reauthError) {
        errors.currentPassword = "Incorrect current password";
      }

      if (!values.newPassword) {
        errors.newPassword = "New Password is required";
      } else if (values.newPassword.length < 6) {
        errors.newPassword = "Password must be at least 6 characters long";
      } else if (values.newPassword === values.currentPassword) {
        errors.newPassword =
          "New Password cannot be the same as the Current Password";
      }

      if (!values.confirmPassword) {
        errors.confirmPassword = "Confirm Password is required";
      } else if (values.confirmPassword !== values.newPassword) {
        errors.confirmPassword = "Passwords do not match";
      }

      return errors;
    },
  });

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
      <>
        {" "}
        <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
          <button onClick={() => router.push("/settings")}>
            <Header headerText="Change your password"></Header>
          </button>
        </span>
      </>
      {passwordChanged ? null : (
        <form
          className="rounded-3xl bg-white flex flex-col m-auto w-full md:max-w-[800px] md:h-[400px] p-8"
          onSubmit={formik.handleSubmit}
        >
          <div>
            <label htmlFor="currentPassword" className="text-grey font-medium">
              Current Password
            </label>
            <br />
            <div className="relative">
              <Input
                name="currentPassword"
                id="currentPassword"
                type={currentVisible ? "text" : "password"}
                value={formik.values.currentPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{ width: "100%" }}
              />
              <div
                className="absolute right-2 bottom-3"
                onClick={handleCurrentVisibility}
              >
                {currentVisible ? (
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
          </div>
          {formik.touched.currentPassword && formik.errors.currentPassword ? (
            <p className="text-[16px] text-red font-sans">
              {formik.errors.currentPassword}
            </p>
          ) : null}

          <div>
            <label htmlFor="newPassword" className="text-grey font-medium">
              New Password
            </label>
            <br />
            <div className="relative">
              <Input
                name="newPassword"
                id="newPassword"
                type={newVisible ? "text" : "password"}
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{ width: "100%" }}
              />
              <div
                className="absolute right-2 bottom-3"
                onClick={handleNewVisibility}
              >
                {newVisible ? (
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
          </div>
          {formik.touched.newPassword && formik.errors.newPassword ? (
            <p className="text-[16px] text-red font-sans">
              {formik.errors.newPassword}
            </p>
          ) : null}

          <div>
            <label htmlFor="confirmPassword" className="text-grey font-medium">
              Confirm Password
            </label>
            <br />
            <div className="relative">
              <Input
                name="confirmPassword"
                id="confirmPassword"
                type={confirmVisible ? "text" : "password"}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{ width: "100%" }}
              />
              <div
                className="absolute right-2 bottom-3"
                onClick={handleConfirmVisibility}
              >
                {confirmVisible ? (
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
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <p className="text-[16px] text-red font-sans">
              {formik.errors.confirmPassword}
            </p>
          ) : null}

          <div className="md:mt-auto mt-6 w-full">
            {formik.errors.newPassword ? (
              <Button
                type="submit"
                text="Change Password"
                style={{ width: "100%", cursor: "not-allowed" }}
              />
            ) : (
              <Button
                type="submit"
                text="Change Password"
                style={{ width: "100%" }}
              />
            )}
          </div>
        </form>
      )}
    </div>
  );
}
