"use client";
import React, { useState, useEffect } from "react";
import NextImage from "next/image";
import compassImage from "../../public/compass-removebg.png";
import Onboarding from "./onboarding";

const Welcome = () => {
  return  (
    // If page is not loading then show the welcome screen
    <div>
      <Onboarding />
    </div>
  );
};

export default Welcome;
