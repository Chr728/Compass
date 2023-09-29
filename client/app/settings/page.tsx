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
import { useAuth } from "../contexts/AuthContext";

export default function Setting() {
  const router = useRouter();
  const { logout, user } = useAuth();

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
      <button onClick={() => router.back()}>
        <Header headerText="Settings"></Header>
      </button>
      <div className="rounded-3xl bg-white flex flex-col m-auto w-full md:max-w-[800px] md:h-[600px] p-8">
        <span className="text-base not-italic font-normal font-IBM Plex Sans text-grey m-2">
          Your account
        </span>

        <Link href="/profile">
          <div className="flex items-center m-2">
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

        <Link
          href={{
            pathname: "/forgotpassword",
            query: {
              loggedIn: true,
            },
          }}
        >
          <div className="flex items-center m-2">
            <Image
              src="/icons/vpn_key.svg"
              alt="Password icon"
              width={24}
              height={24}
              className="mr-3"
            />
            <span className="text-2xl not-italic font-bold font-IBM Plex Sans text-darkgrey">
              Change your password
            </span>
          </div>
        </Link>

        <hr className="h-px w-336 text-darkgrey m-2"></hr>

        <span className="text-base not-italic font-normal font-IBM Plex Sans text-grey m-2">
          How you use Compass
        </span>

        <Link href="/notifications">
          <div className="flex items-center m-2">
            <Image
              src="/icons/NotificationBell.svg"
              alt="Notifications icon"
              width={24}
              height={24}
              className="mr-3"
            />
            <span className="text-2xl not-italic font-bold font-IBM Plex Sans text-darkgrey m-2">
              Push notifications
            </span>
          </div>
        </Link>

        <hr className="h-px w-336 text-darkgrey m-2"></hr>

        <span className="text-base not-italic font-normal font-IBM Plex Sans text-grey m-2">
          More Info
        </span>

        <Link href="">
          <div className="flex items-center m-2">
            <Image
              src="/icons/AboutIcon.svg"
              alt="About icon"
              width={24}
              height={24}
              className="mr-3"
            />
            <span className="text-2xl not-italic font-bold font-IBM Plex Sans text-darkgrey">
              About Compass
            </span>
          </div>
        </Link>
        <div className="text-center mt-[100px] ">
          <RedButton
            type="button"
            text="Sign Out"
            style={{
              width: "50%",
            }}
            onClick={logout}
          ></RedButton>
        </div>
      </div>

      <div className="md:hidden">
        <br></br>
        <br></br>
        <br></br>
        <Menu></Menu>
      </div>
    </div>
  );
}
