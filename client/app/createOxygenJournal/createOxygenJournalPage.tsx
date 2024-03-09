"use client";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import FormLabel from "../components/FormLabel";
import Header from "../components/Header";
import Input from "../components/Input";
import { useAuth } from "../contexts/AuthContext";
import { useProp } from "../contexts/PropContext";
import { createO2SaturationJournal } from "../http/oxygenJournalAPI";

export default function CreateOxygenJournalPage() {
	const logger = require("../../logger");
	const router = useRouter();
	const { user } = useAuth();
	const { handlePopUp } = useProp();

	const formik = useFormik({
		initialValues: {
			date: "", // Initialize the form fields with empty values
			time: "",
			o2sat: 0.0,
			pulse: 0.0,
			activityLevel: "",
			notes: "",
		},

		onSubmit: async (values) => {
			try {
				const userId = user?.uid || "";

				const data = {
					date: values.date,
					time: values.time,
					o2sat: values.o2sat,
					pulse: values.pulse,
					activityLevel: values.activityLevel,
					notes: values.notes,
				};
				const result = await createO2SaturationJournal(data).then(
					(result) => {
						console.log("Christinas", data.time);
						router.push("/getOxygenJournals");
					}
				);
				logger.info("Oxygen journal entry created:", result);
			} catch (error) {
				handlePopUp("error", "Error creating Oxygen journal entry:");
			}
		},
	});

	return (
		<div className="bg-eggshell min-h-screen flex flex-col">
			<span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
				<button onClick={() => router.push("/getOxygenJournals")}>
					<Header headerText="Add an Entry - O2 Saturation"></Header>
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
					)}
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

				<div className="mt-3">
					<FormLabel
						htmlFor={"o2sat"}
						label={"Oxygen Saturation"}></FormLabel>
					<Input
						name="o2sat"
						id="o2sat"
						type="number"
						style={{ width: "100%" }}
						onChange={formik.handleChange}
						value={formik.values.o2sat.toString()}
						onBlur={formik.handleBlur}
					/>
					{/* Check if the field is touched */}
					{formik.touched.o2sat &&
						// Check if the field is empty
						((!formik.values.o2sat && (
							<p className="text-red text-[14px]">
								This field can't be left empty or zero.
							</p>
						)) ||
							// Check if the field is less than or equal to zero
							(formik.values.o2sat <= 0 && (
								<p className="text-red text-[14px]">
									You can't enter a negative Oxygen Saturation
									level or a level of Saturation of zero.
								</p>
							)))}
				</div>

				<div className="mt-3">
					<FormLabel
						htmlFor={"pulse"}
						label={"Pulse Rate"}></FormLabel>
					<Input
						name="pulse"
						id="pulse"
						type="number"
						style={{ width: "100%" }}
						onChange={formik.handleChange}
						value={formik.values.pulse.toString()}
						onBlur={formik.handleBlur}
					/>
					{/* Check if the field is touched */}
					{formik.touched.pulse &&
						// Check if the field is empty
						((!formik.values.pulse && (
							<p className="text-red text-[14px]">
								This field can't be left empty or zero.
							</p>
						)) ||
							// Check if the field is less than or equal to zero
							(formik.values.pulse <= 0 && (
								<p className="text-red text-[14px]">
									You can't enter a negative pulse or a pulse
									of zero.
								</p>
							)))}
				</div>

				<div className="mt-3">
					<FormLabel
						htmlFor={"activityLevel"}
						label={"Activity Level"}></FormLabel>
					<select
						name="activityLevel"
						id="activityLevel"
						onChange={formik.handleChange}
						value={formik.values.activityLevel}
						onBlur={formik.handleBlur}
						className="p-2 w-full h-[52px] border border-solid border-lightgrey rounded-md text-grey focus:outline-blue shadow-[0_4px_8px_0_rgba(44,39,56,0.04)]">
						<option value="">Choose one</option>
						<option value="At rest">At rest</option>
						<option value="Light">Light</option>
						<option value="Moderate">Moderate</option>
						<option value="Heavy">Heavy</option>
					</select>
					{formik.touched.activityLevel &&
						!formik.values.activityLevel && (
							<p className="text-red text-[14px]">
								This field can't be left empty.
							</p>
						)}
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
							onClick={() => router.push("/getOxygenJournals")}
						/>

						<Button
							type="submit"
							text="Submit"
							disabled={
								!(formik.isValid && formik.dirty) || // Check if the form is valid and dirty
								formik.values.o2sat === 0 || // Check if o2sat is zero
								formik.values.o2sat < 0 || // Check if o2sat is less than  zero
								formik.values.pulse === 0 || // Check if pulse is zero
								formik.values.pulse < 0 || // Check if pulse is less than zero
								!formik.values.activityLevel || // Check if activityLevel is missing or empty
								!formik.values.date || // Check if date is missing or empty
								!formik.values.time || // Check if time is missing or empty
								!formik.values.o2sat || // Check if o2sat is missing or empty
								!formik.values.pulse // Check if pulse is missing or empty
							}
							style={{ width: "140px", textAlign: "center" }}
							onClick={() => router.push("/getOxygenJournals")}
						/>
					</div>
				</div>
			</form>
		</div>
	);
}
