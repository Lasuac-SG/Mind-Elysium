import { SkillType, TriggerType, CustomRule } from "../types";

// Default fallback quotes to ensure the app is never silent
const DEFAULT_QUOTES: Record<SkillType, string[]> = {
    [SkillType.LOGIC]: [
        "这笔账算不过来。",
        "效率。我们需要的是效率。",
        "数字不会撒谎，但你会。",
        "资产负债表在哭泣。",
        "这不合逻辑，但很赚钱。",
        "投入产出比尚可接受。"
    ],
    [SkillType.VOLITION]: [
        "坚持住，还没到休息的时候。",
        "不要让那些杂念占据你的大脑。",
        "挺直腰板，警探。",
        "这就是成长的代价。",
        "控制你自己。",
        "如果你现在放弃，一切就都完了。"
    ],
    [SkillType.INLAND_EMPIRE]: [
        "空气中弥漫着旧纸币和遗憾的味道。",
        "这不仅仅是一个任务，这是一个预兆。",
        "某种东西在阴影里看着我们。",
        "我听见硬币在口袋里唱歌。",
        "世界在崩塌，而我们在扫地。",
        "你的领带在试图勒死你。"
    ],
    [SkillType.ELECTROCHEMISTRY]: [
        "噢……就是这种感觉！再来一点！",
        "别管那些工作了，去买点好玩的！",
        "我们需要糖分，需要酒精，需要多巴胺！",
        "看看那个奖励……它在发光！",
        "只要一点点放纵，没人会知道的。",
        "我的神经末梢在跳舞。"
    ],
    [SkillType.AUTHORITY]: [
        "让他们看看谁才是老大。",
        "尊重是买不来的，但恐惧可以。",
        "不要低头，皇冠会掉。",
        "这世界只听得懂一种语言：力量。",
        "你太软弱了。",
        "掌控局势。"
    ],
    [SkillType.EMPATHY]: [
        "我感到了……一种淡淡的忧伤。",
        "对自己好一点。",
        "这很难，我知道这很难。",
        "也许这世界还是有一点温暖的。",
        "每个人都在挣扎。",
        "心碎的声音是无声的。"
    ],
    [SkillType.HALF_LIGHT]: [
        "快点！没时间了！",
        "他们来了！他们知道你没完成任务！",
        "跑！或者战斗！",
        "那种恐惧感……在脊椎上爬行。",
        "如果不做完，我们会死的！"
    ]
};

// Helper to pick a random quote
const getRandomDefaultQuote = (skill: SkillType): string => {
    const quotes = DEFAULT_QUOTES[skill] || DEFAULT_QUOTES[SkillType.LOGIC];
    return quotes[Math.floor(Math.random() * quotes.length)];
};

export interface NarratorResponse {
    skill: SkillType;
    text: string;
}

/**
 * Determines what text should be displayed.
 * 
 * Logic Update:
 * 1. Finds ALL matching Custom Rules.
 * 2. If matching rules exist, returns ALL of them (to simulate multiple voices).
 * 3. If no rules exist, returns a SINGLE default quote.
 */
export const getNarratorResponse = (
    trigger: TriggerType,
    requestedSkill: SkillType | null, 
    customRules: CustomRule[]
): NarratorResponse[] => {
    
    // 1. Filter rules that match the current trigger
    const matchingRules = customRules.filter(r => r.trigger === trigger);

    // 2. If we have matching custom rules, return ALL of them
    if (matchingRules.length > 0) {
        // If a specific skill was requested, prefer rules for that skill, but for general triggers, show all.
        // If the user *specifically* asked for a skill (rare in this app structure usually), we might filter.
        // But the prompt request is "if multiple thoughts point to same event... trigger all".
        
        // If requestedSkill is present (e.g. from an explicit button click if we had one), maybe we filter.
        // But for event triggers like TASK_ADD, we want the chorus.
        if (requestedSkill) {
            const specificRules = matchingRules.filter(r => r.skill === requestedSkill);
            if (specificRules.length > 0) {
                 return specificRules.map(r => ({ skill: r.skill, text: r.text }));
            }
        }

        return matchingRules.map(r => ({ skill: r.skill, text: r.text }));
    }

    // 3. Fallback: No custom rule found. Use default quotes.
    // If no skill was requested, we need to default one based on context
    let skillToUse = requestedSkill;
    if (!skillToUse) {
        switch (trigger) {
            case TriggerType.TASK_ADD: skillToUse = SkillType.LOGIC; break;
            case TriggerType.TASK_COMPLETE: skillToUse = SkillType.VOLITION; break;
            case TriggerType.REWARD_BUY: skillToUse = SkillType.ELECTROCHEMISTRY; break;
            default: skillToUse = SkillType.INLAND_EMPIRE;
        }
    }

    return [{
        skill: skillToUse,
        text: getRandomDefaultQuote(skillToUse)
    }];
};