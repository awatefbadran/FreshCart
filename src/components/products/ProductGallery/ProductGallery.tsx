"use client";
import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const mainSwiperRef = useRef<SwiperType | null>(null);
  const thumbsContainerRef = useRef<HTMLDivElement | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-xl border border-dashed text-gray-400">
        No images available
      </div>
    );
  }

  const handleThumbClick = (index: number) => {
    setActiveIndex(index);
    mainSwiperRef.current?.slideTo(index);

    const container = thumbsContainerRef.current;
    const thumb = container?.children[index] as HTMLElement;
    if (container && thumb) {
      const scrollLeft =
        thumb.offsetLeft - container.offsetWidth / 2 + thumb.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full flex flex-col gap-3 sticky top-10">
      <div className="p-4 border rounded-xl">
        <Swiper
          onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          spaceBetween={10}
          className="w-full h-[469.0799865722656px] rounded-xl overflow-hidden"
        >
          {images.map((imgUrl, index) => (
            <SwiperSlide key={index}>
              <div className="relative flex justify-center items-center h-full w-full">
                <Image
                  src={imgUrl}
                  alt={`Product view ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 25vw"
                  priority={index === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div
          ref={thumbsContainerRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide"
        >
          {images.map((imgUrl, index) => (
            <div
              key={index}
              onClick={() => handleThumbClick(index)}
              className={`relative shrink-0 w-36 h-36 overflow-hidden border-4 cursor-pointer transition-all ${
                activeIndex === index
                  ? "border-blue-600 shadow-md"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <Image
                src={imgUrl}
                alt={`Thumbnail ${index + 1}`}
                fill
                sizes="144px"
                className="object-contain w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
