import { ChangeEvent } from "react";

interface entryprops {
	label: string;
	value?: string;
	onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
	onBlur: any;
}

const notes = (props: entryprops): JSX.Element => {
	return (
		<>
			<div className="mt-3">
				<label
					htmlFor="notes"
					className="font-sans font-medium text-grey text-[16px]">
					{props.label}
				</label>
				<br />
				<textarea
					name="notes"
					id="notes"
					className="w-full border border-solid border-lightgrey text-darkgrey rounded-md shadow-[0_4px_8px_0_rgba(44,39,56,0.04)]"
					rows={4}
					value={props.value}
					onChange={props.onChange}
					onBlur={props.onBlur}
					data-testid="notes-textarea"
				/>
			</div>
		</>
	);
};

export default notes;
