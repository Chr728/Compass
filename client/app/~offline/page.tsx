import React from "react";

export default function Offline() {
  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
      <title className="text-[34px] text-darkgrey font-sans font-bold">
        You are currently offline or the page is down....
      </title>
      <h1 className="text-[34px] text-darkgrey font-sans font-bold">
        double check your connection!
      </h1>
    </div>
  );
}
