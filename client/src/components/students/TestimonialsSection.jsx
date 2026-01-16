import React, { useContext } from "react";
import { dummyTestimonial, assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const TestimonialsSection = () => {
  const { calculateRating } = useContext(AppContext);
  return (
    <div className="flex flex-col justify-center items-center px-8 md:px-4 lg:px-0">
      <h2 className="font-medium text-3xl text-gray-800">Testimonials</h2>
      <p className="w-2/3 mt-3 text-gray-500 md:text-base">
        Hear from our learners as they share their journeys of transformation,
        success, and how our platform has made a difference in their lives.
      </p>
      <div className="mt-14 gap-4 mb-4 grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))]">
        {dummyTestimonial.map((testimonial, index) => (
          <div
            className="rounded-2xl text-sm text-left border-2 bg-white border-gray-300 shadow-[0px_4px_15px_4px] shadow-black/5 overflow-hidden"
            key={index}
          >
            <div className="flex bg-gray-500/10 items-center gap-5 py-4 px-7">
              <img
                className="rounded-full h-12 w-12"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div className="flex flex-col">
                <h2 className="text-gray-800/80 text-lg font-medium">
                  {testimonial.name}
                </h2>
                <p className="text-gray-800/80 text-sm">{testimonial.role}</p>
              </div>
            </div>
            <div className="pb-10 px-8 p-7">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src={
                      i < Math.floor(testimonial.rating)
                        ? assets.star
                        : assets.star_blank
                    }
                    className="h-5"
                    alt="rating"
                  ></img>
                ))}
              </div>
              <p className="text-gray-500 mt-5">{testimonial.feedback}</p>
              <a
                className="text-blue-600 pt-6 hover:underline text-sm relative top-4 "
                href="#"
              >
                Read More
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
