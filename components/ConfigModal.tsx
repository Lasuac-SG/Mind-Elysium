import React, { useState } from 'react';
import { SkillType, TriggerType, CustomRule } from '../types';
import SkillPortrait from './SkillPortrait';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  rules: CustomRule[];
  onAddRule: (trigger: TriggerType, skill: SkillType, text: string) => void;
  onDeleteRule: (id: string) => void;
}

const triggerLabels: Record<TriggerType, string> = {
    [TriggerType.TASK_ADD]: '当创建任务时',
    [TriggerType.TASK_COMPLETE]: '当完成任务时',
    [TriggerType.REWARD_BUY]: '当购买奖励时',
    [TriggerType.APP_OPEN]: '当打开应用时'
};

const skillLabels: Record<SkillType, string> = {
    [SkillType.LOGIC]: '逻辑',
    [SkillType.VOLITION]: '意志力',
    [SkillType.INLAND_EMPIRE]: '内陆帝国',
    [SkillType.ELECTROCHEMISTRY]: '电化学',
    [SkillType.EMPATHY]: '同理心',
    [SkillType.HALF_LIGHT]: '半光',
    [SkillType.AUTHORITY]: '权威',
};

const ConfigModal: React.FC<Props> = ({ isOpen, onClose, rules, onAddRule, onDeleteRule }) => {
    const [selectedTrigger, setSelectedTrigger] = useState<TriggerType>(TriggerType.TASK_COMPLETE);
    const [selectedSkill, setSelectedSkill] = useState<SkillType>(SkillType.ELECTROCHEMISTRY);
    const [customText, setCustomText] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!customText.trim()) return;
        onAddRule(selectedTrigger, selectedSkill, customText);
        setCustomText('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="bg-[#1a1c21] border-2 border-slate-600 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
                
                {/* Header */}
                <div className="p-5 border-b border-slate-600 flex justify-between items-center bg-[#121317]">
                    <h2 className="text-[#d68038] font-disco-serif text-2xl font-bold uppercase tracking-widest flex items-center gap-2">
                        <span className="text-3xl">✦</span> 思维内阁
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white text-3xl font-bold leading-none">×</button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    
                    {/* Add New Rule Form */}
                    <div className="bg-slate-800/30 p-6 border border-slate-700 mb-8 shadow-inner">
                        <h3 className="text-slate-300 font-disco-sans text-sm uppercase mb-4 font-bold tracking-wider border-b border-slate-700 pb-2">
                            植入新思维
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs text-slate-500 uppercase mb-2 font-bold tracking-wider">触发事件</label>
                                    <div className="relative">
                                        <select 
                                            value={selectedTrigger} 
                                            onChange={(e) => setSelectedTrigger(e.target.value as TriggerType)}
                                            className="w-full bg-[#121317] border-b-2 border-slate-600 text-slate-200 py-2 pl-2 pr-8 text-sm font-disco-sans focus:border-[#d68038] outline-none appearance-none rounded-none"
                                        >
                                            {Object.entries(triggerLabels).map(([key, label]) => (
                                                <option key={key} value={key}>{label}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">▼</div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 uppercase mb-2 font-bold tracking-wider">发言人格</label>
                                    <div className="relative">
                                        <select 
                                            value={selectedSkill} 
                                            onChange={(e) => setSelectedSkill(e.target.value as SkillType)}
                                            className="w-full bg-[#121317] border-b-2 border-slate-600 text-slate-200 py-2 pl-2 pr-8 text-sm font-disco-sans focus:border-[#d68038] outline-none appearance-none rounded-none"
                                        >
                                            {Object.entries(skillLabels).map(([key, label]) => (
                                                <option key={key} value={key}>{label}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">▼</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs text-slate-500 uppercase mb-2 font-bold tracking-wider">台词内容</label>
                                <textarea
                                    value={customText}
                                    onChange={(e) => setCustomText(e.target.value)}
                                    placeholder="输入你想听到的话..."
                                    className="input-disco w-full h-24 resize-none"
                                />
                            </div>

                            <button 
                                type="submit"
                                className="btn-disco primary w-full py-3 text-sm tracking-widest"
                            >
                                <span>写入思维</span>
                            </button>
                        </form>
                    </div>

                    {/* Existing Rules List */}
                    <div>
                        <h3 className="text-slate-300 font-disco-sans text-sm uppercase mb-4 font-bold border-b border-slate-700 pb-2 flex justify-between items-end">
                            <span>已内化的思维</span>
                            <span className="text-xs text-slate-500">{rules.length} / ∞</span>
                        </h3>
                        {rules.length === 0 ? (
                            <div className="text-slate-600 text-center py-8 italic font-disco-serif border border-dashed border-slate-800">
                                还没有自定义剧本。<br/>系统将使用默认随机语录。
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {rules.map(rule => (
                                    <div key={rule.id} className="flex gap-4 bg-[#121317] p-4 border border-slate-800 items-start group hover:border-slate-600 transition-colors">
                                        <div className="mt-1 shrink-0">
                                            <SkillPortrait skill={rule.skill} size="sm" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-[10px] text-[#d68038] font-bold uppercase tracking-wider border border-[#d68038] px-1 py-0.5">
                                                    {triggerLabels[rule.trigger]}
                                                </span>
                                                <button 
                                                    onClick={() => onDeleteRule(rule.id)}
                                                    className="text-slate-700 hover:text-red-500 transition-colors px-2 font-bold text-lg leading-none"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                            <div className="text-slate-300 font-disco-serif text-lg leading-relaxed italic">
                                                "{rule.text}"
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ConfigModal;