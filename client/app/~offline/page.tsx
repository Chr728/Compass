import React from "react";
import Head from "next/head";

export default function Offline() {
  console.log("YIPEEEEE");
  return (
    <>
      <Head>
        <title>next-pwa example</title>
      </Head>
      <h1>This is offline fallback page</h1>
      <h2>When offline, any page route will fallback to this page</h2>
    </>
  );
}
