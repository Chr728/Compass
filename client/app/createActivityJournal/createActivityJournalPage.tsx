"use client";
import FormLabel from "@/app/components/FormLabel";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import Header from "../components/Header";
import Input from "../components/Input";
import { useProp } from "../contexts/PropContext";
import { createActivityJournal } from "../http/activityJournalAPI";

export default function CreateActivityJournalPage() {
	const logger = require("../../logger");
	const router = useRouter();
	const { handlePopUp } = useProp();

	const formik = useFormik({
		initialValues: {
			date: "",
			time: "",
			activity: "",
			duration: 0,
			notes: "",
		},

		onSubmit: async (values) => {
			try {
				const data = {
					date: values.date,
					time: values.time,
					activity: values.activity,
					duration: values.duration,
					notes: values.notes,
				};
				// const result = await createActivityJournal(data)
				// .then(result => {
				//   router.push('/getActivityJournals');
				// })
				const result = await createActivityJournal(data);
				router.push("/getActivityJournals");
			} catch (error) {
				handlePopUp("error", "Error creating activity journal entry:");
			}
		},
	});

	return (
		<div className="bg-eggshell min-h-screen flex flex-col">
			<span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
				<button onClick={() => router.push("/getActivityJournals")}>
					<Header headerText="Create Activity Journal"></Header>
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
							htmlFor={"activity"}
							label={"Activity"}></FormLabel>
						<Input
							name="activity"
							id="activity"
							type="text"
							style={{ width: "100%" }}
							onChange={formik.handleChange}
							value={formik.values.activity}
							onBlur={formik.handleBlur}
						/>
						{/* Check if the field is touched */}
						{formik.touched.activity &&
							// Check if the field is empty
							!formik.values.activity && (
								<p className="text-red text-[14px]">
									This field can't be left empty.
								</p>
							)}
					</div>
				</div>
				<div className="mt-3">
					<FormLabel
						htmlFor={"duration"}
						label={"Duration (in minutes)"}></FormLabel>
					<Input
						name="duration"
						id="duration"
						type="number"
						style={{ width: "100%" }}
						onChange={formik.handleChange}
						value={formik.values.duration.toString()}
						onBlur={formik.handleBlur}
					/>
					{/* Check if the field is touched */}
					{formik.touched.duration &&
						// Check if the field is empty
						((!formik.values.duration && (
							<p className="text-red text-[14px]">
								This field can't be left empty or zero.
							</p>
						)) ||
							// Check if the field is less than or equal to zero
							(formik.values.duration <= 0 && (
								<p className="text-red text-[14px]">
									You can't enter a negative duration or a
									duration of zero.
								</p>
							)))}
				</div>
				<div className="mt-3">
					<label
						htmlFor="notes"
						className="font-sans font-medium text-grey text-[16px]">
						Notes
					</label>
					<br />
					<textarea
						name="notes"
						id="notes"
						className="w-full border border-solid border-lightgrey text-darkgrey rounded-md shadow-[0_4px_8px_0_rgba(44,39,56,0.04)]"
						rows={4}
						onChange={formik.handleChange}
						value={formik.values.notes}
						onBlur={formik.handleBlur}
					/>
				</div>

				<div className="mt-10 pb-4 self-center">
					<div className="mt-5 mb-5 space-x-2">
						<Button
							type="button"
							text="Cancel"
							style={{
								width: "140px",
								backgroundColor: "var(--Red, #FF7171)",
							}}
							onClick={() => router.push("/getActivityJournals")}
						/>

						<Button
							type="submit"
							text="Submit"
							disabled={
								!(formik.isValid && formik.dirty) || // Check if the form is valid and dirty
								formik.values.duration === 0 || // Check if duration is zero
								formik.values.duration < 0 || // Check if duration is less than zero
								!formik.values.date || // Check if date is missing or empty
								!formik.values.time || // Check if time is missing or empty
								!formik.values.activity || // Check if activity is missing or empty
								!formik.values.duration // Check if duration is missing or empty
							}
							style={{ width: "140px" }}
							onClick={() => router.push("/getActivityJournals")}
						/>
					</div>
				</div>
			</form>
		</div>
	);
}
