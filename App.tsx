
import React, { useState, useEffect, useRef } from 'react';
import { AppState, DialogueMessage, SkillType, Task, Reward, TriggerType, CustomRule, ViewMode } from './types';
import QuestLog from './components/QuestLog';
import DialogueBox from './components/DialogueBox';
import ConfigModal from './components/ConfigModal';
import { getNarratorResponse } from './services/narratorService';
import BottomBar from './components/BottomBar';

const uuid = () => Math.random().toString(36).substring(2, 15);

const INITIAL_STATE: AppState = {
  tasks: [],
  rewards: [],
  history: [],
  dialogueQueue: [],
  balance: 0.00,
  stats: {
    intellect: 3,
    psyche: 4, // Morale
    physique: 2, // Health
    motorics: 2,
  },
  customRules: []
};

const DIFFICULTY_VALUES = {
    'Trivial': 5.00,
    'Easy': 10.00,
    'Medium': 25.00,
    'Hard': 50.00,
    'Impossible': 100.00
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('mind-elysium-data');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });
  
  const [viewMode, setViewMode] = useState<ViewMode>('HUB');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  
  const pendingQueue = useRef<{trigger: TriggerType, skill?: SkillType}[]>([]);

  useEffect(() => {
    localStorage.setItem('mind-elysium-data', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (state.history.length === 0 && state.dialogueQueue.length === 0) {
      triggerSystem(TriggerType.APP_OPEN, SkillType.INLAND_EMPIRE);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enqueueMessages = (messages: {skill: SkillType, text: string}[]) => {
      const newDialogueMessages: DialogueMessage[] = messages.map(msg => ({
          id: uuid(),
          skill: msg.skill,
          text: msg.text,
          timestamp: Date.now()
      }));
      setState(prev => ({ ...prev, dialogueQueue: [...prev.dialogueQueue, ...newDialogueMessages] }));
  };

  const handleAdvanceDialogue = () => {
      if (state.dialogueQueue.length === 0) return;
      const [currentMessage, ...remainingQueue] = state.dialogueQueue;
      setState(prev => ({
          ...prev,
          history: [...prev.history, currentMessage],
          dialogueQueue: remainingQueue
      }));
  };

  const triggerSystem = (trigger: TriggerType, requestedSkill: SkillType | undefined = undefined) => {
      if (viewMode === 'HUB') {
          const responses = getNarratorResponse(trigger, requestedSkill || null, state.customRules || []);
          enqueueMessages(responses);
      } else {
          pendingQueue.current.push({ trigger, skill: requestedSkill });
      }
  };

  const flushQueue = () => {
      if (pendingQueue.current.length === 0) return;
      
      const uniqueEvents = pendingQueue.current.filter((v, i, a) => a.findIndex(t => t.trigger === v.trigger && t.skill === v.skill) === i);
      
      pendingQueue.current = [];

      const allResponses: {skill: SkillType, text: string}[] = [];
      uniqueEvents.forEach((event) => {
          const responses = getNarratorResponse(event.trigger, event.skill || null, state.customRules || []);
          allResponses.push(...responses);
      });
      enqueueMessages(allResponses);
  };

  const handleReturnToHub = () => {
      setViewMode('HUB');
      setTimeout(flushQueue, 300);
  };

  const handleAddTask = (text: string, difficulty: Task['difficulty']) => {
    const rewardValue = DIFFICULTY_VALUES[difficulty] || 10;
    const newTask: Task = {
      id: uuid(),
      text,
      completed: false,
      createdAt: Date.now(),
      difficulty,
      rewardValue
    };
    setState(prev => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
    triggerSystem(TriggerType.TASK_ADD);
  };

  const handleToggleTask = (id: string) => {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;

    if (task.completed) {
        setState(prev => ({
            ...prev,
            balance: prev.balance - task.rewardValue,
            tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: false } : t)
        }));
        return;
    }

    setState(prev => ({
      ...prev,
      balance: prev.balance + task.rewardValue,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: true } : t)
    }));
    triggerSystem(TriggerType.TASK_COMPLETE);
  };

  const handleDeleteTask = (id: string) => {
    setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  };

  const handleAddReward = (text: string, cost: number) => {
      const newReward: Reward = { id: uuid(), text, cost };
      setState(prev => ({ ...prev, rewards: [...prev.rewards, newReward] }));
  };

  const handleBuyReward = (id: string) => {
      const reward = state.rewards.find(r => r.id === id);
      if (!reward) return;
      if (state.balance < reward.cost) {
          if (viewMode === 'HUB') enqueueMessages([{ skill: SkillType.LOGIC, text: "余额不足。这是基本的数学问题。" }]);
          return; 
      }
      setState(prev => ({ ...prev, balance: prev.balance - reward.cost }));
      triggerSystem(TriggerType.REWARD_BUY);
  };

  const handleDeleteReward = (id: string) => {
      setState(prev => ({ ...prev, rewards: prev.rewards.filter(r => r.id !== id) }));
  };

  const handleAddCustomRule = (trigger: TriggerType, skill: SkillType, text: string) => {
      const newRule: CustomRule = { id: uuid(), trigger, skill, text };
      setState(prev => ({ ...prev, customRules: [newRule, ...(prev.customRules || [])] }));
  };

  const handleDeleteCustomRule = (id: string) => {
      setState(prev => ({ ...prev, customRules: (prev.customRules || []).filter(r => r.id !== id) }));
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#121317] text-slate-200 relative bg-cover bg-center" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/worn-dots.png')"}}>
      
      <ConfigModal 
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        rules={state.customRules || []}
        onAddRule={handleAddCustomRule}
        onDeleteRule={handleDeleteCustomRule}
      />

      {/* DIALOGUE PANE - positioned absolutely with padding for bottom bar */}
      <div className="absolute top-6 right-6 left-6 bottom-52 pointer-events-none hidden md:flex justify-end items-end">
          <div className="w-full max-w-sm h-full">
            <DialogueBox 
                history={state.history} 
                activeMessage={state.dialogueQueue[0]}
                queueSize={state.dialogueQueue.length}
                onAdvance={handleAdvanceDialogue}
            />
          </div>
      </div>
      
      {/* UNIFIED BOTTOM BAR */}
      <BottomBar 
        physique={state.stats.physique}
        psyche={state.stats.psyche}
        onTasksClick={() => setViewMode('TASKS')}
        onStoreClick={() => setViewMode('STORE')}
        onConfigClick={() => setIsConfigOpen(true)}
      />

      {/* FOCUS MODE OVERLAY */}
      {viewMode !== 'HUB' && (
          <div className="absolute inset-0 z-50 flex">
              <div className="w-full h-full md:w-[60%] md:shadow-[10px_0_50px_rgba(0,0,0,0.8)] z-50">
                <QuestLog 
                    mode={viewMode as 'TASKS' | 'STORE'}
                    tasks={state.tasks} 
                    rewards={state.rewards}
                    balance={state.balance}
                    onAddTask={handleAddTask} 
                    onToggleTask={handleToggleTask}
                    onDeleteTask={handleDeleteTask}
                    onAddReward={handleAddReward}
                    onBuyReward={handleBuyReward}
                    onDeleteReward={handleDeleteReward}
                    onClose={handleReturnToHub}
                />
              </div>
              <div className="hidden md:block flex-1 bg-black/80 backdrop-blur-sm" onClick={handleReturnToHub}></div>
          </div>
      )}

    </div>
  );
};

export default App;