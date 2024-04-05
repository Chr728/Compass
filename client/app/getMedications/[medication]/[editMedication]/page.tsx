"use client";
import Button from "@/app/components/Button";
import FormInput from "@/app/components/FormInput";
import FormLabel from "@/app/components/FormLabel";
import Input from "@/app/components/Input";
import SpanHeader from "@/app/components/SpanHeader";
import { useAuth } from "@/app/contexts/AuthContext";
import { formatDateYearMonthDate } from "@/app/helpers/utils/datetimeformat";
import { getMedication, updateMedication } from "@/app/http/medicationAPI";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useProp } from "../../../contexts/PropContext";

export default function EditMedication({
  params: { medication },
}: {
  params: { medication: string };
}) {
  const logger = require("../../../../logger");
  const router = useRouter();
  const { user } = useAuth();
  const [data, setData] = useState<any>();
  const { handlePopUp } = useProp();

  async function editMedication() {
    try {
      const medicationData = await getMedication(medication);
      setData(medicationData.data);
    } catch (error) {
      logger.error("Error fetching medication data:", error);
      // handlePopUp('error', "Error fetching medication data");
    }
  }

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }

    if (user) {
      editMedication();
    }
  }, [user]);

  const formik = useFormik({
    initialValues: {
      name: "",
      date: "",
      expirationDate: "",
      time: "",
      dosage: "",
      unit: "",
      frequency: "",
      route: "",
      notes: "",
    },
    onSubmit: async (values) => {
      try {
        const medicationData = {
          medicationName: values.name,
          dateStarted: values.date,
          expirationDate: values.expirationDate,
          time: values.time,
          dosage: values.dosage,
          unit: values.unit,
          frequency: values.frequency,
          route: values.route,
          notes: values.notes,
        };
        const result = await updateMedication(medication, medicationData).then(
          (result) => {
            logger.info("Medication entry created:", result);
            router.push(`/getMedications/${medication}`);
          }
        );
      } catch (error) {
        handlePopUp("error", "Error editing medication entry:");
      }
    },
    validate: async (values) => {
      let errors: {
        name?: string;
        date?: string;
        expirationDate?: string;
        time?: string;
        dosage?: string;
        unit?: string;
        frequency?: string;
        route?: string;
        notes?: string;
      } = {};

      if (!values.name) {
        errors.name = "This field cannot be left empty.";
      }
      if (!values.date) {
        errors.date = "This field cannot be left empty.";
      }
      if (!values.expirationDate) {
        errors.expirationDate = "This field cannot be left empty.";
      }
      if (!values.time) {
        errors.time = "This field cannot be left empty.";
      }

      if (parseFloat(values.dosage) <= 0) {
        errors.dosage = "This field cannot be negative or zero.";
      } else if (!values.dosage) {
        errors.dosage = "This field cannot be left empty.";
      }

      if (!values.unit) {
        errors.unit = "This field cannot be left empty.";
      }

      if (!values.frequency) {
        errors.frequency = "This field cannot be left empty.";
      }

      if (!values.route) {
        errors.route = "This field cannot be left empty.";
      }

      return errors;
    },
  });

  useEffect(() => {
    const { setValues } = formik;
    setValues({
      name: data?.medicationName,
      date: formatDateYearMonthDate(data?.dateStarted),
      expirationDate: formatDateYearMonthDate(data?.expirationDate),
      time: data?.time,
      dosage: data?.dosage,
      unit: data?.unit,
      frequency: data?.frequency,
      route: data?.route,
      notes: data?.notes,
    });
  }, [data]);

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
      <SpanHeader
        onClick={() => router.push("/getDiabeticJournals")}
        headerText="Edit Medication"
      ></SpanHeader>
      <form
        className="rounded-3xl bg-white flex flex-col mb-8 w-full md:max-w-[800px] md:min-h-[550px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
        onSubmit={formik.handleSubmit}
      >
        <div className="self-end -mt-4">
          <p className="text-red text-[20px]">
            {" "}
            *
            <span className="font-sans font-medium text-grey text-[16px]">
              {" "}
              indicates a required field
            </span>
          </p>
        </div>
        <div className="mt-3">
          <FormLabel htmlFor={"name"} label={"Medication Name"}></FormLabel>
          <Input
            name="name"
            id="name"
            type="text"
            style={{ width: "100%" }}
            onChange={formik.handleChange}
            value={formik.values.name}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red text-[14px]">{formik.errors.name}</p>
          )}
        </div>

        <div className="mt-3 mb-3">
          <FormLabel htmlFor={"date"} label={"Date Started"}></FormLabel>
          <div className="">
            <Input
              name="date"
              id="date"
              type="date"
              style={{ width: "100%" }}
              onChange={formik.handleChange}
              value={formik.values.date}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.date && formik.errors.date && (
            <p className="text-red text-[14px]">{formik.errors.date}</p>
          )}
        </div>

        <div className="mt-3 mb-3">
          <FormLabel htmlFor={"date"} label={"Expiration Date"}></FormLabel>
          <div className="">
            <Input
              name="expirationDate"
              id="expirationDate"
              type="date"
              style={{ width: "100%" }}
              onChange={formik.handleChange}
              value={formik.values.expirationDate}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.expirationDate && formik.errors.expirationDate && (
            <p className="text-red text-[14px]">
              {formik.errors.expirationDate}
            </p>
          )}
        </div>

        <div className="mt-3 mb-3">
          <FormLabel htmlFor={"time"} label={"Time"}></FormLabel>
          <div className="">
            <Input
              name="time"
              id="time"
              type="time"
              style={{ width: "100%" }}
              onChange={formik.handleChange}
              value={formik.values.time}
              onBlur={formik.handleBlur}
            />
            {formik.touched.time && formik.errors.time && (
              <p className="text-red text-[14px]">{formik.errors.time}</p>
            )}
          </div>
        </div>

        <div className="flex">
          <div className="mt-3">
            <FormLabel htmlFor={"dosage"} label={"Dosage"}></FormLabel>
            <Input
              name="dosage"
              id="dosage"
              type="number"
              style={{ width: "75%" }}
              onChange={formik.handleChange}
              value={formik.values.dosage}
              onBlur={formik.handleBlur}
            />
            {formik.touched.dosage && formik.errors.dosage && (
              <p className="text-red text-[14px] mr-2">
                {formik.errors.dosage}
              </p>
            )}
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
              className="text-darkgrey h-[52px] p-2"
              name="unit"
              id="unit"
              style={{
                width: "100%",
                border: "1px solid #DBE2EA",
                borderRadius: "5px",
              }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.unit}
            >
              <option value="">Choose one</option>
              <option value="drop (gtts)">drop (gtts)</option>
              <option value="teaspoon (tsp)">teaspoon (tsp)</option>
              <option value="tablespoon (tbsp)">tablespoon (tbsp)</option>
              <option value="millilitre (mL)">millilitre (mL)</option>
              <option value="fluid ounce (fl oz)">fluid ounce (fl oz)</option>
              <option value="microgram (mcg)">microgram (mcg)</option>
              <option value="milligram (mg)">milligram (mg)</option>
              <option value="gram (g)">gram (g)</option>
              <option value="ounce (oz)">ounce (oz)</option>
              <option value="Other">Other</option>
            </select>
            {formik.touched.unit && formik.errors.unit && (
              <p className="text-red text-[14px]">{formik.errors.unit}</p>
            )}
          </div>
        </div>

        <div className="mt-3">
          <FormLabel htmlFor={"frequency"} label={"Frequency"}></FormLabel>
          <select
            name="frequency"
            id="frequency"
            onChange={formik.handleChange}
            value={formik.values.frequency}
            onBlur={formik.handleBlur}
            className="p-2 w-full h-[52px] border border-solid border-lightgrey rounded-md text-grey focus:outline-blue shadow-[0_4px_8px_0_rgba(44,39,56,0.04)]"
          >
            <option value="">Choose one</option>
            <option value="Once a day (morning)">Once a day (morning)</option>
            <option value="Once a day (evening)">Once a day (evening)</option>
            <option value="Twice a day">Twice a day</option>
            <option value="Three times a day">Three times a day</option>
            <option value="Four times a day">Four times a day</option>
            <option value="Five times a day">Five times a day</option>
            <option value="Six times a day">Six times a day</option>
            <option value="Every 30 minutes">Every 30 minutes</option>
            <option value="Every 1 hour">Every 1 hour</option>
            <option value="Every 2 hours">Every 2 hours</option>
            <option value="Every 4 hours">Every 4 hours</option>
            <option value="Every 6 hours">Every 6 hours</option>
            <option value="Every 8 hours">Every 8 hours</option>
            <option value="Before meals">Before meals</option>
            <option value="After meals">After meals</option>
            <option value="Before bedtime">Before bedtime</option>
            <option value="As needed (PRN)">As needed (PRN)</option>
            <option value="Other">Other</option>
          </select>
          {formik.touched.frequency && formik.errors.frequency && (
            <p className="text-red text-[14px]">{formik.errors.frequency}</p>
          )}
        </div>

        <div className="mt-3">
          <FormLabel htmlFor={"route"} label={"Route"}></FormLabel>
          <select
            name="route"
            id="route"
            onChange={formik.handleChange}
            value={formik.values.route}
            onBlur={formik.handleBlur}
            className="p-2 w-full h-[52px] border border-solid border-lightgrey rounded-md text-grey focus:outline-blue shadow-[0_4px_8px_0_rgba(44,39,56,0.04)]"
          >
            <option value="">Choose one</option>
            <option value="Oral">Oral</option>
            <option value="Sublingual">Sublingual</option>
            <option value="Enteral">Enteral</option>
            <option value="Rectal">Rectal</option>
            <option value="Inhalation">Inhalation</option>
            <option value="Intramuscular">Intramuscular</option>
            <option value="Subcutaneous">Subcutaneous</option>
            <option value="Transdermal">Transdermal</option>
            <option value="Topical">Topical</option>
            <option value="Other">Other</option>
          </select>
          {formik.touched.route && formik.errors.route && (
            <p className="text-red text-[14px]">{formik.errors.route}</p>
          )}
        </div>

        <FormInput
          label="Notes"
          onChange={formik.handleChange}
          value={formik.values.notes}
          onBlur={formik.handleBlur}
        ></FormInput>

        <div className="mx-auto space-x-2 mb-8">
          <Button
            type="button"
            text="Cancel"
            style={{
              width: "140px",
              backgroundColor: "var(--Red, #FF7171)",
            }}
            onClick={() => router.push("/medication")}
          />
          <Button
            type="submit"
            text="Submit"
            style={{ width: "140px" }}
            onClick={() => router.push(`/getMedications/${medication}`)}
          />
        </div>
      </form>
    </div>
  );
}
