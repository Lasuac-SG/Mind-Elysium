import React from 'react';
import { SkillType } from '../types';

interface Props {
  skill: SkillType;
  size?: 'sm' | 'md' | 'lg';
}

// Recreating the abstract art style of the portraits from the game
const SkillPortrait: React.FC<Props> = ({ skill, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-[88px] h-[104px]', // Dimensions from screenshot
    lg: 'w-24 h-28',
  };

  const renderArt = () => {
    switch (skill) {
      case SkillType.INLAND_EMPIRE:
        return (
          <div className="w-full h-full bg-black relative">
            {/* The small yellow square */}
            <div className="absolute top-[10px] left-[10px] w-[18px] h-[18px] bg-[#f2c545]"></div>
            {/* The main yellow profile shape */}
            <div className="absolute top-0 right-0 bottom-0 w-[65%] h-full bg-[#f2c545] clip-inland-empire"></div>
            {/* CSS for the custom shape */}
            <style>{`
              .clip-inland-empire {
                clip-path: polygon(100% 0, 100% 100%, 20% 100%, 0 80%, 25% 50%, 0 20%, 20% 0);
              }
            `}</style>
          </div>
        );
      // Add other skill art representations here
      default:
        // Default fallback style that still looks good
        return (
          <div className="w-full h-full bg-black relative flex items-center justify-center">
            <div className="font-disco-serif text-3xl font-black text-slate-700 select-none">?</div>
          </div>
        );
    }
  };

  return (
    <div className={`${sizeClasses[size]} shrink-0 overflow-hidden border-2 border-black shadow-lg`}>
       {renderArt()}
    </div>
  );
};

export default SkillPortrait;
