"use client";
import React from 'react';
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import { useFormik } from 'formik';
import SpanHeader from "../components/SpanHeader";

export default function SymptomMainPage() {
    const logger = require("../../logger");
	const router = useRouter();
	const { user } = useAuth();

    useEffect(() => {
		if (!user) {
			logger.warn("User not found.");
			alert("User not found.");
		}
	}, [user, router]);

    const formik = useFormik({
        initialValues: {
            checkBox: false
        },
        onSubmit: (values) => {
            router.push('/symptomAI/chooseSymptom')
        },
        validate: async(values) => {
            let errors : {
                checkBox?: string;
                }
               = {};

            if(!values.checkBox){
                errors.checkBox = "Must agree to proceed.";
            }

            return errors;
        }
    })

    const termsAndConditions = [
        'The result that will not be displayed is not a diagnosis.',
        'This checkup is for informational purposes and is not a replacement to qualified medical opinion.',
        'Information that you provide is anonymous and not shared with anyone. We do not store any information on our server.',
        'If you need immediate medical attention, please contact emergency medical services right away.'
    ];

    const listItems = termsAndConditions.map((statement, index) =>
    <li key={index}>{statement}</li>
    );
  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
        <SpanHeader
            onClick={() => router.push("/health")}
            headerText="Symptom Checker AI">
        </SpanHeader>
        <div className="overflow-y-auto">
            <div className="px-4">
                <p className="font-sans text-darkgrey text-[14px] mb-2">
                    We know you might be worried you are sick and knowing what is wrong may give you a better idea 
                    on how to take care of yourself.
                </p>
                <p className="font-sans text-darkgrey text-[14px] mb-2">
                    Pick out all the signs and symptoms you are
                    currently feeling and our AI will try its best to
                    make an approximate prediction.
                </p>
                <p className="font-sans text-darkgrey text-[14px] mb-2">
                    Usage of this AI is subject to agreement to the following terms and conditions:
                </p>
                <ul className="p-4" style={{ listStyleType: 'disc' }}>
                    <li className="font-sans text-darkgrey text-[14px]">{listItems}</li>
                </ul>
            </div>

            <form onSubmit = {formik.handleSubmit} className= "flex flex-col items-center mt-8 space-y-4 mb-24 text-baseline">
                <label className="text-[12px] font-sans text-grey ">
                    <input
                        type="checkbox" 
                        name="checkBox"
                        checked={formik.values.checkBox}
                        onChange={formik.handleChange}
                        style={{ verticalAlign: 'middle', marginRight: '4px' }} 
                    />
                    <span style={{ verticalAlign: 'middle' }}>I agree to the aforementioned terms and conditions.</span>
                </label>
                
                {
                    formik.touched.checkBox && formik.errors.checkBox && (
                        <p className="text-[16px] text-red font-sans ">
                            {formik.errors.checkBox}
                        </p>
                    )
                }

                <Button 
                    type="submit"
                    text="Start"
                    style={{ width: "140px", textAlign: "center" }}
                />
            </form>
        </div>
    </div>
  )
}
