interface TimelineEvent { id: number; title: string; institution: string; date: string; description: string[]; category: string; icon: JSX.Element; color: { bg: string; bgLight: string; textHover: string; boxShadow: string }; }
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FaGraduationCap,
  FaBriefcase,
  FaBook,
  FaBuilding,
  FaChartLine,
  FaHandshake,
} from "react-icons/fa";

const events: TimelineEvent[] = [
  {
    id: 1,
    title: "Graduated from",
    institution: "Kittatinny Regional HS",
    date: "1984",
    description: [
      "Developed business foundations and administrative skills.",
      "Learned effective time management and organizational skills.",
      "Built a strong academic and practical foundation for future endeavors."
    ],
    category: "Education",
    icon: <FaGraduationCap size={50} />,
    color: {
      bg: "#550527", // Tyrian Purple
      bgLight: "#a60a4b",
      textHover: "#FFF",
      boxShadow: "rgba(85, 5, 39, 0.48)",
    }
  },
  {
    id: 2,
    title: "Closing Administrator",
    institution: "Associates Abstract, Inc.",
    date: "1985-1989",
    description: [                              
      "Oversaw real estate closings and managed legal documentation.",
      "Collaborated with attorneys to ensure transaction accuracy.",
      "Developed streamlined processes for efficient transaction handling."
    ],
    category: "Early Career",
    icon: <FaBriefcase size={50} />,
    color: {
      bg: "#5f4a27", // Field Drab
      bgLight: "#94743c",
      textHover: "#FFF",
      boxShadow: "rgba(95, 74, 39, 0.48)",
    }
  },
  {
    id: 3,
    title: "Office Manager",
    institution: "MAC Mortgage Co., Inc.",
    date: "1989-1991",
    description: [
      "Managed daily mortgage operations and workflows efficiently.",
      "Strengthened client relationships through personalized service.",
      "Implemented systems to improve organizational efficiency."
    ],
    category: "Mortgage Industry",
    icon: <FaBuilding size={50} />,
    color: {
      bg: "#688e26", // Avocado
      bgLight: "#8dc133",
      textHover: "#FFF",
      boxShadow: "rgba(104, 142, 38, 0.48)",
    }
  },
  {
    id: 4,
    title: "Bookkeeper/Secretary",
    institution: "John C. Ernst Company",
    date: "1998-2000",
    description: [
      "Maintained financial records and legal documentation.",
      "Organized systems to support company operations.",
      "Ensured accuracy in bookkeeping and administrative processes."
    ],
    category: "Corporate Role",
    icon: <FaBriefcase size={50} />,
    color: {
      bg: "#8e7a1b", // Darker Satin Sheen Gold
      bgLight: "#b5a02b",
      textHover: "#FFF",
      boxShadow: "rgba(142, 122, 27, 0.48)",
    }
  },
  {
    id: 5,
    title: "Executive Assistant and VP",
    institution: "Homes of Distinction, Inc.",
    date: "2000-2005",
    description: [
      "Reported directly to renowned developer Michael Berardi.",
      "Oversaw real estate projects and client relations.",
      "Enhanced operations and strengthened industry partnerships.",
      "Managed communications and executive-level strategic initiatives."
    ],
    category: "Real Estate Development",
    icon: <FaBuilding size={50} />,
    color: {
      bg: "#d48910", // Darker Orange (Web)
      bgLight: "#fbb843",
      textHover: "#FFF",
      boxShadow: "rgba(212, 137, 16, 0.48)",
    }
  },
  {
    id: 6,
    title: "PA Real Estate License",
    institution: "Pocono Real Estate Academy",
    date: "2005",
    description: [
      "Earned Pennsylvania real estate certification and licensure.",
      "Learned state regulations and advanced transaction skills.",
      "Developed expertise in market analysis and client relations."
    ],
    category: "Professional Growth",
    icon: <FaBook size={50} />,
    color: {
      bg: "#5889b0", // Darker Sky Blue
      bgLight: "#78a5c8",
      textHover: "#FFF",
      boxShadow: "rgba(88, 137, 176, 0.48)",
    }
  },
  {
    id: 7,
    title: "Closing Administrator",
    institution: "Fidelity Home Abstract, Inc.",
    date: "2005-2006",
    description: [
      "Handled closings and ensured title compliance.",
      "Reviewed title procedures for accuracy and completion.",
      "Coordinated transactions in alignment with legal standards."
    ],
    category: "Title Industry",
    icon: <FaBriefcase size={50} />,
    color: {
      bg: "#3682b1", // Slightly Darker Celestial Blue
      bgLight: "#569ed1",
      textHover: "#FFF",
      boxShadow: "rgba(54, 130, 177, 0.48)",
    }
  },
  {
    id: 8,
    title: "Transaction Coordinator/Compliance Review Officer",
    institution: "For Bob Hay, Broker for Keller Williams",
    date: "2006-2013",
    description: [
      "Streamlined processes and coordinated real estate transactions.",
      "Reviewed contracts for compliance with industry standards.",
      "Developed systems to improve transaction oversight and compliance."
    ],
    category: "Real Estate Brokerage",
    icon: <FaHandshake size={50} />,
    color: {
      bg: "#ba2c73", // Magenta Dye
      bgLight: "#d4498f",
      textHover: "#FFF",
      boxShadow: "rgba(186, 44, 115, 0.48)",
    }
  },
  {
    id: 9,
    title: "Owner/President",
    institution: 'PA Real Estate Support Services', 
    date: "2013-Present",
    description: [
      "Provided strong leadership in real estate transaction support and management.",
      "Managed business operations and client success strategies.",
      "Oversaw transaction processes and ensured client satisfaction."
    ],
    category: "Independent Transaction Coordinator",
    icon: <FaChartLine size={50} />,
    color: {
      bg: "#6d3b47", // Wine
      bgLight: "#9a5363",
      textHover: "#FFF",
      boxShadow: "rgba(109, 59, 71, 0.48)",
    }
  },
];


const Timeline: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Rotate descriptions every 3 seconds
  const [currentDescriptions, setCurrentDescriptions] = useState(
    events.map(() => 0) // Initialize description index for all events
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDescriptions((prev) =>
        prev.map((index, i) => (index + 1) % events[i].description.length)
      );
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen py-16 font-['Open Sans']" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Chronological indicators */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full flex flex-col justify-between">
            {/* Row connectors */}
            <div className="hidden lg:block absolute top-[25%] left-[5%] right-[5%] h-0.5 bg-white/20"></div>
            <div className="hidden lg:block absolute top-[58%] left-[5%] right-[5%] h-0.5 bg-white/20"></div>
            
            {/* Direction indicators */}
            <div className="hidden lg:flex absolute top-[23%] right-[10%] text-white/40 items-center">
              <span className="text-sm mr-2">1980s</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </div>
            <div className="hidden lg:flex absolute top-[56%] left-[10%] text-white/40 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse"><path d="M19 12H5"></path><path d="m12 19-7-7 7-7"></path></svg>
              <span className="text-sm ml-2">2000s</span>
            </div>
            <div className="hidden lg:flex absolute top-[89%] right-[10%] text-white/40 items-center">
              <span className="text-sm mr-2">Present Day</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {/* Row 1 heading */}
          <div className="col-span-full mb-2 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-block px-6 py-1.5 bg-white/10 rounded-full"
            >
              <h3 className="text-white/90 text-xl font-medium">Early Career (1980s-1990s)</h3>
            </motion.div>
          </div>
          
          {/* First 3 events */}
          {events.slice(0, 3).map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{
                "--bg-color": event.color.bg,
                "--bg-color-light": event.color.bgLight,
                "--text-color-hover": event.color.textHover,
                "--box-shadow-color": event.color.boxShadow,
              } as React.CSSProperties}
              className="group w-[220px] h-[321px] bg-white rounded-tr-lg overflow-hidden flex flex-col justify-between items-center relative shadow-[0_14px_26px_rgba(0,0,0,0.04)] transition-all duration-500 ease-out hover:translate-y-[-5px] hover:scale-[1.005] hover:shadow-[0_24px_36px_rgba(0,0,0,0.11),0_24px_46px_var(--box-shadow-color)] active:scale-100 active:shadow-[0_15px_24px_rgba(0,0,0,0.11),0_15px_24px_var(--box-shadow-color)] py-8"
            >
              <div className="overlay w-[118px] absolute h-[118px] rounded-full bg-[var(--bg-color)] top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-0 transition-transform duration-500 ease-out group-hover:scale-[4]" />

              {/* Top content */}
              <div className="w-full text-center z-[1000]">
                <div className="transform transition-all duration-500 ease-out group-hover:translate-y-[-10px] group-hover:opacity-0">
                  <p className="text-[15px] font-bold text-[#2D3748]">
                    {event.title}
                  </p>
                </div>
                <div className="absolute top-8 left-0 w-full transform transition-all duration-500 ease-out translate-y-[10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-[15px] font-bold text-[var(--text-color-hover)]">
                    {event.category}
                  </p>
                </div>
              </div>

              {/* Circle with icon */}
              <div className="relative">
                <div className="circle w-[131px] h-[131px] rounded-full bg-white border-2 border-[var(--bg-color)] flex justify-center items-center relative z-[1] transition-all duration-500 ease-out group-hover:border-[var(--bg-color-light)] group-hover:bg-white">
                  <div className="after:content-[''] after:w-[118px] after:h-[118px] after:absolute after:bg-[var(--bg-color)] after:rounded-full after:top-[7px] after:left-[7px] after:transition-opacity after:duration-500 after:ease-out group-hover:after:opacity-0" />
                  <div className="z-[10000] transform translate-z-0 text-white group-hover:text-[var(--bg-color)]">
                    {event.icon}
                  </div>
                </div>
              </div>

              {/* Bottom content */}
              <div className="w-full text-center z-[1000] min-h-[4rem] flex items-center justify-center">
                <p className="text-[15px] font-bold text-[#2D3748] transform transition-all duration-500 ease-out group-hover:translate-y-[10px] group-hover:opacity-0">
                  {event.institution}
                  <br />
                  {event.date}
                </p>
                <div className="absolute bottom-8 left-0 w-full px-6 transform transition-all duration-500 ease-out translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-[14px] font-semibold text-[var(--text-color-hover)] leading-snug mb-0.5">
                    {event.description[currentDescriptions[index]]}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Row 2 heading */}
          <div className="col-span-full mt-12 mb-2 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-block px-6 py-1.5 bg-white/10 rounded-full"
            >
              <h3 className="text-white/90 text-xl font-medium">Professional Growth (2000-2006)</h3>
            </motion.div>
          </div>
          
          {/* Middle 3 events */}
          {events.slice(3, 6).map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
              style={{
                "--bg-color": event.color.bg,
                "--bg-color-light": event.color.bgLight,
                "--text-color-hover": event.color.textHover,
                "--box-shadow-color": event.color.boxShadow,
              } as React.CSSProperties}
              className="group w-[220px] h-[321px] bg-white rounded-tr-lg overflow-hidden flex flex-col justify-between items-center relative shadow-[0_14px_26px_rgba(0,0,0,0.04)] transition-all duration-500 ease-out hover:translate-y-[-5px] hover:scale-[1.005] hover:shadow-[0_24px_36px_rgba(0,0,0,0.11),0_24px_46px_var(--box-shadow-color)] active:scale-100 active:shadow-[0_15px_24px_rgba(0,0,0,0.11),0_15px_24px_var(--box-shadow-color)] py-8"
            >
              <div className="overlay w-[118px] absolute h-[118px] rounded-full bg-[var(--bg-color)] top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-0 transition-transform duration-500 ease-out group-hover:scale-[4]" />

              {/* Top content */}
              <div className="w-full text-center z-[1000]">
                <div className="transform transition-all duration-500 ease-out group-hover:translate-y-[-10px] group-hover:opacity-0">
                  <p className="text-[15px] font-bold text-[#2D3748]">
                    {event.title}
                  </p>
                </div>
                <div className="absolute top-8 left-0 w-full transform transition-all duration-500 ease-out translate-y-[10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-[15px] font-bold text-[var(--text-color-hover)]">
                    {event.category}
                  </p>
                </div>
              </div>

              {/* Circle with icon */}
              <div className="relative">
                <div className="circle w-[131px] h-[131px] rounded-full bg-white border-2 border-[var(--bg-color)] flex justify-center items-center relative z-[1] transition-all duration-500 ease-out group-hover:border-[var(--bg-color-light)] group-hover:bg-white">
                  <div className="after:content-[''] after:w-[118px] after:h-[118px] after:absolute after:bg-[var(--bg-color)] after:rounded-full after:top-[7px] after:left-[7px] after:transition-opacity after:duration-500 after:ease-out group-hover:after:opacity-0" />
                  <div className="z-[10000] transform translate-z-0 text-white group-hover:text-[var(--bg-color)]">
                    {event.icon}
                  </div>
                </div>
              </div>

              {/* Bottom content */}
              <div className="w-full text-center z-[1000] min-h-[4rem] flex items-center justify-center">
                <p className="text-[15px] font-bold text-[#2D3748] transform transition-all duration-500 ease-out group-hover:translate-y-[10px] group-hover:opacity-0">
                  {event.institution}
                  <br />
                  {event.date}
                </p>
                <div className="absolute bottom-8 left-0 w-full px-6 transform transition-all duration-500 ease-out translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-[14px] font-semibold text-[var(--text-color-hover)] leading-snug mb-0.5">
                    {event.description[currentDescriptions[index + 3]]}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Row 3 heading */}
          <div className="col-span-full mt-12 mb-2 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-block px-6 py-1.5 bg-white/10 rounded-full"
            >
              <h3 className="text-white/90 text-xl font-medium">Entrepreneurship (2006-Present)</h3>
            </motion.div>
          </div>
          
          {/* Last 3 events */}
          {events.slice(6, 9).map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
              style={{
                "--bg-color": event.color.bg,
                "--bg-color-light": event.color.bgLight,
                "--text-color-hover": event.color.textHover,
                "--box-shadow-color": event.color.boxShadow,
              } as React.CSSProperties}
              className="group w-[220px] h-[321px] bg-white rounded-tr-lg overflow-hidden flex flex-col justify-between items-center relative shadow-[0_14px_26px_rgba(0,0,0,0.04)] transition-all duration-500 ease-out hover:translate-y-[-5px] hover:scale-[1.005] hover:shadow-[0_24px_36px_rgba(0,0,0,0.11),0_24px_46px_var(--box-shadow-color)] active:scale-100 active:shadow-[0_15px_24px_rgba(0,0,0,0.11),0_15px_24px_var(--box-shadow-color)] py-8"
            >
              <div className="overlay w-[118px] absolute h-[118px] rounded-full bg-[var(--bg-color)] top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-0 transition-transform duration-500 ease-out group-hover:scale-[4]" />

              {/* Top content */}
              <div className="w-full text-center z-[1000]">
                <div className="transform transition-all duration-500 ease-out group-hover:translate-y-[-10px] group-hover:opacity-0">
                  <p className="text-[15px] font-bold text-[#2D3748]">
                    {event.title}
                  </p>
                </div>
                <div className="absolute top-8 left-0 w-full transform transition-all duration-500 ease-out translate-y-[10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-[15px] font-bold text-[var(--text-color-hover)]">
                    {event.category}
                  </p>
                </div>
              </div>

              {/* Circle with icon */}
              <div className="relative">
                <div className="circle w-[131px] h-[131px] rounded-full bg-white border-2 border-[var(--bg-color)] flex justify-center items-center relative z-[1] transition-all duration-500 ease-out group-hover:border-[var(--bg-color-light)] group-hover:bg-white">
                  <div className="after:content-[''] after:w-[118px] after:h-[118px] after:absolute after:bg-[var(--bg-color)] after:rounded-full after:top-[7px] after:left-[7px] after:transition-opacity after:duration-500 after:ease-out group-hover:after:opacity-0" />
                  <div className="z-[10000] transform translate-z-0 text-white group-hover:text-[var(--bg-color)]">
                    {event.icon}
                  </div>
                </div>
              </div>

              {/* Bottom content */}
              <div className="w-full text-center z-[1000] min-h-[4rem] flex items-center justify-center">
                <p className="text-[15px] font-bold text-[#2D3748] transform transition-all duration-500 ease-out group-hover:translate-y-[10px] group-hover:opacity-0">
                  {event.institution}
                  <br />
                  {event.date}
                </p>
                <div className="absolute bottom-8 left-0 w-full px-6 transform transition-all duration-500 ease-out translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-[14px] font-semibold text-[var(--text-color-hover)] leading-snug mb-0.5">
                    {event.description[currentDescriptions[index + 6]]}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
