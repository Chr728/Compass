"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import { useUser } from "../contexts/UserContext";

export default function PillIdentifierPage() {
	const logger = require("../../logger");
	const router = useRouter();
	const { userInfo } = useUser();

	useEffect(() => {
		if (!userInfo) {
			logger.warn("User not found.");
			alert("User not found.");
		}
	}, [userInfo, router]);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				const imageDataUrl = reader.result as string;
				setSelectedImage(imageDataUrl);

				// Now you can send imageDataUrl to your server or handle it as needed
			};

			reader.readAsDataURL(file);
		}
	};

	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [stream, setStream] = useState<MediaStream | null>(null);

	useEffect(() => {
		const startCamera = async () => {
			try {
				const videoConstraints: MediaStreamConstraints = {
					video: { facingMode: "environment" }, // or 'user' for front camera
				};

				const mediaStream = await navigator.mediaDevices.getUserMedia(
					videoConstraints
				);

				if (videoRef.current) {
					videoRef.current.srcObject = mediaStream;
				}

				setStream(mediaStream);
			} catch (error) {
				console.error("Error accessing camera:", error);
			}
		};

		startCamera();

		return () => {
			// Cleanup - stop the camera when the component unmounts
			if (stream) {
				stream.getTracks().forEach((track) => track.stop());
			}
		};
	}, []);

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

				// Retrieve the base64-encoded image
				const imageData = canvas.toDataURL("image/png");
				console.log(imageData);

				// Now you can send the imageData to your server or handle it as needed
			}
		}
	};
	return (
		<div className="bg-eggshell min-h-screen flex flex-col">
			<span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
				<button onClick={() => router.push("/getMedications")}>
					<Header headerText="Pill Identifier"></Header>
				</button>
			</span>
			<p className="font-sans  text-darkgrey ml-5 p-1  text-[16px]">
				Use our advanced AI to identify any pills or tablets you may
				have in hand.
			</p>
			<div>
				<ul className="font-sans list-disc  text-darkgrey ml-5 p-1 mt-1 text-[14px]">
					<li>
						The app doesn't provide a 100% guarantee when
						identifying medications.
					</li>
					<li>The app provides you a score of the closest match.</li>
					<li>Take pictures against a clear background.</li>
					<li>Capsules are not yet supported.</li>
				</ul>
			</div>

			<div>
				<input
					type="file"
					accept="image/*"
					onChange={handleImageUpload}
				/>
				{selectedImage && (
					<img
						src={selectedImage}
						alt="Uploaded"
						style={{ maxWidth: "100%" }}
					/>
				)}
			</div>
			<div>
				<video ref={videoRef} autoPlay playsInline />
				<button onClick={captureImage}>Capture Image</button>
				<canvas ref={canvasRef} style={{ display: "none" }} />
			</div>

			<div
				className="mb-5 w-full text-center"
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}>
				<img
					src="/compass-removebg.png"
					alt="Logo"
					className="smallImage"
					width={250}
					height={150}></img>
			</div>
			<div className="mt-10 pb-4 self-center">
				<Button
					type="button"
					text="Take a Picture"
					style={{ width: "140px" }}
					onClick={() => router.push(`/pillIdentifier2`)}
				/>
			</div>
			<div className="mt-10 pb-4 self-center">
				<Button
					type="button"
					text="Upload from gallery"
					style={{ width: "140px" }}
					onClick={() => router.push(`/pillIdentifier2`)}
				/>
			</div>
			<div className="mt-10 pb-4 self-center">
				<Button
					type="button"
					text="Cancel"
					style={{
						width: "140px",
						backgroundColor: "var(--Red, #FF7171)",
						marginLeft: "12px",
					}}
					onClick={() => router.push(`/getMedications`)}
				/>
			</div>
		</div>
	);
}
