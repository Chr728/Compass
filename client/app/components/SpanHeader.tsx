import Image from "next/image";

type InputProps = {
	headerText: string;
	onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export default function Header({ headerText, onClick }: InputProps) {
	return (
		<>
			<span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
				<button onClick={onClick}>
					<div className="flex items-center m-[10px] xl:hidden">
						<Image
							src="/icons/LeftArrow.svg"
							alt="LeftArrow icon"
							width={12}
							height={12}
							className="mr-4"
						/>

						<span className="text-[color:var(--Dark-Grey,#2C2738)] text-2xl not-italic font-bold leading-[normal] font-family: IBM Plex Sans ; ">
							{headerText}
						</span>
					</div>
				</button>
			</span>
		</>
	);
}
