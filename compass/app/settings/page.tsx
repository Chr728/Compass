import React from "react";
import ProfileIcon from "../../public/icons/Mask.svg";
import Image from "next/image";

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
            className="mr-2"
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
            className="mr-2"
          />
          <span className="text-2xl not-italic font-bold font-IBM Plex Sans text-darkgrey">
            Change your password
          </span>
        </div>
        <br></br>
        <hr className="h-px w-336 text-darkgrey"></hr>
      </div>
    </div>
  );
}
