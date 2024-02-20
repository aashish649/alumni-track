import React from "react";
import Typewriter from "typewriter-effect";



const TextEffect = () => {
  return (
    <div className="flex items-center justify-center m-2 font-bold text-lg">
      <Typewriter className="font-bold text-2xl"
        options={{
          strings: ["Welcome! Track and Connect with Alumini"],
          autoStart: true,
          loop: true,
          delay: 50
        }}
      />
    </div> 
  );
};


export default TextEffect;
 

