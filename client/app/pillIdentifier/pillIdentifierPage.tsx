"use client";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import { sendImage } from "../http/pillIdentifierAPI";
export default function PillIdentifierPage() {
	const router = useRouter();

	const [selectedImage, setSelectedImage] = useState<string | null | any>(
		null
	);
	const [imageBinaryFile, setImageBinaryFile] = useState<any>(null);
	const [isCameraActive, setCameraActive] = useState(false);
	const [apiResults, setApiResults] = useState<any>();
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [isImageCaptured, setImageCaptured] = useState(false);
	const [selectedLabel, setSelectedLabel] = useState(0);

	const handleLeftArrowClick = () => {
		setSelectedLabel((prevIndex) => Math.max(prevIndex - 1, 0));
	};

	const handleRightArrowClick = () => {
		setSelectedLabel((prevIndex) =>
			Math.min(prevIndex + 1, apiResults.length - 1)
		);
	};

	const startCamera = async () => {
		try {
			const videoConstraints: MediaStreamConstraints = {
				video: { facingMode: "environment" },
			};

			const mediaStream = await navigator.mediaDevices.getUserMedia(
				videoConstraints
			);

			if (videoRef.current) {
				videoRef.current.srcObject = mediaStream;
			}

			setStream(mediaStream);
			setCameraActive(true);
		} catch (error) {
			console.error("Error accessing camera:", error);
		}
	};

	const stopCamera = () => {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			setCameraActive(false);
		}
	};

	const captureImage = async () => {
		if (videoRef.current && canvasRef.current) {
			const canvas = canvasRef.current;
			const context = canvas.getContext("2d");

			if (context) {
				canvas.width = videoRef.current.videoWidth;
				canvas.height = videoRef.current.videoHeight;

				context.drawImage(
					videoRef.current,
					0,
					0,
					canvas.width,
					canvas.height
				);

				const imageData = canvas.toDataURL("image/jpeg");

				const blob = dataURLtoBlob(imageData);

				setImageBinaryFile(blob);
				setSelectedImage(imageData);
				setImageCaptured(true);
			}
		}
	};

	function dataURLtoBlob(dataURL: any) {
		const arr = dataURL.split(",");
		const mime = arr[0].match(/:(.*?);/)[1];
		const bstr = atob(arr[1]);
		let n = bstr.length;
		const u8arr = new Uint8Array(n);

		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}

		return new Blob([u8arr], { type: mime });
	}

	const handleTakePicture = async () => {
		setSelectedImage(null);
		if (!isCameraActive) {
			startCamera(); // Start the camera only if it's not already active
			setImageCaptured(false);
		} else {
			captureImage(); // Capture image if the camera is already active
			stopCamera(); // Stop the camera after capturing the image
		}
	};

	const handleSubmit = async () => {
		try {
			if (selectedImage) {
				const response = await sendImage(imageBinaryFile, true);
				const body = await response.json();
				const labelsAndProbabilities = Object.values(
					body.predictions
				).map(({ label, probability }: any) => ({
					label,
					probability,
				}));
				setApiResults(labelsAndProbabilities);
			}
		} catch (error) {
			console.error("Error sending image to server:", error);
		}
	};

	const handleAddMedication = async (selectedImage: string) => {
		try {
			if (!selectedImage) {
				console.error("No file selected");
				return;
			}

			// Store the image data URL in session storage
			sessionStorage.setItem("imageDataUrl", selectedImage);

			// Navigate to the target page
			// window.location.href = "/createMedication";
			router.push("/createMedication");
		} catch (error) {
			console.error("Error adding medication:", error);
		}
	};

	const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
		stopCamera();
		const file = event.target.files?.[0];

		if (file) {
			setImageBinaryFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				const imageDataUrl = reader.result as string;

				// Create an image element
				const img = new Image();
				img.src = imageDataUrl;

				// Wait for the image to load
				img.onload = () => {
					const canvas = document.createElement("canvas");
					const context = canvas.getContext("2d");

					if (context) {
						// Set the canvas dimensions to the desired width and height
						canvas.width = 400;
						canvas.height = 400;

						// Draw the image onto the canvas with the desired dimensions
						context.drawImage(img, 0, 0, 400, 400);

						// Retrieve the base64-encoded image with the new dimensions
						const resizedImageData = canvas.toDataURL("image/png");
						setSelectedImage(resizedImageData);
					}
				};
			};

			reader.readAsDataURL(file);
		}
	};

	useEffect(() => {
		return () => {
			// Cleanup - stop the camera when the component unmounts
			stopCamera();
			setImageCaptured(false);
		};
	}, []);

	return !apiResults ? (
		<div className="bg-eggshell min-h-screen flex flex-col">
			<span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
				<button onClick={() => router.push("/getMedications")}>
					<Header headerText="Pill Identifier" />
				</button>
			</span>
			<p className="font-bold  text-darkgrey ml-5 p-1 text-[16px]">
				Use our advanced AI to identify any pills or tablets you may
				have in hand.
			</p>
			<div>
				<ul className="font-sans list-disc  text-darkgrey ml-5 p-1  text-[12px]">
					<li>
						The app doesn't provide a 100% guarantee when
						identifying medications.
					</li>
					<li>The app provides you a score of the closest match.</li>
					<li>Take pictures against a clear background.</li>
				</ul>
			</div>
			<div className="text-center text-darkgrey">
				{!isCameraActive && (
					<img
						src={selectedImage || "/compass-removebg.png"}
						alt="Logo"
						className="smallImage m-auto"
						width={165}
						height={150}
						style={{
							alignItems: "center",
							justifyContent: "center",
						}}
					/>
				)}
				<div className="p-2 mb-2">
					<video
						ref={videoRef}
						autoPlay
						playsInline
						style={{ display: isCameraActive ? "block" : "none" }}
					/>

					{selectedImage ? (
						<button
							style={{
								width: "162px",
							}}
							onClick={handleSubmit}
							className="bg-blue text-[16px] p-3 text-white font-sans font-medium rounded-md h-[46px] shadow-[0px_4px_8px_0px_rgba(44,39,56,0.08),0px_2px_4px_0px_rgba(44,39,56,0.08)]">
							Submit
						</button>
					) : (
						<button
							style={{
								width: "162px",
							}}
							onClick={handleTakePicture}
							className="bg-blue text-[16px] p-3 text-white font-sans font-medium rounded-md h-[46px] shadow-[0px_4px_8px_0px_rgba(44,39,56,0.08),0px_2px_4px_0px_rgba(44,39,56,0.08)]">
							Take a picture
						</button>
					)}
					<canvas ref={canvasRef} style={{ display: "none" }} />
				</div>

				{!isImageCaptured ? (
					<div className="  text-darkgrey self-center">
						<label className=" bg-blue text-[16px] p-3 mb-1 text-white font-sans font-medium rounded-md h-[46px] shadow-[0px_4px_8px_0px_rgba(44,39,56,0.08),0px_2px_4px_0px_rgba(44,39,56,0.08)]">
							Upload from gallery
							<input
								type="file"
								accept="image/*"
								onChange={handleImageUpload}
								style={{ display: "none" }}
							/>
						</label>
					</div>
				) : (
					<div className="p-2 mb-2">
						<button
							style={{
								width: "165px",
							}}
							onClick={handleTakePicture}
							className="bg-blue text-[16px] p-2  text-white font-sans font-medium rounded-md h-[56px] shadow-[0px_4px_8px_0px_rgba(44,39,56,0.08),0px_2px_4px_0px_rgba(44,39,56,0.08)]">
							Choose another Image
						</button>
					</div>
				)}

				<div className="self-center mt-4">
					<Button
						type="button"
						text="Cancel"
						style={{
							width: "165px",
							backgroundColor: "var(--Red, #FF7171)",
							height: "42px",
						}}
						onClick={() => router.push(`/getMedications`)}
					/>
				</div>
			</div>
		</div>
	) : (
		<div className="bg-eggshell min-h-screen flex flex-col">
			<span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
				<button onClick={() => router.push("/getMedications")}>
					<Header headerText="Results" />
				</button>
			</span>
			<p className="font-bold  text-darkgrey ml-5 p-1 text-[16px]">
				Swipe left/right to scroll through the results as determined by
				the AI. A higher score means a closer match to your picture.
			</p>
			<p className="mt-4 font-bold  text-darkgrey ml-5 p-1 text-[16px]">
				This app does not provide a 100% guarantee.
			</p>
			<div
				className="min-h-[425px] min-w-[340px] rounded-[20px] flex flex-col m-4 self-center items-center"
				style={{ background: "var(--Eggshell, #EAF4F8)" }}>
				<div className="flex p-4 w-full">
					<div
						onClick={handleLeftArrowClick}
						className="mr-auto self-end">
						<NextImage
							src="/icons/LeftArrow.svg"
							alt="Right Arrow Icon"
							width={15}
							height={15}
							style={{ width: "auto", height: "auto" }}
						/>
					</div>

					<img
						src={selectedImage}
						alt="User-selected Image"
						className="small-image m-auto self-center"
						width={165}
						height={150}
						style={{
							alignItems: "center",
							justifyContent: "center",
						}}
					/>

					<div
						onClick={handleRightArrowClick}
						className="ml-auto self-end">
						<NextImage
							src="/icons/RightArrow.svg"
							alt="Right Arrow Icon"
							width={15}
							height={15}
							style={{ width: "auto", height: "auto" }}
							className="ml-auto"
						/>
					</div>
				</div>

				<div className="w-full">
					<p className="font-bold text-darkgrey p-4 text-[24px] text-center leading-tight -mt-2">
						{apiResults[selectedLabel].label
							.slice(
								0,
								apiResults[selectedLabel].label.search(/\d/)
							)
							.trim()}
					</p>

					<div className="font-bold text-darkgrey text-[18px] px-4 -mt-2">
						<p>
							Score:&nbsp;
							<span className="font-normal">
								{Math.round(
									apiResults[selectedLabel].probability
								)}{" "}
								% match
							</span>
						</p>
						<p>
							Strength:&nbsp;
							<span className="font-normal">
								{apiResults[selectedLabel].label
									.slice(
										apiResults[selectedLabel].label.search(
											/\d/
										)
									)
									.trim()}
							</span>
						</p>
					</div>
				</div>

				<div className="flex flex-col justify-center items-center px-4 pb-4 mt-auto">
					<Button
						type="button"
						text="Add this medication"
						style={{
							width: "175px",
							height: "48px",
						}}
						onClick={() => handleAddMedication(selectedImage)}
					/>
					<div className="flex space-x-4 mt-4">
						<div
							className={`h-2 w-2 rounded-full ${
								selectedLabel == 0 ? "bg-blue" : "bg-grey"
							}`}></div>
						<div
							className={`h-2 w-2 rounded-full ${
								selectedLabel == 1 ? "bg-blue" : "bg-grey"
							}`}></div>
						<div
							className={`h-2 w-2 rounded-full ${
								selectedLabel == 2 ? "bg-blue" : "bg-grey"
							}`}></div>
						<div
							className={`h-2 w-2 rounded-full ${
								selectedLabel == 3 ? "bg-blue" : "bg-grey"
							}`}></div>
						<div
							className={`h-2 w-2 rounded-full ${
								selectedLabel == 4 ? "bg-blue" : "bg-grey"
							}`}></div>
					</div>
				</div>
			</div>

			<div className="self-center">
				<Button
					type="button"
					text=" Return to Medications"
					style={{
						width: "175px",
						height: "48px",
						padding: "8px",
						backgroundColor: "var(--Red, #FF7171)",
					}}
					onClick={() => router.push(`/getMedications`)}
				/>
			</div>
		</div>
	);
}
