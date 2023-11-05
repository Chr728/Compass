import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './styles.css';

import { Navigation } from 'swiper/modules';
import { Pagination } from 'swiper/modules';

import Link from 'next/link';
import NextImage from 'next/image';
import onboard1 from "../../public/onboard1.svg";
import onboard2 from "../../public/onboard2.svg";
import onboard3 from "../../public/onboard3.svg";
import Button from "../components/WhiteButton";

export default function Onboarding() {
  return (
    <>
    <div className="relative">
      <Swiper navigation={true} pagination={true} modules={[Navigation, Pagination]} className="mySwiper">
        <SwiperSlide>
          <div className="w-72 min-h-screen">
          <NextImage
            src={onboard1}
            alt="onboard 1"
            className="h-full w-full object-cover my-8 mt-24 z-50 relative"
          />
          <div className="bg-blue/75 h-2/3 flex flex-col justify-center items-center absolute bottom-0 left-0 w-full -z-1">
            <h1 className="text-5xl font-bold my-4">Access</h1>
            <h3 className="my-8">your appointments and <br/> medications - anytime, anywhere.</h3>
            <Link href="/login">
              <Button type="button" text="Get Started" style={{ padding: '0rem 2rem' }}/>
            </Link>
          </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
        <div className="w-72 min-h-screen">
          <NextImage
            src={onboard2}
            alt="onboard 2"
            className="h-full w-full object-cover my-8 mt-24 z-50 relative"
          />
          <div className="bg-blue/75 h-2/3 flex flex-col justify-center items-center absolute bottom-0 left-0 w-full -z-1">
            <h1 className="text-5xl font-bold my-4">Record</h1>
            <h3 className="my-8">your daily health activities to show <br/> your doctor how you’ve progressed <br/> and take charge of your health!</h3>
            <Link href="/login">
              <Button type="button" text="Get Started" style={{ padding: '0rem 2rem' }}/>
            </Link>
          </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
        <div className="w-72 min-h-screen">
          <NextImage
            src={onboard3}
            alt="onboard 3"
            className="h-full w-full object-cover my-8 mt-24 z-50 relative"
          />
          <div className="bg-blue/75 h-2/3 flex flex-col justify-center items-center absolute bottom-0 left-0 w-full -z-1">
            <h1 className="text-5xl font-bold my-4">Contact</h1>
            <h3 className="my-8">your loved ones and <br/> professionals important to <br/> your health with a single click!</h3>
            <Link href="/login">
              <Button type="button" text="Get Started" style={{ padding: '0rem 2rem' }}/>
            </Link>
          </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
    </>
  );
}
