const { createContext, useState, useContext} = require("react");

const SplashContext = createContext({
  showSplash: () => {},
  hideSplash: () => {},
  isShown: true
});

import React from "react";
import Splash from "../../public/compass-removebg.png"

export const SplashProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isShown, setIsShown] = useState(true);

  return (
    <SplashContext.Provider
      value={{
        showSplash: () => {
          setIsShown(true);
        },
        hideSplash: () => {
          setIsShown(false);
        },
        isShown
      }}
      >
        {/* TODO: Add styling and validate image is showing */}
        {isShown ? (
          <div className="splash">
            <img src="{Splash}" />
          </div>
        ): null}
      {children}
      </SplashContext.Provider>
  );
};

export const useSplash = () => {
  const context = useContext(SplashContext);

  if (!context) {
    throw new Error("useSplash must be used within a SplashProvider");
  }
  
  return context;
}
