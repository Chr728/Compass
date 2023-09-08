"use client";
import React from "react";
import ProfileIcon from "../../public/icons/Mask.svg";
import Image from "next/image";
import RedButton from "../components/RedButton";
import Button from "../components/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Menu from "../components/Menu";

export default function Setting() {
  const router = useRouter();

  const handleSignOut = () => {
    //Handle Firebase logout

    //Navigate to logout page
    router.push("/logout");
  };

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
      <button onClick={() => router.back()}>
        <Header headerText="Settings"></Header>
      </button>
      <div className="rounded-3xl bg-white flex flex-col m-auto w-full md:max-w-[800px] md:h-[600px] p-8">
        <span className="text-base not-italic font-normal font-IBM Plex Sans text-grey">
          Your account
        </span>
        <br></br>
        <Link href="">
          <div className="flex items-center">
            <Image
              src="/icons/Mask.svg"
              alt="Profile icon"
              width={24}
              height={24}
              className="mr-3"
            />

            <span className="text-2xl not-italic font-bold font-IBM Plex Sans text-darkgrey">
              Your Profile
            </span>
          </div>
        </Link>

        <br></br>
        <Link href="">
          <div className="flex items-center">
            <Image
              src="/icons/vpn_key.svg"
              alt="Profile icon"
              width={24}
              height={24}
              className="mr-3"
            />
            <span className="text-2xl not-italic font-bold font-IBM Plex Sans text-darkgrey">
              Change your password
            </span>
          </div>
        </Link>
        <br></br>
        <hr className="h-px w-336 text-darkgrey"></hr>
        <br></br>
        <span className="text-base not-italic font-normal font-IBM Plex Sans text-grey">
          How you use Compass
        </span>
        <br></br>
        <Link href="">
          <div className="flex items-center">
            <Image
              src="/icons/NotificationBell.svg"
              alt="Profile icon"
              width={24}
              height={24}
              className="mr-3"
            />
            <span className="text-2xl not-italic font-bold font-IBM Plex Sans text-darkgrey">
              Push notifications
            </span>
          </div>
        </Link>
        <br></br>
        <hr className="h-px w-336 text-darkgrey"></hr>
        <br></br>
        <Link href="">
          <div className="flex items-center">
            <Image
              src="/icons/AboutIcon.svg"
              alt="Profile icon"
              width={24}
              height={24}
              className="mr-3"
            />
            <span className="text-2xl not-italic font-bold font-IBM Plex Sans text-darkgrey">
              About Compass
            </span>
          </div>
        </Link>
        <div className="text-center mt-[160px] ">
          <RedButton
            type="button"
            text="Sign Out"
            style={{
              width: "50%",
            }}
            onClick={handleSignOut}
          ></RedButton>
        </div>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <div className="md:hidden">
        <Menu></Menu>
      </div>
    </div>
  );
}
