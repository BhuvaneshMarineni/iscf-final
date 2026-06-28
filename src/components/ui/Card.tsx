import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

const Card = ({ children, className = '', hover = false, glass = false }: CardProps) => {
  const baseStyles = 'rounded-3xl p-6 transition-all duration-300';
  
  const variants = glass
    ? 'bg-white/70 backdrop-blur-glass shadow-glass border border-white/20'
    : 'bg-white shadow-soft';
  
  const hoverStyles = hover
    ? 'hover:shadow-medium hover:scale-[1.02] hover:-translate-y-1'
    : '';
  
  return (
    <div className={`${baseStyles} ${variants} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
