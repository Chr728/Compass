"use client";
import FormInput from "@/app/components/FormInput";
import SpanHeader from "@/app/components/SpanHeader";
import { formatDateYearMonthDate } from "@/app/helpers/utils/datetimeformat";
import {
	getO2SaturationJournal,
	updateO2SaturationJournal,
} from "@/app/http/oxygenJournalAPI";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../../../components/Button";
import FormLabel from "../../../components/FormLabel";
import Input from "../../../components/Input";
import { useAuth } from "../../../contexts/AuthContext";
import { useProp } from "../../../contexts/PropContext";

export default function EditOxygenJournal({
	params: { oxygenJournal },
}: {
	params: { oxygenJournal: string };
}) {
	const logger = require("../../../../logger");
	const { user } = useAuth();
	const router = useRouter();
	const [journalEntry, setJournalEntry] = useState<any>(null);
	const { handlePopUp } = useProp();

	async function fetchOxygenJournalEntry() {
		try {
			const result = await getO2SaturationJournal(oxygenJournal);
			logger.info("Oxygen journal entry retrieved:", result);
			setJournalEntry(result.data);
		} catch (error) {
			handlePopUp("error", "Error retrieving oxygen journal entry:");
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
				fetchOxygenJournalEntry();
			}, 1000);
		}
	}, []);

	const formik = useFormik({
		initialValues: {
			date: "",
			time: "",
			o2sat: 0 as any,
			pulse: 0 as any,
			activityLevel: "",
			notes: "",
		},

		onSubmit: async (values) => {
			try {
				const data = {
					date: values.date,
					time: values.time,
					o2sat: values.o2sat,
					pulse: values.pulse,
					activityLevel: values.activityLevel,
					notes: values.notes,
				};
				const result = await updateO2SaturationJournal(
					oxygenJournal,
					data
				).then((result) => {
					router.push(`/getOxygenJournals/${oxygenJournal}`);
				});
				logger.info("oxygen journal entry updated:", result);
			} catch (error) {
				handlePopUp("error", "Error updating oxygen journal entry:");
			}
		},
		validate: (values) => {
			let errors: {
				date?: string;
				time?: string;
				o2sat?: string;
				pulse?: string;
				activityLevel?: string;
				notes?: string;
			} = {};

			if (!values.date) {
				errors.date = "This field can't be left empty.";
			}

			if (!values.time) {
				errors.time = "This field can't be left empty.";
			}

			if (!values.o2sat) {
				errors.o2sat = "This field can't be left empty.";
			}

			if (!values.pulse) {
				errors.pulse = "This field can't be left empty.";
			}

			if (!values.activityLevel) {
				errors.activityLevel = "This field can't be left empty.";
			}

			return errors;
		},
	});

	useEffect(() => {
		const { setValues } = formik;
		setValues({
			date: formatDateYearMonthDate(journalEntry?.date),
			time: journalEntry?.time,
			o2sat: journalEntry?.o2sat,
			pulse: journalEntry?.pulse,
			activityLevel: journalEntry?.activityLevel,
			notes: journalEntry?.notes,
		});
	}, [journalEntry]);

	return (
		<div className="bg-eggshell min-h-screen flex flex-col">
			<SpanHeader
				onClick={() =>
					router.push(`/getOxygenJournals/${oxygenJournal}`)
				}
				headerText="Add an Entry - O2 Saturation"></SpanHeader>
			<form
				className="rounded-3xl bg-white flex flex-col mb-8 w-full md:max-w-[800px] md:min-h-[550px] px-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
				onSubmit={formik.handleSubmit}>
				<div className="mt-3 mb-3">
					<FormLabel htmlFor={"date"} label={"Date"}></FormLabel>
					<Input
						name="date"
						id="date"
						type="date"
						style={{ width: "75%" }}
						value={formik.values.date}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>
					{formik.touched.date && formik.errors.date && (
						<p className="text-[16px] text-red font-sans">
							{formik.errors.date}
						</p>
					)}
				</div>
				<div className="mt-3">
					<FormLabel htmlFor={"time"} label={"Time"}></FormLabel>
					<Input
						name="time"
						id="time"
						type="time"
						value={formik.values.time}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						style={{ width: "75%" }}
					/>
					{formik.touched.time && formik.errors.time && (
						<p className="text-[16px] text-red font-sans">
							{formik.errors.time}
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
						style={{ width: "75%" }}
						value={formik.values.o2sat}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>
					{formik.touched.o2sat && formik.errors.o2sat && (
						<p className="text-[16px] text-red font-sans">
							{formik.errors.o2sat.toString()}
						</p>
					)}
				</div>
				<div className="mt-3">
					<FormLabel
						htmlFor={"pulse"}
						label={"Pulse Rate"}></FormLabel>
					<Input
						name="pulse"
						id="pulse"
						type="number"
						style={{ width: "75%" }}
						value={formik.values.pulse}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>
					{formik.touched.pulse && formik.errors.pulse && (
						<p className="text-[16px] text-red font-sans">
							{formik.errors.pulse.toString()}
						</p>
					)}
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
						formik.errors.activityLevel && (
							<p className="text-[16px] text-red font-sans">
								{formik.errors.activityLevel.toString()}
							</p>
						)}
				</div>
				<FormInput
					label="Notes"
					onChange={formik.handleChange}
					value={formik.values.notes}
					onBlur={formik.handleBlur}></FormInput>
				<div className="mt-2 pb-4 self-center">
					<div className="mt-5 mb-14 space-x-2">
						<Button
							type="button"
							text="Cancel"
							style={{
								width: "140px",
								backgroundColor: "var(--Red, #FF7171)",
							}}
							onClick={() =>
								router.push(
									`/getOxygenJournals/${oxygenJournal}`
								)
							}
						/>
						<Button
							type="submit"
							text="Submit"
							style={{ width: "140px", textAlign: "center" }}
							onClick={() => router.push("/getOxygenJournals")}
						/>
					</div>
				</div>
			</form>
		</div>
	);
}
