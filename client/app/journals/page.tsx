'use client';
import NextImage from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import activity from '../../public/activity.svg';
import diabetes from '../../public/diabetes.svg';
import food from '../../public/food.svg';
import mood from '../../public/mood.svg';
import weight from '../../public/weight.svg';
import bloodPressure from '../../public/bloodPressure.svg';
import Header from '../components/Header';
import introJs from 'intro.js';

export default function Journal() {
	const router = useRouter();


	return (
		<div className="bg-eggshell p-1 pb-32 flex flex-col">
			<div className="mr-28 flex flex-col m-auto w-full p-2">
				<button className="mt-3" onClick={() => router.push("/tpage")}>
					<Header headerText="Journals"></Header>
				</button>

				<Link href="/getDiabeticJournals">
					<div
						className="rounded-3xl relative mt-1 flex flex-col   w-full  md:max-w-[800px] md:h-[600px] p-5 "
						style={{ backgroundColor: "var(--Blue, #0880AE)" }}>
						<div>
							<p className="text-[18px] text-white font-IBM   Plex Sans font-bold text-start">
								Diabetic Journal
							</p>
							<p className="text-[14px] text-white pr-20 font-IBM Plex Sans  text-start">
								Monitor your insulin and glucose.
							</p>
							<NextImage
								src={diabetes}
								alt="diabetic journal"
								width={120}
								height={70}
								className="absolute top-0 right-0 ml-16 rotate-[-14.774deg] shrink-0"
							/>
						</div>
					</div>
				</Link>
				<br></br>
				<Link href="/getActivityJournals">
					<div
						className="rounded-3xl relative mt-1 flex flex-col  w-full md:max-w-[800px] md:h-[600px] p-5 "
						style={{ backgroundColor: "var(--Black, #2C2738)" }}>
						<div>
							<p className="text-[18px] text-white font-IBM Plex Sans font-bold text-start">
								Activity Journal
							</p>
							<p className="text-[14px] text-white font-IBM Plex Sans  text-start">
								Record what gets you moving.
							</p>
							<NextImage
								src={activity}
								alt="activity journal"
								width={39}
								height={95}
								className="absolute top-0 right-8 shrink-0"
							/>
						</div>
					</div>
				</Link>
				<br></br>

				<Link href="/getWeightJournals">
					<div
						className="rounded-3xl  relative flex flex-col  w-full md:max-w-[800px] md:h-[600px] p-5 "
						style={{ backgroundColor: "var(--Red, #FF7171)" }}>
						<div>
							<p className="text-[18px] text-white font-IBM Plex Sans font-bold text-start">
								Weight Journal
							</p>
							<p className="text-[14px] text-white pr-20 font-IBM Plex Sans  text-start">
								Log your changes in weight.
							</p>
							<NextImage
								src={weight}
								alt="weight journal"
								width={120}
								height={70}
								className="absolute top-1 right-0 ml-16 rotate-[-10.527deg] shrink-0 scale-[1.15]"
							/>
						</div>
					</div>
				</Link>
				<br></br>

				<Link href="/getFoodJournals" id={'food-journal'}>
					<div
						className="rounded-3xl  relative flex flex-col  w-full md:max-w-[800px] md:h-[600px] p-5 "
						style={{ backgroundColor: "var(--Red, #F2AC57)" }}>
						<div>
							<p className="text-[18px] text-white font-IBM Plex Sans font-bold text-start">
								Food Intake Journal
							</p>
							<p className="text-[14px] text-white  pr-20 font-IBM Plex Sans  text-start">
								Keep track of what you eat.
							</p>
							<NextImage
								src={food}
								alt="food journal"
								width={113}
								height={87}
								className="absolute top-0 right-0 z-40 ml-16 transform -scale-x-100 shrink-0"
							/>
						</div>
					</div>
				</Link>
				<br></br>
				<Link href="/moodjournal">
					<div
						className="rounded-3xl relative flex flex-col w-full md:max-w-[800px] md:h-[600px] p-5 "
						style={{ backgroundColor: "var(--Green, #4caf50)" }}>
						<div>
							<p className="text-[18px] text-white font-IBM Plex Sans font-bold text-start">
								Mood Journal
							</p>
							<p className="text-[14px] text-white pr-20 font-IBM Plex Sans  text-start">
								Document what changes your mood.
							</p>
							<NextImage
								src={mood}
								alt="mood journal"
								height={105}
								className="absolute bottom-0 right-4 shrink-0"
							/>
						</div>
					</div>
				</Link>
				<br></br>
				<Link href="/getOxygenJournals">
					<div
						className="rounded-3xl relative mt-1 flex flex-col  w-full md:max-w-[800px] md:h-[600px] p-5 "
						style={{ backgroundColor: "var(--Black, #2C2738)" }}>
						<div>
							<p className="text-[18px] text-white font-IBM Plex Sans font-bold text-start">
								Oxygen Journal
							</p>
							<p className="text-[14px] text-white font-IBM Plex Sans  text-start">
								Record your blood oxygen levels.
							</p>
						</div>
					</div>
				</Link>
				<br></br>
        <Link href="/getBloodPressureJournals">
          <div 
            className="rounded-3xl relative flex flex-col w-full md:max-w-[800px] md:h-[600px] p-5 " 
            style={{backgroundColor: '#7C9CBF' }}>
            <div>
              <p className="text-[18px] text-white font-IBM Plex Sans font-bold text-start">
                Blood Pressure Journal
              </p>
              <p className="text-[14px] text-white pr-20 font-IBM Plex Sans  text-start">
                Log your blood pressure.
              </p>
              <NextImage
                src = {bloodPressure}
                alt="blood pressure journal"
                width={113}
                height={ 80 }
                className="absolute top-0 right-0 ml-16 transform -scale-x-100 shrink-0"
              />     
            </div>
          </div>
      </Link>
       <br></br>
			</div>
		</div>
	);
}
