import { useEffect } from "react";
import { useSplash } from "./SplashProvider";
import { resolve } from "path";

const sleep = (ms = 1000) => new Promise ((resolve => setTimeout(resolve, ms)));


export function Home () {
  const { hideSplash, isShown} = useSplash();

  //displays the splash screen for 3 seconds
  useEffect(() => {
    (async () => {
      await sleep(3000);
      hideSplash();
    });

  }, []);

  return isShown ? null : <div>Onboarding</div>
}