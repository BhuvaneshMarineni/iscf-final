import { ReactNode, CSSProperties } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  style?: CSSProperties;
}

const GlassCard = ({ children, className = '', hover = false, style }: GlassCardProps) => {
  const baseStyles = 'bg-white/80 backdrop-blur-[12px] rounded-[24px] p-6 border border-white/40 shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all duration-300';
  
  const hoverStyles = hover
    ? 'hover:shadow-medium hover:scale-[1.02] hover:-translate-y-1'
    : '';
  
  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`} style={style}>
      {children}
    </div>
  );
};

export default GlassCard;
