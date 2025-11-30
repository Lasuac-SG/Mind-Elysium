
import React, { useEffect } from 'react';
import { DialogueMessage, SkillType } from '../types';
import SkillPortrait from './SkillPortrait';

interface Props {
  history: DialogueMessage[];
  activeMessage: DialogueMessage | undefined;
  queueSize: number;
  onAdvance: () => void;
}

const skillNameMap: Record<SkillType, string> = {
  [SkillType.LOGIC]: '逻辑',
  [SkillType.VOLITION]: '意志力',
  [SkillType.INLAND_EMPIRE]: '从容自若', // Matching screenshot name
  [SkillType.ELECTROCHEMISTRY]: '电化学',
  [SkillType.EMPATHY]: '同理心',
  [SkillType.HALF_LIGHT]: '半光',
  [SkillType.AUTHORITY]: '权威',
};

const DialogueBox: React.FC<Props> = ({ history, activeMessage, queueSize, onAdvance }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (activeMessage) {
          onAdvance();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onAdvance, activeMessage]);

  // Display more history, closer to the game's log
  const displayedHistory = history.slice(-5); 

  return (
    <div className="w-full h-full flex flex-col justify-end pointer-events-none">
      <div className="w-full max-w-md ml-auto flex flex-col justify-end">
        
        {/* Messages Container */}
        <div className="flex flex-col-reverse overflow-hidden pointer-events-auto bg-black/70 backdrop-blur-sm p-4">
          
          {/* Active Message */}
          {activeMessage && (
            <div className="relative mt-4 animate-in fade-in duration-500">
                <div className="absolute -left-[104px] bottom-0 hidden lg:block">
                    <SkillPortrait skill={activeMessage.skill} size="md" />
                </div>
                <div>
                  <h4 className="font-disco-serif text-xl font-bold text-yellow-400">
                      {skillNameMap[activeMessage.skill] || activeMessage.skill} -
                  </h4>
                  <p className="font-disco-serif text-xl leading-relaxed text-slate-100 my-2">
                      {activeMessage.text}
                  </p>
                </div>
            </div>
          )}
          
          {/* History Messages */}
          {displayedHistory.map((msg, index) => (
            <div 
              key={msg.id} 
              className="mb-4 transition-opacity duration-300 opacity-60"
            >
              <h4 className="font-disco-serif text-xl font-bold text-yellow-600">
                {skillNameMap[msg.skill] || msg.skill} -
              </h4>
              <p className="font-disco-serif text-xl leading-relaxed text-slate-300">
                {msg.text}
              </p>
            </div>
          ))}
            
          {/* System-style message like in the screenshot */}
          {activeMessage && (
             <div className="border-b border-slate-700 mb-4 pb-4">
                <p className="text-slate-300 font-disco-sans text-lg">任务完成: 找到另一只鞋</p>
                <p className="text-slate-300 font-disco-sans text-lg">经验: +10</p>
             </div>
          )}
        </div>

        {/* Continue Button */}
        {activeMessage && (
          <div className="w-full mt-2 pointer-events-auto">
            <button 
              onClick={onAdvance} 
              className="w-full py-3 bg-[#8c2a19] hover:bg-[#a53b27] text-white font-disco-sans font-bold uppercase text-lg tracking-widest transition-colors"
            >
              {queueSize > 1 ? `继续 ▶` : '结束 ▶'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DialogueBox;
