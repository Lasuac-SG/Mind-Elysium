
import React, { useState } from 'react';
import { Task, Reward, ViewMode } from '../types';

interface Props {
  mode: 'TASKS' | 'STORE'; // Controlled by parent
  tasks: Task[];
  rewards: Reward[];
  balance: number;
  onAddTask: (text: string, difficulty: Task['difficulty']) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onAddReward: (text: string, cost: number) => void;
  onBuyReward: (id: string) => void;
  onDeleteReward: (id: string) => void;
  onClose: () => void; // Return to HUB
}

const QuestLog: React.FC<Props> = ({ 
  mode,
  tasks, 
  rewards,
  balance,
  onAddTask, 
  onToggleTask, 
  onDeleteTask,
  onAddReward,
  onBuyReward,
  onDeleteReward,
  onClose
}) => {
  // Task Form State
  const [newTaskText, setNewTaskText] = useState('');
  const [difficulty, setDifficulty] = useState<Task['difficulty']>('Medium');

  // Reward Form State
  const [newRewardText, setNewRewardText] = useState('');
  const [newRewardCost, setNewRewardCost] = useState<string>('10');

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    onAddTask(newTaskText, difficulty);
    setNewTaskText('');
  };

  const handleRewardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRewardText.trim() || !newRewardCost) return;
    const cost = parseFloat(newRewardCost);
    if (isNaN(cost) || cost <= 0) return;
    
    onAddReward(newRewardText, cost);
    setNewRewardText('');
  };

  const getDifficultyColor = (d: string) => {
    switch (d) {
      case 'Trivial': return 'text-white';
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-orange-500';
      case 'Impossible': return 'text-red-600';
      default: return 'text-slate-400';
    }
  };

  const difficultyMap: Record<string, string> = {
    'Trivial': '微不足道',
    'Easy': '简单',
    'Medium': '普通',
    'Hard': '困难',
    'Impossible': '不可能'
  };

  const difficultyValue: Record<string, number> = {
    'Trivial': 5.00,
    'Easy': 10.00,
    'Medium': 25.00,
    'Hard': 50.00,
    'Impossible': 100.00
  };

  return (
    <div className="flex flex-col h-full bg-[#121317] relative animate-in fade-in duration-300">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-700 bg-[#0e0f12]">
          <h2 className="text-2xl md:text-3xl text-slate-200 font-disco-serif uppercase tracking-widest font-bold">
              {mode === 'TASKS' ? '待办事项' : '便利店'}
          </h2>
          <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-[#d68038] font-disco-serif text-2xl font-bold">
                    ₻{balance.toFixed(2)}
                </div>
              </div>
              <button 
                onClick={onClose}
                className="btn-disco px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white border-slate-500"
              >
                  <span className="font-bold">← 返回意识</span>
              </button>
          </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 max-w-5xl mx-auto w-full">
      
      {/* TASKS VIEW */}
      {mode === 'TASKS' && (
        <div className="space-y-8">
          {/* Input */}
          <form onSubmit={handleTaskSubmit} className="bg-[#1a1c21] p-6 border border-slate-700 shadow-[5px_5px_0px_rgba(0,0,0,0.5)]">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="需要做什么？"
              className="input-disco w-full text-xl"
              autoFocus
            />
            <div className="flex flex-wrap gap-4 items-center mt-6">
              {(['Trivial', 'Easy', 'Medium', 'Hard', 'Impossible'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`px-3 py-2 text-xs uppercase font-bold tracking-wider border whitespace-nowrap flex flex-col items-center min-w-[60px] transition-all transform skew-x-[-10deg] ${
                    difficulty === d 
                      ? 'bg-[#d68038] text-black border-[#d68038] -translate-y-1 shadow-lg' 
                      : 'bg-transparent text-slate-500 border-slate-700 hover:border-slate-500 hover:text-slate-300'
                  }`}
                >
                  <span className="skew-x-[10deg]">{difficultyMap[d]}</span>
                  <span className="text-[10px] opacity-80 skew-x-[10deg]">+₻{difficultyValue[d]}</span>
                </button>
              ))}
              <div className="flex-1"></div>
              <button 
                type="submit" 
                className="btn-disco primary px-8 py-3 text-sm"
              >
                <span>添加任务</span>
              </button>
            </div>
          </form>

          {/* Task List */}
          <div className="space-y-4">
            {tasks.length === 0 && (
                <div className="text-center text-slate-600 mt-20 font-disco-sans uppercase tracking-widest text-lg">
                    笔记本是空的。<br/>这很好，还是说很糟？
                </div>
            )}
            {tasks.filter(t => !t.completed).map((task) => (
              <div 
                key={task.id} 
                className="group relative p-4 border-l-[6px] border-l-slate-600 border-t border-r border-b border-slate-800 bg-[#1a1c21] hover:border-l-[#d68038] transition-all hover:bg-[#20232a] shadow-sm hover:shadow-md"
              >
                <div className="flex items-start gap-6">
                    <button
                        onClick={() => onToggleTask(task.id)}
                        className="mt-1 w-8 h-8 border-2 border-slate-500 hover:border-[#d68038] hover:bg-[#d68038]/10 flex items-center justify-center shrink-0 transition-all"
                        title="完成任务"
                    >
                    </button>
                    
                    <div className="flex-1">
                        <div className="font-disco-serif text-xl md:text-2xl leading-tight text-slate-200">
                            {task.text}
                        </div>
                        <div className={`text-xs uppercase font-bold mt-3 flex items-center gap-4 ${getDifficultyColor(task.difficulty)}`}>
                            <span className="border border-current px-2 py-0.5">{difficultyMap[task.difficulty]}</span>
                            <span className="bg-black/40 px-2 py-0.5 text-[#d68038] border border-[#d68038]/30">报酬: ₻{task.rewardValue.toFixed(2)}</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => onDeleteTask(task.id)}
                        className="btn-disco danger px-3 py-1 text-sm opacity-0 group-hover:opacity-100 transition-opacity self-center"
                    >
                        <span>删除</span>
                    </button>
                </div>
              </div>
            ))}

            {/* Completed Tasks (Collapsed style) */}
            {tasks.filter(t => t.completed).length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-800 opacity-60 hover:opacity-100 transition-opacity">
                <h3 className="text-slate-500 font-disco-sans text-sm uppercase mb-4 tracking-widest font-bold">已归档的事项</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {tasks.filter(t => t.completed).map((task) => (
                  <div key={task.id} className="flex items-center justify-between py-2 px-3 border border-slate-800 bg-black/20 text-slate-600">
                    <span className="line-through text-sm font-disco-serif truncate flex-1 mr-4">{task.text}</span>
                    <span className="text-xs text-green-800 font-bold whitespace-nowrap">+₻{task.rewardValue}</span>
                  </div>
                ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STORE VIEW */}
      {mode === 'STORE' && (
        <div className="space-y-8">
          {/* Add Reward Form */}
          <form onSubmit={handleRewardSubmit} className="bg-[#1a1c21] p-6 border border-slate-700 shadow-[5px_5px_0px_rgba(0,0,0,0.5)] flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1 w-full">
                     <label className="block text-xs text-slate-500 uppercase mb-2 font-bold tracking-wider">商品名称</label>
                     <input
                        type="text"
                        value={newRewardText}
                        onChange={(e) => setNewRewardText(e.target.value)}
                        placeholder="定义一个奖励..."
                        className="input-disco w-full text-lg"
                        autoFocus
                    />
                </div>
                <div className="w-full md:w-32">
                    <label className="block text-xs text-[#d68038] uppercase mb-2 font-bold tracking-wider">价格 (₻)</label>
                    <input
                        type="number"
                        value={newRewardCost}
                        onChange={(e) => setNewRewardCost(e.target.value)}
                        className="input-disco w-full font-bold text-[#d68038] text-lg"
                    />
                </div>
                <button 
                    type="submit" 
                    className="btn-disco primary w-full md:w-auto px-8 py-3 text-sm"
                >
                    <span>上架</span>
                </button>
          </form>

          {/* Rewards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {rewards.length === 0 && (
                <div className="col-span-full text-center text-slate-600 mt-20 font-disco-sans uppercase tracking-widest text-lg">
                    货架是空的。<br/>这就是虚无主义吗？
                </div>
            )}
            {rewards.map(reward => {
                const canAfford = balance >= reward.cost;
                return (
                    <div 
                        key={reward.id}
                        className={`group p-6 border-2 flex flex-col justify-between transition-all min-h-[140px] relative ${
                            canAfford 
                            ? 'border-slate-600 bg-[#1a1c21] hover:border-[#d68038] hover:-translate-y-1 hover:shadow-lg' 
                            : 'border-slate-800 bg-slate-900 opacity-50 border-dashed'
                        }`}
                    >
                        <div>
                            <div className="font-disco-serif text-xl text-slate-200 font-bold mb-1">{reward.text}</div>
                            <div className="w-full h-px bg-slate-800 my-2"></div>
                            <div className="text-[#d68038] font-bold font-mono text-2xl">₻{reward.cost.toFixed(2)}</div>
                        </div>
                        
                        <div className="flex items-end justify-between mt-4">
                            <button 
                                onClick={() => onDeleteReward(reward.id)}
                                className="text-slate-700 hover:text-red-500 font-bold text-sm uppercase tracking-wider"
                            >
                                下架
                            </button>
                             <button 
                                onClick={() => onBuyReward(reward.id)}
                                disabled={!canAfford}
                                className={`btn-disco px-6 py-2 text-sm ${canAfford ? 'primary' : 'cursor-not-allowed opacity-50'}`}
                            >
                                <span>{canAfford ? '购买' : '余额不足'}</span>
                            </button>
                        </div>
                    </div>
                )
            })}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default QuestLog;
