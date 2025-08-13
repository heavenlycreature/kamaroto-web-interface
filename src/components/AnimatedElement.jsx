// src/components/AnimatedElement.jsx

import React from 'react';
import { useInView } from 'react-intersection-observer';

const AnimatedElement = ({ children, animation = "animate-fade-in-up", threshold = 0.1, triggerOnce = false }) => {
  const { ref, inView } = useInView({
    threshold: threshold,
    triggerOnce: triggerOnce,
  });

  return (
    <div
      ref={ref}
      // Elemen akan transparan di awal, dan menjadi solid saat 'inView' true
      className={`transition-all duration-700 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {children}
    </div>
  );
};

export default AnimatedElement;