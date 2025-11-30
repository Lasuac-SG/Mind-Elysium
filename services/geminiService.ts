import { GoogleGenAI } from "@google/genai";
import { SkillType } from "../types";

// Safety settings using string literals to avoid import version mismatches
const SAFETY_SETTINGS = [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
];

const SYSTEM_INSTRUCTION_TEXT = `
你不是AI，你是《极乐迪斯科》(Disco Elysium) 中的人格技能。
你正在脑海中对宿主（用户）的行为发表评论。

**规则:**
1. **中文回答**。
2. **极简短** (15字以内)。
3. 风格：黑色幽默、神经质、甚至有点疯狂。
4. 此时你的宿主刚完成了一个动作，或者在查看钱包。

**人格:**
- 逻辑 (Logic): 冷酷，计算收益，只看数字。
- 意志力 (Volition): 严肃，像个教官，强调责任。
- 内陆帝国 (Inland Empire): 看到事物背后的灵魂，神神叨叨。
- 电化学 (Electrochemistry): 渴望多巴胺，渴望消费，渴望偷懒。
- 权威 (Authority): 傲慢，渴望掌控一切。
- 同理心 (Empathy): 温柔，但也容易感伤。
`;

const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// --- OFFLINE FALLBACK DATABASE ---
// Used when API fails, is blocked, or offline.
const OFFLINE_QUOTES: Record<SkillType, string[]> = {
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

const getRandomOfflineQuote = (skill: SkillType): string => {
    const quotes = OFFLINE_QUOTES[skill] || OFFLINE_QUOTES[SkillType.LOGIC];
    return quotes[Math.floor(Math.random() * quotes.length)];
};

export const generateSkillReaction = async (
  skill: SkillType,
  action: string,
  details: string,
  balance: number
): Promise<string> => {
  // 1. Immediate fallback if no API key (Offline Mode)
  if (!ai) {
    console.log("No API Key, using offline mode.");
    return getRandomOfflineQuote(skill);
  }

  const fullPrompt = `
${SYSTEM_INSTRUCTION_TEXT}

[当前状态]
角色: ${skill}
行为: ${action} (${details})
余额: ₻${balance.toFixed(2)}

评论:
`;

  try {
    // 2. Structured API Call
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        role: 'user',
        parts: [{ text: fullPrompt }]
      },
      config: {
        temperature: 0.9,
        maxOutputTokens: 60,
        safetySettings: SAFETY_SETTINGS as any, // Type cast to avoid enum version issues
      },
    });

    const text = response.text;
    
    // 3. Fallback if response is empty (Safety Filter triggered)
    if (!text) {
        console.warn("Gemini returned empty text (likely filtered). Using offline quote.");
        return getRandomOfflineQuote(skill);
    }

    return text.trim();
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // 4. Fallback on Network/API Error
    return getRandomOfflineQuote(skill);
  }
};