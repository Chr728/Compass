interface entryprops {
	value1: string;
	value2: string;
	value3: string;
}

const result = (props: entryprops): JSX.Element => {
	return (
		<>
			<div className="flex-2">
				<p className="font-sans font-medium text-darkgrey text-[14px] text-center">
					{props.value1}
				</p>
			</div>
			<div className="flex-2">
				<p className="mr-2 font-sans font-medium text-darkgrey text-[14px] text-center">
					{props.value2}
				</p>
			</div>
			<div className="flex-2">
				<p className="ml-3 font-sans font-medium text-darkgrey text-[14px] text-center">
					{props.value3}
				</p>
			</div>
		</>
	);
};

export default result;
