import React from 'react';
import { motion } from 'framer-motion';

/**
 * EnhancedGlassCardsDemo - A component to showcase the enhanced glass card system
 */
const EnhancedGlassCardsDemo = () => {
  // Animation variants for cards
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  // Card data
  const cards = [
    {
      title: "Standard Glass Card",
      subtitle: "For light backgrounds",
      content: "A versatile card with a semi-transparent white background. Perfect for most content throughout the site.",
      className: "glass-card"
    },
    {
      title: "Blue Glass Card",
      subtitle: "For light backgrounds",
      content: "A blue-tinted card that stands out on light backgrounds. Great for highlighting important information.",
      className: "glass-card-blue"
    },
    {
      title: "Navy Glass Card",
      subtitle: "For light backgrounds",
      content: "A dark navy card that provides strong contrast on light backgrounds. Ideal for key sections.",
      className: "glass-card-navy"
    },
    {
      title: "White Glass Card",
      subtitle: "For dark backgrounds",
      content: "A mostly opaque white card designed for dark backgrounds. Ensures text is clearly visible.",
      className: "glass-card-white"
    },
    {
      title: "Dark Glass Card",
      subtitle: "For light backgrounds",
      content: "A dark, semi-transparent card that creates a sophisticated look on light backgrounds.",
      className: "glass-card-dark"
    },
    {
      title: "Frost Glass Card",
      subtitle: "For forms on any background",
      content: "A frosted white card optimized for forms. Provides excellent contrast for form elements.",
      className: "glass-card-frost"
    },
    {
      title: "Light Glass Card",
      subtitle: "For dark backgrounds",
      content: "A very transparent white card that adds subtle depth to dark backgrounds.",
      className: "glass-card-light"
    },
    {
      title: "Gold Glass Card",
      subtitle: "For accent areas",
      content: "A gold gradient card that draws attention to important content or calls to action.",
      className: "glass-card-gold"
    }
  ];

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Enhanced Glass Card System
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Our new glass card system features improved visual appearance and text contrast
          </p>
        </div>

        {/* Light Background Section */}
        <div className="mb-16">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Cards for Light Backgrounds
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.slice(0, 4).map((card, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={cardVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-50px" }}
                className={card.className}
              >
                <h3 className="glass-card-title">{card.title}</h3>
                <p className="glass-card-subtitle">{card.subtitle}</p>
                <p className="glass-card-content">{card.content}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dark Background Section */}
        <div className="rounded-2xl bg-gradient-to-br from-brand-blue to-brand-navy p-8 mb-16">
          <h3 className="text-xl font-semibold text-white mb-6">
            Cards for Dark Backgrounds
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.slice(4, 8).map((card, index) => (
              <motion.div
                key={index + 4}
                custom={index + 4}
                variants={cardVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-50px" }}
                className={card.className}
              >
                <h3 className="glass-card-title">{card.title}</h3>
                <p className="glass-card-subtitle">{card.subtitle}</p>
                <p className="glass-card-content">{card.content}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Form Example */}
        <div className="mb-16">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Form Elements in Glass Cards
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form in Frost Glass Card */}
            <motion.div
              variants={cardVariants}
              custom={8}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              className="glass-card-frost"
            >
              <h3 className="glass-card-title">Contact Form</h3>
              <p className="glass-card-subtitle">Optimized for form elements</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Your email"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Message</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows="3"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <button className="bg-brand-blue text-white px-4 py-2 rounded-md hover:bg-brand-blue-dark transition-colors">
                  Submit
                </button>
              </div>
            </motion.div>

            {/* Form in Navy Glass Card */}
            <motion.div
              variants={cardVariants}
              custom={9}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              className="glass-card-navy"
            >
              <h3 className="glass-card-title">Login Form</h3>
              <p className="glass-card-subtitle">Dark background with light form elements</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Username</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Your username"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Your password"
                  />
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" id="remember" />
                  <label htmlFor="remember" className="text-white">Remember me</label>
                </div>
                <button className="bg-brand-gold text-brand-navy px-4 py-2 rounded-md hover:bg-brand-gold-dark transition-colors">
                  Login
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedGlassCardsDemo;
