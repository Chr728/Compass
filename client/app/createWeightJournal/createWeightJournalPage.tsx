"use client";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import FormLabel from "../components/FormLabel";
import Input from "../components/Input";
import SpanHeader from "../components/SpanHeader";
import { useAuth } from "../contexts/AuthContext";
import { useProp } from "../contexts/PropContext";
import { createWeightJournal } from "../http/weightJournalAPI";

export default function CreateWeightJournalPage() {
	const logger = require("../../logger");
	const router = useRouter();
	const { user } = useAuth();
	const { handlePopUp } = useProp();

	const formik = useFormik({
		initialValues: {
			date: "", // Initialize the form fields with empty values
			time: "",
			weight: 0.0,
			height: 0.0,
			unit: "",
			notes: "",
		},

		onSubmit: async (values) => {
			try {
				const userId = user?.uid || "";

				const data = {
					date: values.date,
					time: values.time,
					weight: values.weight,
					height: values.height,
					unit: values.unit,
					notes: values.notes,
				};
				const result = await createWeightJournal(data).then(
					(result) => {
						router.push("/getWeightJournals");
					}
				);
				logger.info("Weight journal entry created:", result);
			} catch (error) {
				handlePopUp("error", "Error creating weight journal entry:");
			}
		},
	});

	return (
		<div className="bg-eggshell min-h-screen flex flex-col">
			<SpanHeader
				onClick={() => router.push("/getWeightJournals")}
				headerText="Create Weight Journal"></SpanHeader>
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
							htmlFor={"weight"}
							label={"Weight"}></FormLabel>
						<Input
							name="weight"
							id="weight"
							type="number"
							style={{ width: "75%" }}
							onChange={formik.handleChange}
							value={formik.values.weight.toString()}
							onBlur={formik.handleBlur}
						/>
						{/* Check if the field is touched */}
						{formik.touched.weight &&
							// Check if the field is empty
							((!formik.values.weight && (
								<p className="text-red text-[14px]">
									This field can't be left empty or zero.
								</p>
							)) ||
								// Check if the field is less than or equal to zero
								(formik.values.weight <= 0 && (
									<p className="text-red text-[14px]">
										You can't enter a negative weight or a
										weight of zero.
									</p>
								)))}
					</div>

					<div
						className="mt-3"
						style={{
							width: "50%",
						}}>
						<FormLabel htmlFor={"unit"} label={"Unit"}></FormLabel>
						<select
							className="text-darkgrey"
							name="unit"
							id="unit"
							style={{
								width: "100%",
								height: "50px",
								border: "1px solid #DBE2EA", // Border style
								borderRadius: "5px",
								marginTop: "2px",
							}}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.unit}>
							<option className="text-darkgrey" value="">
								Choose one
							</option>
							<option className="text-darkgrey" value="kg">
								kg
							</option>
							<option className="text-darkgrey" value="lb">
								lb
							</option>
						</select>
						{formik.touched.unit && !formik.values.unit && (
							<p className="text-red text-[14px]">
								This field can't be left empty.
							</p>
						)}
					</div>
				</div>

				<div className="mt-3">
					<FormLabel
						htmlFor={"height"}
						label={"Height (in centimeters)"}></FormLabel>
					<Input
						name="height"
						id="height"
						type="number"
						style={{ width: "100%" }}
						onChange={formik.handleChange}
						value={formik.values.height.toString()}
						onBlur={formik.handleBlur}
					/>

					{/* Check if the field is touched */}
					{formik.touched.height &&
						// Check if the field is empty
						((!formik.values.height && (
							<p className="text-red text-[14px]">
								This field can't be left empty or zero.
							</p>
						)) ||
							// Check if the field is less than or equal to zero
							(formik.values.height <= 0 && (
								<p className="text-red text-[14px]">
									You can't enter a negative height or a
									height of zero.
								</p>
							)))}
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
							onClick={() => router.push("/getWeightJournals")}
						/>

						<Button
							type="submit"
							text="Submit"
							disabled={
								!(formik.isValid && formik.dirty) || // Check if the form is valid and dirty
								formik.values.weight === 0 || // Check if weight is zero
								formik.values.weight < 0 || // Check if weight is less than  zero
								formik.values.height === 0 || // Check if height is zero
								formik.values.height < 0 || // Check if height is less than zero
								!formik.values.unit || // Check if unit is missing or empty
								!formik.values.date || // Check if date is missing or empty
								!formik.values.time || // Check if time is missing or empty
								!formik.values.weight || // Check if weight is missing or empty
								!formik.values.height // Check if height is missing or empty
							}
							style={{ width: "140px", textAlign: "center" }}
							onClick={() => router.push("/getWeightJournals")}
						/>
					</div>
				</div>
			</form>
		</div>
	);
}
