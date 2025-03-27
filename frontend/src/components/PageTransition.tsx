import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  
  // Enhanced page turning animation variants
  const pageVariants = {
    initial: {
      opacity: 0,
      rotateY: -60,
      scaleX: 0.95, // Subtle page curl
      transformOrigin: "left center",
      transformPerspective: 2000,
      boxShadow: "-40px 0 40px rgba(0, 0, 0, 0.3)",
      filter: "brightness(0.7)"
    },
    animate: {
      opacity: 1,
      rotateY: 0,
      scaleX: 1,
      transformOrigin: "left center",
      transformPerspective: 2000,
      boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
      filter: "brightness(1)"
    },
    exit: {
      opacity: 0,
      rotateY: 60,
      scaleX: 0.95, // Subtle page curl
      transformOrigin: "right center",
      transformPerspective: 2000,
      boxShadow: "40px 0 40px rgba(0, 0, 0, 0.3)",
      filter: "brightness(0.7)"
    }
  };

  // Enhanced shadow overlay for more realistic book fold effect
  const shadowVariants = {
    initial: { 
      opacity: 0.8,
      background: "linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 15%, transparent 40%)"
    },
    animate: { 
      opacity: 0,
      background: "linear-gradient(to right, rgba(0,0,0,0.1), transparent 10%)" 
    },
    exit: { 
      opacity: 0.8,
      background: "linear-gradient(to left, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 15%, transparent 40%)" 
    }
  };

  // Paper texture overlay to enhance the book page appearance
  const textureVariants = {
    initial: {
      opacity: 0.2
    },
    animate: {
      opacity: 0.05
    },
    exit: {
      opacity: 0.2
    }
  };

  // Custom spring physics for more natural page turning
  const springTransition = {
    type: "spring",
    stiffness: 70,
    damping: 15,
    mass: 1
  };
  
  return (
    <div className="page-transition-container overflow-hidden w-full h-full relative">
      {/* Paper texture background - using CSS for the texture instead of an image */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-5"
        style={{ 
          backgroundImage: `
            radial-gradient(circle at 25px 25px, rgba(0, 0, 0, 0.05) 1px, transparent 0),
            radial-gradient(circle at 75px 75px, rgba(0, 0, 0, 0.03) 1px, transparent 0)
          `,
          backgroundSize: "100px 100px"
        }}
      />
      
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={springTransition}
        className="w-full h-full relative z-10"
        style={{ backfaceVisibility: "hidden" }}
      >
        {children}
        
        {/* Paper texture overlay for the page - using CSS for the texture */}
        <motion.div 
          className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay"
          style={{ 
            backgroundImage: `
              linear-gradient(
                45deg, 
                rgba(255, 255, 255, 0.05) 25%, 
                transparent 25%, 
                transparent 50%, 
                rgba(255, 255, 255, 0.05) 50%, 
                rgba(255, 255, 255, 0.05) 75%, 
                transparent 75%, 
                transparent
              )
            `,
            backgroundSize: "200px 200px"
          }}
          variants={textureVariants}
          transition={springTransition}
        />
        
        {/* Shadow gradient overlay to enhance 3D effect */}
        <motion.div 
          className="absolute inset-0 z-30 pointer-events-none"
          variants={shadowVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={springTransition}
        />
        
        {/* Spine shadow for book binding effect */}
        <motion.div
          className="absolute top-0 bottom-0 left-0 w-[3px] z-40 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={springTransition}
          style={{
            background: "linear-gradient(to right, rgba(0,0,0,0.5), transparent)"
          }}
        />
        
        {/* Page edge effect - subtle line on the right side */}
        <motion.div
          className="absolute top-0 bottom-0 right-0 w-[1px] z-40 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          exit={{ opacity: 0 }}
          transition={springTransition}
          style={{
            background: "linear-gradient(to left, rgba(0,0,0,0.3), transparent)"
          }}
        />
      </motion.div>
    </div>
  );
};

export default PageTransition; 