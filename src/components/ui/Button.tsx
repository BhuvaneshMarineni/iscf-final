import { ArrowRight, Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes, forwardRef, useRef } from 'react';
import Link from 'next/link';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'hero';
  isLoading?: boolean;
  showArrow?: boolean;
  href?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false,
    showArrow = false,
    href,
    className = '',
    disabled,
    onClick,
    ...props 
  }, ref) => {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    
    const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
      const button = buttonRef.current;
      if (!button) return;
      
      const circle = document.createElement('span');
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;
      const rect = button.getBoundingClientRect();
      
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${event.clientX - rect.left - radius}px`;
      circle.style.top = `${event.clientY - rect.top - radius}px`;
      circle.style.position = 'absolute';
      circle.style.borderRadius = '50%';
      circle.style.transform = 'scale(0)';
      circle.style.animation = 'ripple 600ms linear';
      circle.style.backgroundColor = 'rgba(255, 255, 255, 0.35)';
      circle.style.pointerEvents = 'none';
      
      const ripple = button.getElementsByClassName('ripple')[0];
      if (ripple) {
        ripple.remove();
      }
      
      circle.classList.add('ripple');
      button.appendChild(circle);
      
      setTimeout(() => circle.remove(), 600);
    };
    
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      createRipple(event);
      onClick?.(event);
    };
    
    const baseStyles = 'relative overflow-hidden inline-flex items-center justify-center font-semibold rounded-[18px] transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';
    
    const variants = {
      primary: 'bg-gradient-primary text-white shadow-[0_10px_40px_rgba(37,99,235,0.25)] hover:shadow-[0_20px_50px_rgba(37,99,235,0.35)] hover:-translate-y-[3px]',
      secondary: 'bg-white text-[#0F172A] border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:-translate-y-[3px]',
      outline: 'bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50 hover:-translate-y-[3px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_40px_rgba(37,99,235,0.15)]',
      ghost: 'text-[#64748B] hover:text-[#0F172A] hover:bg-secondary-100 hover:-translate-y-[3px]',
    };
    
    const sizes = {
      sm: 'px-4 h-10 text-sm',
      md: 'px-6 h-12 text-base',
      lg: 'px-8 h-14 text-lg',
      hero: 'px-10 h-14 lg:h-[56px] text-base lg:text-lg',
    };
    
    const buttonContent = (
      <>
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
        ) : null}
        {children}
        {showArrow && !isLoading && (
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        )}
      </>
    );
    
    if (href) {
      return (
        <Link
          href={href}
          className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} group`}
        >
          {buttonContent}
        </Link>
      );
    }
    
    return (
      <button
        ref={(node) => {
          buttonRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} group`}
        disabled={disabled || isLoading}
        onClick={handleClick}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
