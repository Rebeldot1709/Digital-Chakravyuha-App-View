import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Shield,
  Trash2,
  Cpu,
  Zap,
  CornerDownLeft,
  Copy,
  Check,
  Download,
  Terminal,
  User,
  Radio,
  Layers,
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
  persona?: string;
}

export type ChatbotPersona = 'orchestrator' | 'maya_strategist' | 'sentinel_fast';
export type TaskSpeed = 'general' | 'fast';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-init-1',
    role: 'model',
    content: `Greetings, Defender. I am the **Master Orchestrator AI** of the Digital Chakravyuha, guarding the innermost Brahmanda Sanctum (Layer 7).

Architected upon the vision of **Abhishek Raj**, the 7 concentric defense rings are synchronized and operating at **100% containment integrity**:
* **Layer 1 (Vyuha Mukha)**: Ingress perimeter sentinels & kinetic eBPF scrubbers.
* **Layer 2 (Maya Vyuha)**: Autonomous deception honeypots & recursive mirages.
* **Layer 3 (Astra Vyuha)**: Deep opcode disassembler & zero-day anomaly nullifier.
* **Layer 4 (Setu Vyuha)**: Sub-microsecond (<0.04ms) inter-layer neural bridges.
* **Layer 5 (Bandhana Vyuha)**: The world's first autonomous AI containment cage.
* **Layer 6 (Brahmastra Vyuha)**: Post-quantum Crystals-Kyber lattice shield.
* **Layer 7 (Brahmanda Core)**: Sovereign unbreakable core (0.00% breach index).

Ask me anything regarding threat vector analysis, adversarial containment protocols, or defensive architecture.`,
    timestamp: 'Just now',
    persona: 'orchestrator',
  },
];

const SUGGESTED_PROMPTS = [
  'How does Layer 5 contain autonomous rogue AI models?',
  'Why does Shor’s quantum algorithm fail against Layer 6?',
  'Explain how Layer 4 neural bridges synchronize threat locks in sub-milliseconds.',
  'How does Maya Vyuha trap hackers in infinite synthetic sandboxes?',
  'Analyze a potential prompt injection payload against the defense core.',
];

export const GeminiChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [persona, setPersona] = useState<ChatbotPersona>('orchestrator');
  const [taskSpeed, setTaskSpeed] = useState<TaskSpeed>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

let chatMsgSeqCounter = 100;

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputText).trim();
    if (!textToSend || isLoading) return;

    chatMsgSeqCounter += 1;
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}-${chatMsgSeqCounter}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      // Call server-side Gemini chat endpoint
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          persona,
          taskSpeed,
        }),
      });

      const data = await res.json();
      chatMsgSeqCounter += 1;
      const botReply: ChatMessage = {
        id: `bot-${Date.now()}-${chatMsgSeqCounter}`,
        role: 'model',
        content: data.reply || 'Master Orchestrator telemetric response received.',
        timestamp: new Date().toLocaleTimeString(),
        modelUsed: data.model,
        persona,
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error('Chat error:', err);
      chatMsgSeqCounter += 1;
      const fallbackReply: ChatMessage = {
        id: `bot-${Date.now()}-${chatMsgSeqCounter}`,
        role: 'model',
        content:
          '[MASTER ORCHESTRATOR AIR-GAP OVERRIDE]\nQuery logged. The 7 concentric rings report 100% containment integrity. Dynamic honeypot allocation remains at nominal capacity.',
        timestamp: new Date().toLocaleTimeString(),
        persona,
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        role: 'model',
        content: 'Conversation history reset. Master Orchestrator defense session reinitialized.',
        timestamp: new Date().toLocaleTimeString(),
        persona,
      },
    ]);
  };

  const handleExportChat = () => {
    const text = messages
      .map((m) => `[${m.timestamp}] ${m.role.toUpperCase()}:\n${m.content}\n`)
      .join('\n---\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chakravyuha-defense-chat-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col h-[680px]">
      {/* Header with Persona Switcher & Task Speed */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-rose-500 to-amber-500 p-0.5 shadow-lg shadow-indigo-950/60">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                Master Orchestrator AI Chatbot
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/50 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> GEMINI POWERED
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Interactive multi-turn AI advisor for defensive tactics, rogue model containment, and architecture.
            </p>
          </div>
        </div>

        {/* Roles & Task Speed Selectors */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {/* Persona Selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setPersona('orchestrator')}
              className={`px-2 py-1 rounded text-[10.5px] font-bold transition cursor-pointer ${
                persona === 'orchestrator'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Layer 7 Master Orchestrator (Core Sovereignty)"
            >
              👑 ORCHESTRATOR
            </button>
            <button
              onClick={() => setPersona('maya_strategist')}
              className={`px-2 py-1 rounded text-[10.5px] font-bold transition cursor-pointer ${
                persona === 'maya_strategist'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Layer 2 Maya Deception & Honeypot AI"
            >
              🎭 MAYA HONEYPOT
            </button>
            <button
              onClick={() => setPersona('sentinel_fast')}
              className={`px-2 py-1 rounded text-[10.5px] font-bold transition cursor-pointer ${
                persona === 'sentinel_fast'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Layer 1 & 3 Sentinel Fast Packet Triage"
            >
              ⚡ SENTINEL (FAST)
            </button>
          </div>

          {/* Model Speed Option */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setTaskSpeed('general')}
              className={`px-2 py-1 rounded text-[10px] font-bold transition cursor-pointer ${
                taskSpeed === 'general' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="General Deep Tasks (gemini-3.8-flash)"
            >
              FLASH
            </button>
            <button
              onClick={() => setTaskSpeed('fast')}
              className={`px-2 py-1 rounded text-[10px] font-bold transition cursor-pointer ${
                taskSpeed === 'fast' ? 'bg-slate-800 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Fast Triage Tasks (gemini-3.1-flash-lite)"
            >
              LITE FAST
            </button>
          </div>

          <button
            onClick={handleExportChat}
            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800 transition cursor-pointer"
            title="Export chat history"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition cursor-pointer"
            title="Clear history"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="py-2.5 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono scrollbar-none border-b border-slate-800/80">
        <span className="text-slate-500 shrink-0 mr-1 flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" /> TACTICAL PROMPTS:
        </span>
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-full bg-slate-950 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-600/50 text-slate-300 hover:text-indigo-200 transition shrink-0 whitespace-nowrap cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Scrollable Message Thread */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1 select-text">
        {messages.map((msg, index) => (
          <div
            key={`${msg.id}-${index}`}
            className={`flex items-start gap-3 text-xs leading-relaxed ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'model' && (
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                  msg.persona === 'maya_strategist'
                    ? 'bg-amber-950/60 text-amber-400 border-amber-700/50'
                    : msg.persona === 'sentinel_fast'
                      ? 'bg-cyan-950/60 text-cyan-400 border-cyan-700/50'
                      : 'bg-indigo-950/60 text-indigo-400 border-indigo-700/50'
                }`}
              >
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 relative group shadow-md ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-none'
                  : 'bg-slate-950/90 border border-slate-800 text-slate-200 rounded-tl-none font-mono text-[11.5px]'
              }`}
            >
              {/* Persona Tag for Bot Messages */}
              {msg.role === 'model' && (
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1.5 border-b border-slate-800/80 pb-1">
                  <span className="font-bold text-slate-400 flex items-center gap-1.5">
                    {msg.persona === 'maya_strategist'
                      ? '🎭 MAYA HONEYPOT AI (LAYER 2)'
                      : msg.persona === 'sentinel_fast'
                        ? '⚡ SENTINEL TRIAGE (LAYER 1/3)'
                        : '👑 MASTER ORCHESTRATOR (LAYER 7 CORE)'}
                  </span>
                  <span className="text-slate-600">{msg.timestamp}</span>
                </div>
              )}

              {/* Message Content with Markdown Formatting */}
              <div className="whitespace-pre-wrap leading-relaxed space-y-1">
                {msg.content}
              </div>

              {/* Copy button */}
              <button
                onClick={() => handleCopyMessage(msg.id, msg.content)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                title="Copy text"
              >
                {copiedId === msg.id ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-indigo-900/60 border border-indigo-700/40 flex items-center justify-center shrink-0 text-white font-mono text-xs">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-950/60 border border-indigo-700/50 flex items-center justify-center shrink-0 text-indigo-400">
              <Bot className="w-4 h-4 animate-spin-slow" />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none p-3.5 text-xs font-mono text-cyan-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Orchestrating 7-Layer Neural Analysis...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask ${
              persona === 'maya_strategist'
                ? 'Maya Deception Strategist'
                : persona === 'sentinel_fast'
                  ? 'Sentinel Fast Triage'
                  : 'Master Orchestrator'
            } a defense question...`}
            disabled={isLoading}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-md ${
            isLoading || !inputText.trim()
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/50'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Dispatch</span>
        </button>
      </form>
    </div>
  );
};
