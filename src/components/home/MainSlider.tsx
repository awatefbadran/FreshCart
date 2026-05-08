"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Parallax, Pagination, Navigation, Autoplay } from "swiper/modules";

const slides = [
  {
    title: "Fresh Products Delivered to your Door",
    subtitle: "Get 20% off your first order",
    bg: "/mainslider.png",
    btnColor: "text-green-700 hover:bg-green-50",
  },
  {
    title: "Premium Quality Guaranteed",
    subtitle: "Fresh from farm to your table",
    bg: "/mainslider.png",
    btnColor: "text-blue-700 hover:bg-blue-50",
  },
  {
    title: "Fast & Free Delivery",
    subtitle: "Same day delivery available",
    bg: "/mainslider.png",
    btnColor: "text-purple-700 hover:bg-purple-50",
    order: true,
  },
];

export default function MainSlider() {
  return (
    <section className="w-full">
      <Swiper
        style={
          {
            "--swiper-navigation-color": "#16a34a",
            "--swiper-pagination-color": "#fff",
            "--swiper-pagination-width": "9.001757621765137px",
            "--swiper-pagination-height": "15.755273818969727px",
            "--swiper-navigation-size": "12px",
          } as React.CSSProperties
        }
        speed={600}
        parallax={true}
        autoplay={{ delay: 4000 }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Parallax, Pagination, Navigation, Autoplay]}
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div
              className="relative w-full h-100 bg-cover bg-center"
              style={{ backgroundImage: `url('${slide.bg}')` }}
            >
              <div className="absolute inset-0 bg-linear-to-r from-green-500/90 to-green-400/50 " />

              <div className="container mx-auto h-full">
                <div className="pl-2 relative z-10 flex flex-col justify-center h-full">
                  <h2
                    className="text-white text-3xl font-bold mb-4 max-w-96"
                    data-swiper-parallax="-300"
                  >
                    {slide.title}
                  </h2>
                  <p
                    className="text-white text-lg mb-6"
                    data-swiper-parallax="-200"
                  >
                    {slide.subtitle}
                  </p>
                  <div className="flex gap-4" data-swiper-parallax="-100">
                    <button
                      className={`bg-white cursor-pointer font-semibold px-6 py-2 rounded-lg hover:scale-105 transition ${slide.btnColor}`}
                    >
                     {slide.order ? "Order Now" : "Shop Now"} 
                    </button>
                    <button className="border border-white cursor-pointer text-white font-semibold px-6 py-2 rounded-lg hover:scale-105 transition">
                      View Deals
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
