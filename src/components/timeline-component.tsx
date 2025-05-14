import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Building2, FileText, Users } from 'lucide-react';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const events: TimelineEvent[] = [
  {
    year: "2018",
    title: "Started Real Estate Career",
    description: "Began working in real estate transaction coordination, learning the fundamentals of the industry.",
    icon: Building2
  },
  {
    year: "2019",
    title: "Expanded Services",
    description: "Broadened service offerings to include comprehensive transaction management and document processing.",
    icon: FileText
  },
  {
    year: "2020",
    title: "Digital Transformation",
    description: "Implemented digital solutions to streamline processes and enhance client experience.",
    icon: CheckCircle2
  },
  {
    year: "2021",
    title: "Team Growth",
    description: "Expanded team and capabilities to serve more real estate professionals.",
    icon: Users
  }
];

const Timeline: React.FC = () => {
  const [currentDescriptions, setCurrentDescriptions] = useState<boolean[]>(
    events.map(() => false)
  );

  const toggleDescription = (index: number) => {
    setCurrentDescriptions(prev => prev.map((value, i) => i === index ? !value : value));
  };

  return (
    <div className="relative">
      {events.map((event, index) => (
        <motion.div
          key={event.year}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          className="relative flex items-center mb-16 last:mb-0"
          style={{ 
            backgroundColor: 'var(--bg-color, transparent)'
          } as React.CSSProperties}
        >
          {/* Rest of the component remains the same */}
        </motion.div>
      ))}
    </div>
  );
};

export default Timeline;
