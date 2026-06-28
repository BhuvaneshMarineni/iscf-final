import Image from 'next/image';

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'default' | 'white' | 'dark';
  scrolled?: boolean;
}

const Logo = ({ className = '', showText = true, variant = 'default', scrolled = false }: LogoProps) => {
  const getColors = () => {
    switch (variant) {
      case 'white':
        return { text: 'text-white', subtext: 'text-white/80' };
      case 'dark':
        return { text: 'text-gray-900', subtext: 'text-gray-600' };
      default:
        return { text: 'text-gray-900', subtext: 'text-gray-600' };
    }
  };

  const colors = getColors();

  return (
    <div className={`flex items-center space-x-3 group ${className}`}>
      <div
        className="relative shrink-0 transition-all duration-300 ease-out"
        style={{ width: scrolled ? 34 : 48, height: scrolled ? 34 : 48 }}
      >
        <Image
          src="/images/ISCF.png"
          alt="ISCF Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <div className="transition-all duration-300 ease-out overflow-hidden">
          <h1
            className={`font-bold leading-tight transition-all duration-300 ease-out ${colors.text}`}
            style={{ fontSize: scrolled ? 18 : 22 }}
          >
            ISCF
          </h1>
          <p
            className={`transition-all duration-300 ease-out leading-tight ${colors.subtext}`}
            style={{ fontSize: scrolled ? 13 : 16 }}
          >
            International Student Christian Fellowship
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;