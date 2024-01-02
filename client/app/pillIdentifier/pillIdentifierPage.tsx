// Import necessary dependencies and components
"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import Header from "../components/Header";

export default function PillIdentifierPage() {
	const router = useRouter();

	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [isCameraActive, setCameraActive] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [isImageCaptured, setImageCaptured] = useState(false);
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

	const captureImage = () => {
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

				const imageData = canvas.toDataURL("image/png");
				console.log(imageData);

				setSelectedImage(imageData);
				setImageCaptured(true);
			}
		}
	};
	const handleTakePicture = () => {
		if (!isCameraActive) {
			startCamera(); // Start the camera only if it's not already active
			setImageCaptured(false);
		} else {
			captureImage(); // Capture image if the camera is already active
			stopCamera(); // Stop the camera after capturing the image
		}
	};

	const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (file) {
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

	return (
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
					<li>Capsules are not yet supported</li>
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

					<button
						style={{
							width: "162px",
						}}
						onClick={handleTakePicture}
						className="bg-blue text-[16px] p-3  text-white font-sans font-medium rounded-md h-[46px] shadow-[0px_4px_8px_0px_rgba(44,39,56,0.08),0px_2px_4px_0px_rgba(44,39,56,0.08)]">
						{isImageCaptured ? "Submit" : "Take a picture"}
					</button>
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
	);
}
