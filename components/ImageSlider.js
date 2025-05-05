'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useCallback } from 'react';
import { Platypi } from 'next/font/google';


const platypi = Platypi({
  weight: ['400'], 
  preload: false,
});

const ImageSlider = ({ slides, autoPlay = true, autoPlayInterval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", updateMobile);
    updateMobile();
    return () => window.removeEventListener("resize", updateMobile);
  }, []);


  const nextSlide = useCallback(() => {
    if (isTransitioning) return; // Prevent spamming navigation
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      setIsTransitioning(false);
    }, 500); // Matches the transition duration
  }, [isTransitioning, slides.length]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return; 
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 500); // Matches the transition duration
  }, [isTransitioning, slides.length]);

  useEffect(() => {
    let interval;
    if (autoPlay) {
      interval = setInterval(nextSlide, autoPlayInterval);
    }
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, nextSlide]);

  
  return (
    <div className="relative overflow-hidden max-w-full mx-auto">
      {/* Slide Container */}
      <div
        className="relative w-full h-auto flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
      {slides.map((slide, index) => (
        <div
          key={index}
          className="w-full h-full flex-shrink-0 relative flex flex-col md:flex-row items-center"      
        >
          

          {/* Slide Content */}
          <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-start items-start p-6 small-mobile:top-0 sm:top-0 md:top-0 lg:top-24 xl:top-24">
            <div className="w-full max-w-7xl mx-auto p-0">
              <div className="w-full lg:w-1/2  space-y-6">
                {/* Slide Heading */}
                <h2
                  className={`${platypi.className} text-[#181818] text-34 small-mobile:text-40 sm:text-40 md:text-40 lg:text-48 xl:text-60 font-[400] mb-4`}
                >
                  {slide.heading.split(" ").slice(0, -1).join(" ")}{" "}
                  <span className="text-red-500">
                    {slide.heading.split(" ").slice(-1)}
                  </span>
                </h2>

                {/* Slide Content Text */}
                <p className="text-[#181818] text-14 mb-4 sm:text-16 md:text-16 lg:text-16 xl:text-16 small-mobile:text-16 font-[500]">
                  {slide.content}
                </p>

                {/* Call-to-Action Button */}
                {/* {slide.ctaText && (
                  <div className="flex items-center space-x-4">
                    <a
                      href={slide.ctaLink}
                      className={`bg-[#090909] text-white px-6 py-3 rounded-md hover:bg-[#E52D38] transition duration-300 ${
                        currentIndex === index ? 'animate-fadeIn opacity-100' : 'opacity-0'
                      }`}
                    >
                      {slide.ctaText}
                    </a>
                  </div>
                )} */}
              </div>

              {/* Small Image and Content */}
              {/* <div
                className={`py-6 flex flex-col small-mobile:flex-col sm:flex-col md:flex-col lg:flex-row xl:flex-row  transition duration-300 justify-start ${
                  currentIndex === index ? 'animate-fadeUp opacity-100' : 'opacity-0'
                }`}
              >
               <div className='flex flex-row items-center gap-2'>
               <Image
                  src={slide.smallImage}
                  alt={`Small Slide ${index + 1}`}
                  width={176}
                  height={65}
                  className="object-cover rounded-md w-20 small-mobile:text-w-20 sm:w-20 md:w-20 lg:w-40 xl:w-40"
                />
                
                  <span className="block text-14 font-[500] small-mobile:text-14 sm:text-14 md:text-14 lg:text-16 xl:text-16 whitespace-nowrap ">{slide.smallContentF}</span>
               </div>
               <div className='flex flex-row items-center gap-2'>
                 <span className="block  text-primary  font-[platypi] text-20 font-[700] small-mobile:text-20 sm:text-20 md:text-20 lg:text-48  xl:text-48 lg:ml-3 xl:ml-3">
                    {slide.smallContentS}
                  </span>
                  <span className="block text-14 font-[500] small-mobile:text-14 sm:text-14 md:text-14 lg:text-16 xl:text-16 whitespace-nowrap">{slide.smallContentT}</span>
                </div>
               
              </div> */}
            </div>
          </div>

          {/* Main Image with Responsive Handling */}
          <picture>
            {/* Define Mobile Image */}
            <source
              media="(max-width: 768px)"
              srcSet={slide.mobileImage}
            />
            {/* Default Image for Larger Screens */}
            <img
              src={isMobile ? slide.mobileImage : slide.image}
              alt={`Slide ${index + 1}`}
              className={`w-full object-cover ${isMobile ? "mt-[275px] ml-[20%]" : ""}`}
            />
          </picture>
        </div>
      ))}

      </div>

      {/* Navigation Buttons */}
      <button
          className="absolute top-1/2 left-4 transform -translate-y-1/2 px-4 py-1 bg-white text-red-200 rounded-full z-10 hidden lg:block border-[#EBC3C3] border text-3xl"
          onClick={prevSlide}
        >
          &#10094;
      </button>
      <button
          className="absolute top-1/2 right-4 transform -translate-y-1/2 px-4 py-1 bg-white text-red-200 rounded-full z-10 hidden lg:block border-[#EBC3C3] border text-3xl"
          onClick={nextSlide}
        >
          &#10095;
      </button>


      {/* Dot Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-primary' : 'bg-gray-500'
            }`}
            onClick={() => setCurrentIndex(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
