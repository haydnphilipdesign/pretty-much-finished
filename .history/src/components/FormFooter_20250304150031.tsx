import React from 'react';

const FormFooter: React.FC = () => {
  return (
    <footer className="bg-brand-navy text-white py-4 text-center text-sm">
      <p>© {new Date().getFullYear()} PA Real Estate Support Services. All rights reserved.</p>
    </footer>
  );
};

export default FormFooter;