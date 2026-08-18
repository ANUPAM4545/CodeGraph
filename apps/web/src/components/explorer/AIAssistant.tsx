import React, { useState } from 'react';
import { Send, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { aiService } from '../../lib/graph/api';
import SourceCitation from './SourceCitation';

interface AIAssistantProps {
  repoId: string;
  versionId: string;
  selectedNodeId?: string;
  aiReady: boolean;
}

export default function AIAssistant({ repoId, versionId, selectedNodeId, aiReady }: AIAssistantProps) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string, sources?: any[]}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !aiReady) return;

    const q = question;
    setQuestion('');
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setLoading(true);
    setError(null);

    try {
      const res = await aiService.askAIQuery(repoId, versionId, q, selectedNodeId);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.answer,
        sources: res.sources
      }]);
    } catch (err: any) {
      setError(err.message || "Failed to get AI response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200 w-96 font-sans">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <Sparkles className="w-4 h-4 mr-2" />
          CodeGraph AI
        </h3>
        {!aiReady && (
          <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-200 flex items-center">
            <Loader2 className="w-3 h-3 animate-spin mr-1" />
            Indexing...
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 text-sm mt-10">
            Ask questions about this repository version.
            {selectedNodeId && <p className="mt-2 text-xs">Asking with context of selected node.</p>}
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] rounded px-3 py-2 text-sm ${msg.role === 'user' ? 'bg-black text-white' : 'bg-gray-100 text-gray-900 border border-gray-200'}`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
            
            {msg.sources && msg.sources.length > 0 && (
              <div className="mt-2 space-y-1.5 w-full pr-8">
                <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Sources Cited</div>
                {msg.sources.map((src, idx) => (
                  <SourceCitation 
                    key={idx}
                    sourceType={src.source_type}
                    filePath={src.file_path}
                    symbolName={src.symbol_name}
                    lineStart={src.line_start}
                    lineEnd={src.line_end}
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center text-gray-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Thinking...
          </div>
        )}
        
        {error && (
          <div className="flex items-center text-red-600 bg-red-50 p-2 rounded text-sm border border-red-200">
            <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex relative">
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            disabled={!aiReady || loading}
            placeholder={aiReady ? "Ask about the codebase..." : "Waiting for index..."}
            className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black disabled:bg-gray-50 disabled:text-gray-500"
          />
          <button 
            type="submit" 
            disabled={!aiReady || loading || !question.trim()}
            className="absolute right-1.5 top-1.5 p-1 text-gray-400 hover:text-black disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
