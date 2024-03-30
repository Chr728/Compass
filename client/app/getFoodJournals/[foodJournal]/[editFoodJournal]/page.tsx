"use client";
import FormInput from "@/app/components/FormInput";
import FormLabel from "@/app/components/FormLabel";
import Header from "@/app/components/Header";
import { formatDateYearMonthDate } from "@/app/helpers/utils/datetimeformat";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { useAuth } from "../../../contexts/AuthContext";
import { useProp } from "../../../contexts/PropContext";
import { useUser } from "../../../contexts/UserContext";
import {
	getFoodIntakeJournal,
	updateFoodIntakeJournal,
} from "../../../http/foodJournalAPI";

export default function EditFoodJournal({
	params: { foodJournal },
}: {
	params: { foodJournal: string };
}) {
	const logger = require("../../../../logger");
	const { user } = useAuth();
	const router = useRouter();
	const [food, setfood] = useState<any>(null);
	const { userInfo } = useUser();
	const { handlePopUp } = useProp();

	async function fetchFoodJournal() {
		try {
			const userId = user?.uid || "";
			const result = await getFoodIntakeJournal(foodJournal);
			logger.info("Food journal entry retrieved:", result);
			setfood(result.data);
		} catch (error) {
			handlePopUp("error", "Error retrieving Food journal entry:");
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
				fetchFoodJournal();
			}, 1000);
		}
	}, []);

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const formik = useFormik({
		initialValues: {
			date: "",
			time: "",
			foodName: "",
			mealType: "",
			servingNumber: 0.0 as any,
			calorie: 0.0 as any,
			notes: "",
		},

		onSubmit: async (values) => {
			try {
				const userId = user?.uid || "";
				const data = {
					date: values.date,
					time: values.time,
					foodName: values.foodName,
					mealType: values.mealType,
					servingNumber: values.servingNumber,
					calorie: values.calorie,
					notes: values.notes,
				};
				const result = await updateFoodIntakeJournal(
					foodJournal,
					data
				).then((result) => {
					router.push(`/getFoodJournals/${foodJournal}`);
				});
				logger.info("Food journal entry updated:", result);
			} catch (error) {
				handlePopUp("error", "Error updating Food journal entry:");
			}
		},
	});

	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(() => {
		const { setValues } = formik;
		setValues({
			date: formatDateYearMonthDate(food?.date),
			time: food?.time,
			foodName: food?.foodName,
			mealType: food?.mealType,
			servingNumber: food?.servingNumber,
			calorie: food?.calorie,
			notes: food?.notes,
		});
	}, [food]);

	return (
		<div className="bg-eggshell min-h-screen flex flex-col">
			<span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
				<button
					onClick={() =>
						router.push(`/getFoodJournals/${foodJournal}`)
					}>
					<Header headerText="Edit The Food Journal"></Header>
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

				<div className="mt-3">
					<FormLabel
						htmlFor={"foodName"}
						label={"Name of Food"}></FormLabel>
					<Input
						name="foodName"
						id="foodName"
						type="text"
						style={{ width: "100%" }}
						onChange={formik.handleChange}
						value={formik.values.foodName}
						onBlur={formik.handleBlur}
					/>
					{/* Check if the field is touched */}
					{formik.touched.foodName &&
						// Check if the field is empty
						!formik.values.foodName && (
							<p className="text-red text-[14px]">
								This field can't be left empty or zero.
							</p>
						)}
				</div>

				<div className="mt-3">
					<FormLabel
						htmlFor={"mealType"}
						label={"Meal Type"}></FormLabel>
					<select
						className="text-darkgrey"
						name="mealType"
						id="mealType"
						style={{
							width: "100%",
							height: "50px",
							border: "1px solid #DBE2EA", // Border style
							borderRadius: "5px",
							marginTop: "5px",
						}}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.mealType}>
						<option className="text-darkgrey" value="">
							Choose one
						</option>
						<option className="text-darkgrey" value="Breakfast">
							Breakfast
						</option>
						<option className="text-darkgrey" value="Morning snack">
							Morning snack
						</option>
						<option className="text-darkgrey" value="Lunch">
							Lunch
						</option>
						<option
							className="text-darkgrey"
							value="Afternoon Snack">
							Afternoon Snack
						</option>
						<option className="text-darkgrey" value="Dinner">
							Dinner
						</option>
						<option className="text-darkgrey" value="Bedtime Snack">
							Bedtime Snack
						</option>
						<option className="text-darkgrey" value="Other">
							Other
						</option>
					</select>
					{formik.touched.mealType && !formik.values.mealType && (
						<p className="text-red text-[14px]">
							This field can't be left empty.
						</p>
					)}
				</div>

				<div className="mt-3">
					<FormLabel
						htmlFor={"servingNumber"}
						label={"Number of Servings"}></FormLabel>
					<Input
						name="servingNumber"
						id="servingNumber"
						type="number"
						style={{ width: "100%" }}
						onChange={formik.handleChange}
						value={formik.values.servingNumber}
						onBlur={formik.handleBlur}
					/>
					{/* Check if the field is touched */}
					{formik.touched.servingNumber &&
						// Check if the field is empty
						((!formik.values.servingNumber && (
							<p className="text-red text-[14px]">
								This field can't be left empty or zero.
							</p>
						)) ||
							// Check if the field is less than or equal to zero
							(formik.values.servingNumber <= 0 && (
								<p className="text-red text-[14px]">
									You can't enter a negative servings number
									or a number of zero.
								</p>
							)))}
				</div>

				<div className="mt-3">
					<label
						htmlFor="calorie"
						className="font-sans font-medium text-grey text-[16px]">
						Calories
					</label>
					<br />
					<Input
						name="calorie"
						id="calorie"
						type="number"
						style={{ width: "100%" }}
						onChange={formik.handleChange}
						value={formik.values.calorie}
						onBlur={formik.handleBlur}
					/>
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
								router.push(`/getFoodJournals/${foodJournal}`)
							}
						/>

						<Button
							type="submit"
							text="Submit"
							disabled={
								!(formik.isValid && formik.dirty) || // Check if the form is valid and dirty
								formik.values.servingNumber === 0 || // Check if Number of Servings is zero
								formik.values.servingNumber < 0 || // Check if Number of Servings is less than zero
								!formik.values.mealType || // Check if Meal Type is missing or empty
								!formik.values.date || // Check if date is missing or empty
								!formik.values.time || // Check if time is missing or empty
								!formik.values.foodName || // Check if foodName is missing or empty
								!formik.values.servingNumber // Check if Number of Servings is missing or empty
							}
							style={{ width: "140px", textAlign: "center" }}
							onClick={() =>
								router.push(`/getFoodJournals/${foodJournal}`)
							}
						/>
					</div>
				</div>
			</form>
		</div>
	);
}
