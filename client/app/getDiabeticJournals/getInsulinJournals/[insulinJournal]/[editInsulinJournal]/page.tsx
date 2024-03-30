"use client";
import FormInput from "@/app/components/FormInput";
import FormLabel from "@/app/components/FormLabel";
import Header from "@/app/components/Header";
import { formatDateYearMonthDate } from "@/app/helpers/utils/datetimeformat";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import { useAuth } from "../../../../contexts/AuthContext";
import { useProp } from "../../../../contexts/PropContext";
import {
	getInsulinJournal,
	updateInsulinJournal,
} from "../../../../http/diabeticJournalAPI";

export default function EditInsulinJournal({
	params: { insulinJournal },
}: {
	params: { insulinJournal: string };
}) {
	const logger = require("../../../../../logger");
	const { user } = useAuth();
	const router = useRouter();
	const [insulin, setinsulin] = useState<any>(null);
	const { handlePopUp } = useProp();

	async function fetchInsulinJournal() {
		try {
			const result = await getInsulinJournal(insulinJournal);
			logger.info("Insulin journal entry retrieved:", result);
			setinsulin(result.data);
		} catch (error) {
			handlePopUp("error", "Error retrieving Insulin journal entry:");
		}
	}

	useEffect(() => {
		if (!user) {
			router.push("/login");
			logger.warn("User not found.");
			alert("User not found.");
		}
		if (user) {
			setTimeout(() => {
				fetchInsulinJournal();
			}, 1000);
		}
	}, []);

	// if (!user) {
	//   return <div><Custom403/></div>
	// }

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const formik = useFormik({
		initialValues: {
			date: "",
			time: "",
			typeOfInsulin: "",
			unit: 0 as any,
			bodySite: "",
			notes: "",
		},

		onSubmit: async (values) => {
			try {
				const userId = user?.uid || "";
				const data = {
					date: values.date,
					time: values.time,
					typeOfInsulin: values.typeOfInsulin,
					unit: values.unit,
					bodySite: values.bodySite,
					notes: values.notes,
				};
				const result = await updateInsulinJournal(
					insulinJournal,
					data
				).then((result) => {
					router.push(
						`/getDiabeticJournals/getInsulinJournals/${insulinJournal}`
					);
				});
				logger.info("Insulin journal entry updated:", result);
			} catch (error) {
				handlePopUp("error", "Error updating Insulin journal entry:");
			}
		},
	});

	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(() => {
		const { setValues } = formik;
		setValues({
			date: formatDateYearMonthDate(insulin?.date),
			time: insulin?.time,
			typeOfInsulin: insulin?.typeOfInsulin,
			unit: insulin?.unit,
			bodySite: insulin?.bodySite,
			notes: insulin?.notes,
		});
	}, [insulin]);

	return (
		<div className="bg-eggshell min-h-screen flex flex-col">
			{/* <SpanHeader
				onClick={() =>
					router.push(
						`getDiabeticJournals/getInsulinJournals/${insulinJournal}`
					)
				}
				headerText="Edit The Insulin Dosage "></SpanHeader> */}
			<span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
				<button
					onClick={() =>
						router.push(
							`/getDiabeticJournals/getInsulinJournals/${insulinJournal}`
						)
					}>
					<Header headerText="Edit The Insulin Dosage"></Header>
				</button>
			</span>
			<form
				className="rounded-3xl bg-white flex flex-col mb-8 w-full md:max-w-[800px] md:min-h-[550px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
				onSubmit={formik.handleSubmit}>
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
					<FormLabel htmlFor={"time"} label={"Time"}></FormLabel>
					<Input
						name="time"
						id="time"
						type="time"
						style={{ width: "100%" }}
						onChange={formik.handleChange}
						value={formik.values.time}
						onBlur={formik.handleBlur}
					/>
					{formik.touched.time && !formik.values.time && (
						<p className="text-red text-[14px]">
							This field can't be left empty.
						</p>
					)}
				</div>

				<div className="flex">
					<div className="mt-3">
						<FormLabel
							htmlFor={"typeOfInsulin"}
							label={"Type of Insulin"}></FormLabel>
						<select
							className="text-darkgrey"
							name="typeOfInsulin"
							id="typeOfInsulin"
							style={{
								width: "310px",
								border: "1px solid #DBE2EA", // Border style
								borderRadius: "5px",
								marginTop: "5px",
							}}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.typeOfInsulin}>
							<option className="text-darkgrey" value="">
								Choose one
							</option>
							<option
								className="text-darkgrey"
								value="Apidra (Insulin glulisine)">
								Apidra (Insulin glulisine)
							</option>
							<option
								className="text-darkgrey"
								value="Fiasp (Insulin aspart)">
								Fiasp (Insulin aspart)
							</option>
							<option
								className="text-darkgrey"
								value="Humalog (Insulin lispro)">
								Humalog (Insulin lispro)
							</option>
							<option
								className="text-darkgrey"
								value="NovoRapid (Insulin aspart)">
								NovoRapid (Insulin aspart)
							</option>
							<option
								className="text-darkgrey"
								value="Entuzity (Insulin regular)">
								Entuzity (Insulin regular)
							</option>
							<option
								className="text-darkgrey"
								value="Humulin R (Insulin regular)">
								Humulin R (Insulin regular)
							</option>
							<option
								className="text-darkgrey"
								value="Humulin N (Insulin NPH)">
								Humulin N (Insulin NPH)
							</option>
							<option
								className="text-darkgrey"
								value="Basaglar (Insulin glargine)">
								Basaglar (Insulin glargine)
							</option>
							<option
								className="text-darkgrey"
								value="Lantus (Insulin glargine U-100)">
								Lantus (Insulin glargine U-100)
							</option>
							<option
								className="text-darkgrey"
								value="Lantus (Insulin glargine U-100)">
								Lantus (Insulin glargine U-100)
							</option>
							<option
								className="text-darkgrey"
								value="Levemir (Insulin detemir)">
								Levemir (Insulin detemir)
							</option>
							<option
								className="text-darkgrey"
								value="Toujeo (Insulin glargine U-300)">
								Toujeo (Insulin glargine U-300)
							</option>
							<option
								className="text-darkgrey"
								value="Tresiba (Degludec)">
								Tresiba (Degludec)
							</option>
							<option className="text-darkgrey" value="Other">
								Other
							</option>
						</select>
						{/* Check if the field is touched */}
						{formik.touched.typeOfInsulin &&
							// Check if the field is empty
							!formik.values.typeOfInsulin && (
								<p className="text-red text-[14px]">
									This field can't be left empty.
								</p>
							)}
					</div>
				</div>

				<div className="mt-3">
					<FormLabel
						htmlFor={"unit"}
						label={"Units Given"}></FormLabel>
					<Input
						name="unit"
						id="unit"
						type="number"
						style={{ width: "100%" }}
						onChange={formik.handleChange}
						value={formik.values.unit}
						onBlur={formik.handleBlur}
					/>

					{/* Check if the field is touched */}
					{formik.touched.unit &&
						// Check if the field is empty
						((!formik.values.unit && (
							<p className="text-red text-[14px]">
								This field can't be left empty or zero.
							</p>
						)) ||
							// Check if the field is less than or equal to zero
							(formik.values.unit <= 0 && (
								<p className="text-red text-[14px]">
									You can't enter a negative unit or a unit of
									zero.
								</p>
							)))}
				</div>

				<div className="flex">
					<div className="mt-3">
						<FormLabel
							htmlFor={"bodySite"}
							label={"Body Site"}></FormLabel>
						<select
							className="text-darkgrey"
							name="bodySite"
							id="bodySite"
							style={{
								width: "310px",
								border: "1px solid #DBE2EA", // Border style
								borderRadius: "5px",
								marginTop: "5px",
							}}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.bodySite}>
							<option className="text-darkgrey" value="">
								Choose one
							</option>
							<option
								className="text-darkgrey"
								value="Upper Abdomen (left)">
								Upper Abdomen (left)
							</option>
							<option
								className="text-darkgrey"
								value="Upper Abdomen (right)">
								Upper Abdomen (right)
							</option>
							<option
								className="text-darkgrey"
								value="Lower Abdomen (left)">
								Lower Abdomen (left)
							</option>
							<option
								className="text-darkgrey"
								value="Lower Abdomen (right)">
								Lower Abdomen (right)
							</option>
							<option
								className="text-darkgrey"
								value="Back of Upper Arm (left)">
								Back of Upper Arm (left)
							</option>
							<option
								className="text-darkgrey"
								value="Back of Upper Arm (right)">
								Back of Upper Arm (right)
							</option>
							<option
								className="text-darkgrey"
								value="Lower Back (left)">
								Lower Back (left)
							</option>
							<option
								className="text-darkgrey"
								value="Lower Back (right)">
								Lower Back (right)
							</option>
							<option
								className="text-darkgrey"
								value="Buttocks (left)">
								Buttocks (left)
							</option>
							<option
								className="text-darkgrey"
								value="Buttocks (right)">
								Buttocks (right)
							</option>
							<option
								className="text-darkgrey"
								value="Front of Thigh (left)">
								Front of Thigh (left)
							</option>
							<option
								className="text-darkgrey"
								value="Front of Thigh (right)">
								Front of Thigh (right)
							</option>
							<option
								className="text-darkgrey"
								value="Side of Thigh (left)">
								Side of Thigh (left)
							</option>
							<option
								className="text-darkgrey"
								value="Side of Thigh (right)">
								Side of Thigh (right)
							</option>
							<option className="text-darkgrey" value="other">
								other
							</option>
						</select>
						{/* Check if the field is touched */}
						{formik.touched.bodySite &&
							// Check if the field is empty
							!formik.values.bodySite && (
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
					onBlur={formik.handleBlur}></FormInput>

				<div className="mt-10 pb-4 self-center">
					<div className="mt-5 mb-5 space-x-2">
						<Button
							type="button"
							text="Cancel"
							style={{
								width: "140px",
								backgroundColor: "var(--Red, #FF7171)",
							}}
							onClick={() =>
								router.push(
									`/getDiabeticJournals/getInsulinJournals/${insulinJournal}`
								)
							}
						/>

						<Button
							type="submit"
							text="Submit"
							disabled={
								!(formik.isValid && formik.dirty) || // Check if the form is valid and dirty
								formik.values.unit === 0 || // Check if unit is zero
								formik.values.unit < 0 || // Check if unit is less than zero
								!formik.values.date || // Check if date is missing or empty
								!formik.values.time || // Check if time is missing or empty
								!formik.values.bodySite || // Check if body site is missing or empty
								!formik.values.typeOfInsulin // Check if typeOfInsulin is missing or empty
							}
							style={{ width: "140px" }}
							onClick={() =>
								router.push(
									`/getDiabeticJournals/getInsulinJournals/${insulinJournal}`
								)
							}
						/>
					</div>
				</div>
			</form>
		</div>
	);
}
