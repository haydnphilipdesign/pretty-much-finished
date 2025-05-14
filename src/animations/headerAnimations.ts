import { Variants } from 'framer-motion';

export const headerVariants: Variants = {
  initial: { y: -100 },
  animate: { 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
};

export const menuItemVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      type: "spring",
      stiffness: 100
    }
  })
};

export const mobileMenuVariants: Variants = {
  closed: {
    opacity: 0,
    x: "100%",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  }
};

export const linkHoverVariants: Variants = {
  initial: { scaleX: 0 },
  hover:{ 
    scaleX: 1,
    transition: { 
      type: "spring", 
      stiffness: 300 
    }
  }
};

export const logoVariants: Variants = {
  initial: { scale: 1 },
  hover:{ scale: 1.05 },
  tap: { scale: 0.95 }
};
