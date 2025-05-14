import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from '../components/GlobalLinkProvider';
import { ArrowRight, Phone, Mail, Calendar, CheckCircle } from 'lucide-react';
import PageHeroWrapper from '../components/PageHeroWrapper';
import FAQ from '../components/FAQ';
import WorkTogether from '../components/WorkTogether';
import emailjs from '@emailjs/browser';
import useScrollToTop from '../hooks/useScrollToTop';
import PreloadedAnimationWrapper from '../components/PreloadedAnimationWrapper';

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
    <div className="min-h-screen bg-transparent">
      {/* Using synchronized PageHeroWrapper with consistent min-h-screen height */}
      <PageHeroWrapper
        title="Work With Me"
        subtitle="Let's streamline your real estate transactions together"
        minHeight="min-h-screen"
      >
        <Link
          to="/agent-portal"
          className="inline-flex items-center mt-6 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium border border-white/20 transition-all duration-300"
        >
          Start a Transaction
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </PageHeroWrapper>

      {/* How We Work Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,255,255,0.05)_100%)]" />
          <div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:32px_32px]" />
        </div>
        <div className="container mx-auto px-4 py-24 relative">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-white/20 text-white text-sm font-medium mb-4">Our Process</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">How We'll Work Together</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              I offer comprehensive transaction coordination services tailored to your specific needs
            </p>
          </div>
          <WorkTogether />
        </div>
      </section>

      {/* Contact Methods */}
      <motion.section
        className="py-24 bg-gray-50 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.02)_100%)]" />
          <div className="absolute inset-0 bg-grid-gray-500/[0.02] bg-[length:32px_32px]" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">Contact Options</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Get In Touch</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Have questions or ready to start? Reach out through any of these channels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={index}
                  className="group relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="glass-card-navy h-full text-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <div className="bg-blue-500/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-white group-hover:text-brand-gold transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{method.title}</h3>
                    <p className="text-white/90 mb-6">{method.description}</p>
                    <a
                      href={method.link}
                      className="inline-flex items-center text-blue-200 font-medium hover:text-white transition-colors"
                    >
                      {method.action}
                      <motion.div
                        className="ml-2"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Contact Form */}
      <section className="py-24 relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.01)_100%)]" />
          <div className="absolute inset-0 bg-grid-gray-500/[0.01] bg-[length:32px_32px]" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <PreloadedAnimationWrapper
                className="relative"
                preloadDelay={200}
              >
                <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">Get Started</span>
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
              </PreloadedAnimationWrapper>

              <PreloadedAnimationWrapper
                className="group relative"
                preloadDelay={300}
              >
                <div className="glass-card-frost p-8 shadow-lg">
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 text-gray-800"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 text-gray-800"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-800 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 text-gray-800"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-800 mb-1">
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 text-gray-800"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={formStatus === 'loading'}
                      className="w-full bg-blue-600 text-white font-medium py-3 px-6 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 disabled:opacity-70"
                    >
                      {formStatus === 'loading' ? 'Sending...' : 'Send Message'}
                    </button>

                    {formStatus === 'success' && (
                      <div className="p-4 bg-green-100 rounded-lg border border-green-300 text-green-800">
                        Thank you for your message! I'll get back to you soon.
                      </div>
                    )}

                    {formStatus === 'error' && (
                      <div className="p-4 bg-red-100 rounded-lg border border-red-300 text-red-800">
                        {errorMessage}
                      </div>
                    )}
                  </form>
                </div>
              </PreloadedAnimationWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.02)_100%)]" />
          <div className="absolute inset-0 bg-grid-gray-500/[0.02] bg-[length:32px_32px]" />
        </div>
        <div className="container mx-auto px-4 py-24 relative">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">Common Questions</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Answers to common questions about working with a transaction coordinator
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <FAQ />
          </div>
        </div>
      </section>

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
          <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
            Submit your transaction details and I'll handle the rest
          </p>
          <Link
            to="/agent-portal"
            className="group inline-flex items-center px-8 py-4 text-lg font-medium text-brand-blue bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1"
          >
            Start a Transaction
            <motion.div
              className="ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            >
              <ArrowRight className="h-5 w-5" />
            </motion.div>
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default WorkWithMe;