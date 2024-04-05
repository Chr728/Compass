"use client";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import FormLabel from "../components/FormLabel";
import Input from "../components/Input";
import SpanHeader from "../components/SpanHeader";
import { useProp } from "../contexts/PropContext";
import { useUser } from "../contexts/UserContext";
import { createGlucoseJournal } from "../http/diabeticJournalAPI";

export default function CreateGlucoseJournalPage() {
  const logger = require("../../logger");
  const router = useRouter();
  const { userInfo } = useUser();
  const { handlePopUp } = useProp();

  useEffect(() => {
    if (!userInfo) {
      alert("User not found.");
    }
  }, [userInfo, router]);

  const formik = useFormik({
    initialValues: {
      date: "", // Initialize the form fields with empty values
      mealTime: "",
      bloodGlucose: 0.0,
      unit: "",
      notes: "",
    },

    onSubmit: async (values) => {
      try {
        const data = {
          date: values.date,
          mealTime: values.mealTime,
          bloodGlucose: values.bloodGlucose,
          unit: values.unit,
          notes: values.notes,
        };
        const result = await createGlucoseJournal(data).then((result) => {
          router.push("/getDiabeticJournals");
        });
        logger.info("glucose journal entry created:", result);
      } catch (error) {
        handlePopUp("error", "Error creating glucose journal entry:");
      }
    },
  });

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
      <SpanHeader
        onClick={() => router.push("/getDiabeticJournals")}
        headerText="Create Glucose Measurement"
      ></SpanHeader>
      <form
        className="rounded-3xl bg-white flex flex-col mb-8 w-full md:max-w-[800px] md:min-h-[550px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
        onSubmit={formik.handleSubmit}
      >
        <div className="mt-3 mb-3">
          <FormLabel htmlFor={"date"} label={"Date"}></FormLabel>
          <Input
            name="date"
            id="date"
            type="date"
            style={{ width: "100%" }}
            onChange={formik.handleChange}
            value={formik.values.date}
            onBlur={formik.handleBlur}
            required={true}
          />
          {formik.touched.date && !formik.values.date && (
            <p className="text-red text-[14px]">
              This field can't be left empty.
            </p>
          )}{" "}
        </div>

        <div className="mt-3">
          <FormLabel htmlFor={"mealTime"} label={"Meal Time"}></FormLabel>
          <select
            className="text-darkgrey"
            name="mealTime"
            id="mealTime"
            style={{
              width: "100%",
              border: "1px solid #DBE2EA", // Border style
              borderRadius: "5px",
              marginTop: "5px",
              height: "50px",
            }}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.mealTime}
          >
            <option className="text-darkgrey" value="">
              Choose one
            </option>
            <option className="text-darkgrey" value="Before breakfast">
              Before breakfast
            </option>
            <option className="text-darkgrey" value="30min after breakfast">
              30min after breakfast
            </option>
            <option className="text-darkgrey" value="2hrs after breakfast">
              2hrs after breakfast
            </option>
            <option className="text-darkgrey" value="Before lunch">
              Before lunch
            </option>
            <option className="text-darkgrey" value="30min after lunch">
              30min after lunch
            </option>
            <option className="text-darkgrey" value="2hrs after lunch">
              2hrs after lunch
            </option>
            <option className="text-darkgrey" value="Before dinner">
              Before dinner
            </option>
            <option className="text-darkgrey" value="30min after dinner">
              30min after dinner
            </option>
            <option className="text-darkgrey" value="2hrs after dinner">
              2hrs after dinner
            </option>
            <option className="text-darkgrey" value="Bedtime">
              Bedtime
            </option>
            <option className="text-darkgrey" value="Night">
              Night
            </option>
            <option className="text-darkgrey" value="Other">
              Other
            </option>
          </select>

          {formik.touched.mealTime && !formik.values.mealTime && (
            <p className="text-red text-[14px]">
              This field can't be left empty.
            </p>
          )}
        </div>
        <div className="flex">
          <div className="mt-3">
            <FormLabel
              htmlFor={"bloodGlucose"}
              label={"Blood Glucose"}
            ></FormLabel>
            <Input
              name="bloodGlucose"
              id="bloodGlucose"
              type="number"
              style={{ width: "75%", marginTop: "2px", height: "50px" }}
              onChange={formik.handleChange}
              value={formik.values.bloodGlucose.toString()}
              onBlur={formik.handleBlur}
            />
            {/* Check if the field is touched */}
            {formik.touched.bloodGlucose &&
              // Check if the field is empty
              ((!formik.values.bloodGlucose && (
                <p className="text-red text-[14px]">
                  This field can't be left empty or zero.
                </p>
              )) ||
                // Check if the field is less than or equal to zero
                (formik.values.bloodGlucose <= 0 && (
                  <p className="text-red text-[14px]">
                    You can't enter a negative Blood Glucose or a Blood Glucose
                    of zero.
                  </p>
                )))}
          </div>

          <div
            className="mt-3  ml-2"
            style={{
              width: "50%",
              marginLeft: "-2%",
            }}
          >
            <FormLabel htmlFor={"unit"} label={"Unit"}></FormLabel>
            <select
              className="text-darkgrey"
              name="unit"
              id="unit"
              style={{
                width: "100%",
                border: "1px solid #DBE2EA", // Border style
                borderRadius: "5px",
                marginTop: "2px",
                height: "50px",
              }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.unit}
            >
              <option className="text-darkgrey" value="">
                Choose one
              </option>
              <option className="text-darkgrey" value="mg/dL">
                mg/dL
              </option>
              <option className="text-darkgrey" value="mmol/L">
                mmol/L
              </option>
              <option className="text-darkgrey" value="other">
                Other
              </option>
            </select>
            {formik.touched.unit && !formik.values.unit && (
              <p className="text-red text-[14px]">
                This field can't be left empty.
              </p>
            )}
          </div>
        </div>

        <FormInput
          label="Notes"
          onChange={formik.handleChange}
          value={formik.values.notes}
          onBlur={formik.handleBlur}
        ></FormInput>
        <div className="mt-10 pb-4 self-center">
          <div className="mt-5 mb-5 space-x-2">
            <Button
              type="button"
              text="Cancel"
              style={{
                width: "140px",
                backgroundColor: "var(--Red, #FF7171)",
              }}
              onClick={() => router.push("/getDiabeticJournals")}
            />

            <Button
              type="submit"
              text="Submit"
              disabled={
                !(formik.isValid && formik.dirty) || // Check if the form is valid and dirty
                formik.values.bloodGlucose === 0 || // Check if  Blood Glucose is zero
                formik.values.bloodGlucose < 0 || // Check if  Blood Glucose is less than  zero
                !formik.values.unit || // Check if unit is missing or empty
                !formik.values.date || // Check if date is missing or empty
                !formik.values.mealTime // Check if time is missing or empty
              }
              style={{ width: "140px", textAlign: "center" }}
              onClick={() => router.push("/getDiabeticJournals")}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
