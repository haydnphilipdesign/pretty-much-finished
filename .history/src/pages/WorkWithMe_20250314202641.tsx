import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Mail, Calendar, CheckCircle } from 'lucide-react';
import PageHero from '../components/PageHero';
import FAQ from '../components/FAQ';
import WorkTogether from '../components/WorkTogether';
import emailjs from '@emailjs/browser';
import useScrollToTop from '../hooks/useScrollToTop';

const contactMethods = [
  {
    icon: Phone,
    title: 'Phone',
    description: "Let's discuss your needs directly",
    action: 'Call (570) 588-4637',
    link: 'tel:+5705884637'
  },
  {
    icon: Mail,
    title: 'Email',
    description: 'Send me your questions',
    action: 'debbie@parealestatesupport.com',
    link: 'mailto:debbie@parealestatesupport.com'
  },
  {
    icon: Calendar,
    title: 'Schedule',
    description: 'Book a consultation',
    action: 'Schedule a Call',
    link: 'https://outlook.office365.com/owa/calendar/PARealEstateSupportServices@NETORG4562290.onmicrosoft.com/bookings/'
  }
];

const WorkWithMe: React.FC = () => {
  useScrollToTop();
  const formRef = useRef<HTMLFormElement>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    try {
      setFormStatus('loading');
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setFormStatus('success');
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      console.error('Email send error:', error);
      setErrorMessage('Failed to send message. Please try again or contact us directly.');
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <PageHero
        title="Work With Me"
        subtitle="Let's streamline your real estate transactions together"
        backgroundImage="/work-with-me-hero.jpg"
        height="large"
        overlay="gradient"
        overlayOpacity={0.7}
      />

      {/* Services Overview */}
      <motion.section 
        className="py-24"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
      <div className="w-full bg-brand-blue py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">How We'll Work</h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              I offer comprehensive transaction coordination services tailored to your specific needs
            </p>
          </div>
          <WorkTogether />
        </div>
      </div>

      </motion.section>

      {/* Contact Methods */}
      <motion.section 
        className="py-24 bg-gray-50"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Get In Touch</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions or ready to start? Reach out through any of these channels
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="bg-brand-blue/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-brand-blue" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{method.title}</h3>
                  <p className="text-gray-600 mb-6">{method.description}</p>
                  <a
                    href={method.link}
                    className="inline-flex items-center text-brand-blue font-medium hover:text-brand-blue/80 transition-colors"
                  >
                    {method.action} <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Contact Form */}
      <motion.section 
        className="py-24"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Send Me a Message</h2>
                <p className="text-xl text-gray-600 mb-8">
                  I'd love to hear about your transaction coordination needs. Fill out the form and I'll get back to you as soon as possible.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <CheckCircle className="text-brand-blue mr-4 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Personalized service tailored to your specific needs</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="text-brand-blue mr-4 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Quick response times to keep your transactions moving</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="text-brand-blue mr-4 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Flexible packages to accommodate your business volume</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-8">
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={formStatus === 'loading'}
                    className="w-full bg-brand-blue text-white font-medium py-3 px-6 rounded-lg hover:bg-brand-blue/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:opacity-70"
                  >
                    {formStatus === 'loading' ? 'Sending...' : 'Send Message'}
                  </button>
                  
                  {formStatus === 'success' && (
                    <div className="p-4 bg-green-50 text-green-700 rounded-lg">
                      Thank you for your message! I'll get back to you soon.
                    </div>
                  )}
                  
                  {formStatus === 'error' && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                      {errorMessage}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        className="py-24 bg-gray-50"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Answers to common questions about working with a transaction coordinator
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <FAQ />
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 bg-gradient-to-br from-brand-blue to-brand-blue/90 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to get started?</h2>
          <p className="text-xl text-gray-200 mb-10 max-w-3xl mx-auto">
            Submit your transaction details and I'll handle the rest
          </p>
          <Link 
            to="/agent-portal" 
            className="inline-flex items-center px-8 py-4 text-lg font-medium text-brand-blue bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            Start a Transaction <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default WorkWithMe;
