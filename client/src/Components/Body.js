import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { images } from "../images/images";
import TextEffect from "./TextEffect";

const Body = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: false,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <div className="max-w-screen-md mx-auto">
      <div className="object-cover flex flex-col items-center justify-center mt-4">
        <TextEffect />
        <Slider {...settings} className="w-full max-w-screen-lg mt-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="h-64 sm:h-96 md:h-96 lg:h-96 xl:h-96 w-full sm:w-96 md:w-96 lg:w-96 xl:w-96 overflow-hidden rounded-md shadow-lg"
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Body;
