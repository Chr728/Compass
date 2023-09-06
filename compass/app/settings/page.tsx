import React from "react";
import ProfileIcon from "../../public/icons/Mask.svg";
import Image from "next/image";
import RedButton from "../components/RedButton";

export default function Setting() {
  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
      <span className="text-[24px] text-darkgrey font-IBM Plex Sans font-bol ml-6">
        Settings
      </span>
      <div className="rounded-3xl bg-white flex flex-col m-auto w-full md:max-w-[800px] md:h-[600px] p-8">
        <span className="text-base not-italic font-normal font-IBM Plex Sans text-grey">
          Your account
        </span>
        <br></br>
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
        <br></br>
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
        <br></br>
        <hr className="h-px w-336 text-darkgrey"></hr>
        <br></br>
        <span className="text-base not-italic font-normal font-IBM Plex Sans text-grey">
          How you use Compass
        </span>
        <br></br>
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
        <br></br>
        <hr className="h-px w-336 text-darkgrey"></hr>
        <br></br>
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
        <div className="text-center mt-[160px] ">
          <RedButton
            type="submit"
            text="Sign Out"
            style={{
              width: "50%",
            }}
          ></RedButton>
        </div>
      </div>
    </div>
  );
}
