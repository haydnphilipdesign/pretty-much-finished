import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ContentCard from './ContentCard';

const testimonialData = [
  {
    id: 1,
    name: 'Bob Hay',
    role: 'Broker at Keller Williams, Former President of the Pennsylvania Association of Realtors (2008)',
    content: `Debbie has been my transaction coordinator since 2012, and before that, she worked with me as my assistant starting in 2006. I can't say enough good things about her! She is incredibly organized, staying on top of every step and detail to ensure smooth transactions every time.

Debbie's professionalism and pleasant demeanor shine through, even in the most difficult situations, making her an essential part of my team. She is, without a doubt, the best!`,
    image: '/bob-hay.jpg'
  },
  {
    id: 2,
    name: 'Cassie Transue',
    role: 'Keller Williams Realtor',
    content: `I have had the pleasure of working alongside Debbie for the past six years. During this time, she has consistently demonstrated outstanding dedication and skill as a transaction coordinator.

Debbie's meticulous approach to managing details in a fast-paced environment is unmatched and has been instrumental in the growth of my businesses. Running multiple businesses, I rely heavily on precise coordination, and Debbie plays a critical role in ensuring our success.

Her experience, judgment, and industry knowledge make her an invaluable team member. For anyone seeking a transaction coordinator with exceptional professionalism and commitment, I highly recommend Debbie.`,
    image: '/cassie-transue.jpg'
  },
  {
    id: 3,
    name: 'Robert Hoffman',
    role: 'Keller Williams Realtor',
    content: `Working with Debbie feels effortless. She's always on top of things, and her communication and customer service are easily 5-star.

Debbie handles challenges with grace, keeping everything on track without getting caught up in emotions. My clients constantly praise her, which speaks volumes about her professionalism and dedication.

With her wealth of experience, Debbie is much more than a transaction coordinator—she's a trusted advisor and an important part of my business success.`,
    image: '/robert-hoffman.jpg'
  },
  {
    id: 4,
    name: 'Axel Struckmeyer',
    role: 'Keller Williams Realtor',
    content: `I have used Debbie O'Brien's Transaction Coordinator services for around 13-14 years. When I was new to real estate, I was also managing another business, and having Debbie's help was invaluable.

She's always been incredibly reliable, detail-oriented, and proactive in managing transactions. Her professionalism and expertise have been a huge asset to my business, allowing me to focus on serving my clients while knowing the transaction details are in capable hands.`,
    image: '/axel-struckmeyer.jpg'
  },
  {
    id: 5,
    name: 'Jess Keller',
    role: 'Keller Williams Realtor',
    content: `Deb and I have been working together for over six years now, and I wouldn't have it any other way! She is an exceptional team player and has consistently exceeded my expectations on so many levels.

I'm grateful for the opportunity to work hand-in-hand with Debbie. She's a true professional who excels in her role.`,
    image: '/jess-keller.jpg'
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonialData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonialData.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="py-20 relative overflow-hidden max-w-full">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,102,204,0.02)_100%)]" />
        <div className="absolute inset-0 bg-grid-blue-500/[0.01] bg-[length:32px_32px]" />
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Read about the experiences of real estate professionals who have worked with us
          </p>
        </motion.div>

        <div className="relative mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 md:-translate-x-10 bg-white p-3 rounded-full shadow-md z-10 text-brand-blue hover:bg-blue-50 transition-all duration-300 md:block hidden border border-gray-100 hover:scale-110"
            aria-label="Previous testimonial"
          >
            <ArrowLeft size={16} />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 md:translate-x-10 bg-white p-3 rounded-full shadow-md z-10 text-brand-blue hover:bg-blue-50 transition-all duration-300 md:block hidden border border-gray-100 hover:scale-110"
            aria-label="Next testimonial"
          >
            <ArrowRight size={16} />
          </button>

          {/* Testimonial Card */}
          <ContentCard
            className="p-0 overflow-hidden"
            withAnimation={true}
            hoverEffect="none"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialData[currentIndex].id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row overflow-hidden"
              >
                {/* Image Container */}
                <div className="md:w-1/3 flex justify-center items-center bg-gradient-to-br from-brand-blue to-brand-blue/90 p-6 md:p-8 relative overflow-hidden">
                  {/* Background pattern */}
                  <div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:24px_24px]" />

                  {/* Decorative circles */}
                  <motion.div
                    className="absolute top-10 right-10 w-20 h-20 opacity-10"
                    animate={{
                      y: [0, 10, 0],
                      opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <div className="w-full h-full bg-white rounded-full blur-xl" />
                  </motion.div>

                  <div className="relative">
                    <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white/80 shadow-lg relative">
                      <img
                        src={testimonialData[currentIndex].image}
                        alt={testimonialData[currentIndex].name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  </div>
                </div>

                {/* Content Container */}
                <div className="md:w-2/3 p-6 md:p-8 flex flex-col justify-center">
                  <div className="mb-4">
                    <h3 className="text-xl md:text-2xl font-bold text-brand-blue">
                      {testimonialData[currentIndex].name}
                    </h3>
                    <p className="text-brand-blue/70 text-sm">
                      {testimonialData[currentIndex].role}
                    </p>
                  </div>

                  <div className="relative">
                    <blockquote className="text-gray-700 mb-4 relative z-10 text-base leading-relaxed overflow-auto max-h-[240px] pr-4">
                      <p className="leading-relaxed">
                        {testimonialData[currentIndex].content}
                      </p>
                    </blockquote>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </ContentCard>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8">
            {testimonialData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`mx-1 transition-all duration-300 ${
                  currentIndex === index
                    ? 'w-6 h-2 bg-brand-blue'
                    : 'w-2 h-2 bg-gray-300 hover:bg-brand-blue/50'
                } rounded-full`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;