'use client';

import { useState, useEffect, useRef } from 'react';

interface JournalEntry {
  time: string;
  completed: string;
  next: string;
}

export function InterstitialJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [completedInput, setCompletedInput] = useState('');
  const [nextInput, setNextInput] = useState('');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true); // 默认收起
  const completedRef = useRef<HTMLTextAreaElement>(null);
  const nextRef = useRef<HTMLTextAreaElement>(null);

  // 从 localStorage 加载数据
  useEffect(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('journalDate');
    
    if (savedDate === today) {
      const savedEntries = localStorage.getItem('journalEntries');
      if (savedEntries) {
        setEntries(JSON.parse(savedEntries));
      }
    } else {
      // 新的一天，清空之前的数据
      localStorage.setItem('journalDate', today);
      localStorage.setItem('journalEntries', '[]');
    }
  }, []);

  // 保存到 localStorage
  const saveEntries = (newEntries: JournalEntry[]) => {
    localStorage.setItem('journalEntries', JSON.stringify(newEntries));
  };

  // 获取当前时间
  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  // 处理输入
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, type: 'completed' | 'next') => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      
      if (type === 'completed' && completedInput.trim()) {
        // 完成输入后跳到下一个
        nextRef.current?.focus();
      } else if (type === 'next') {
        // 在 next 输入框按 Enter，如果 completed 有内容就添加记录
        if (completedInput.trim()) {
          const newEntry: JournalEntry = {
            time: getCurrentTime(),
            completed: completedInput.trim(),
            next: nextInput.trim()
          };
          const newEntries = [newEntry, ...entries];
          setEntries(newEntries);
          saveEntries(newEntries);
          
          // 清空输入
          setCompletedInput('');
          setNextInput('');
          completedRef.current?.focus();
        }
      }
    }
  };

  // 导出数据
  const exportData = () => {
    setShowExportDialog(true);
  };

  // 生成导出文本
  const generateExportText = () => {
    return entries.map(entry => {
      return `${entry.time}\n✓ ${entry.completed}\n→ ${entry.next}\n`;
    }).join('\n');
  };

  // 复制到剪贴板
  const copyToClipboard = () => {
    const text = generateExportText();
    navigator.clipboard.writeText(text).then(() => {
      alert('已复制到剪贴板！');
    });
  };

  // 下载文件
  const downloadFile = () => {
    const text = generateExportText();
    const today = new Date().toISOString().split('T')[0];
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `间歇日记-${today}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 确认并清空
  const confirmAndClear = () => {
    setEntries([]);
    saveEntries([]);
    setShowExportDialog(false);
  };

  return (
    <>
      {/* 展开按钮 - 使用日历图标 */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-2.5 rounded-lg transition-all duration-200 hover:bg-white/10"
          style={{
            backgroundColor: 'rgba(25, 25, 25, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
          title="展开间歇日记"
        >
          <svg className="w-5 h-5 text-white/75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {/* 主面板 - 增加透明度 */}
      <div 
        className={`w-[320px] h-[calc(100vh-40px)] my-5 mr-5 text-white flex flex-col shadow-2xl rounded-2xl transition-all duration-300 ${
          isCollapsed ? 'translate-x-[360px]' : 'translate-x-0'
        }`}
        style={{
          backgroundColor: 'rgba(28, 28, 28, 0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* 顶部标题和按钮 */}
        <div className="px-5 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h2 className="text-sm font-normal text-white/90 leading-tight">间歇日记</h2>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={exportData}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200"
                title="导出今日日记"
              >
                <svg className="w-4 h-4 text-white/75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <button
                onClick={() => setIsCollapsed(true)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200"
                title="折叠"
              >
                <svg className="w-4 h-4 text-white/75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div className="h-px bg-white/10 mx-5"></div>

        {/* 输入部分 */}
        <div className="px-5 py-3">
          <div className="space-y-2">
            {/* 刚完成的事情 - 时间和内容在同一行 */}
            <div className="flex items-start gap-2">
              <span className="text-white/55 font-mono text-xs mt-1 flex-shrink-0">{getCurrentTime()}</span>
              <span className="text-white/55 mt-1 flex-shrink-0 text-xs w-3 text-center">✓</span>
              <textarea
                ref={completedRef}
                value={completedInput}
                onChange={(e) => setCompletedInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'completed')}
                placeholder="刚完成的事..."
                className="flex-1 bg-transparent text-white/90 text-xs resize-none focus:outline-none placeholder:text-white/35 leading-snug py-1"
                rows={1}
                style={{ caretColor: '#22c55e' }}
              />
            </div>

            {/* 接下来要做的事 - 与上面左对齐 */}
            <div className="flex items-start gap-2">
              <span className="text-white/55 font-mono text-xs mt-1 flex-shrink-0 invisible">{getCurrentTime()}</span>
              <span className="text-white/55 mt-1 flex-shrink-0 text-xs w-3 text-center">→</span>
              <textarea
                ref={nextRef}
                value={nextInput}
                onChange={(e) => setNextInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'next')}
                placeholder="接下来要做的..."
                className="flex-1 bg-transparent text-white/90 text-xs resize-none focus:outline-none placeholder:text-white/35 leading-snug py-1"
                rows={1}
                style={{ caretColor: '#3b82f6' }}
              />
            </div>
          </div>
        </div>
        
        {/* 分隔线 */}
        <div className="h-px bg-white/10 mx-5"></div>

        {/* 历史记录 */}
        <div className="flex-1 overflow-y-auto px-5 py-3 custom-scrollbar">
          <div className="space-y-2.5">
            {entries.map((entry, index) => (
              <div key={index} className="text-xs leading-tight">
                <span className="text-white/50 font-mono">{entry.time}</span>
                {entry.completed && (
                  <>
                    <span className="text-white/50 mx-1.5">✓</span>
                    <span className="text-white/85">{entry.completed}</span>
                  </>
                )}
                {entry.next && (
                  <>
                    <span className="text-white/50 mx-1.5">/</span>
                    <span className="text-white/50 mr-1.5">→</span>
                    <span className="text-white/70">{entry.next}</span>
                  </>
                )}
              </div>
            ))}
            
            {entries.length === 0 && (
              <div className="text-center text-white/30 text-xs py-20">
                暂无记录
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 导出对话框 */}
      {showExportDialog && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <div 
            className="rounded-2xl p-8 w-[560px] max-w-[90vw] shadow-2xl"
            style={{
              backgroundColor: 'rgba(30, 30, 30, 0.92)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {/* 标题 */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-normal text-white/85">导出今日日记</h3>
              <button
                onClick={() => setShowExportDialog(false)}
                className="text-white/50 hover:text-white/80 transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 说明文字 */}
            <p className="text-white/55 text-sm mb-5 leading-relaxed">
              你可以复制或下载今天的日记。导出后，今日的记录将被清空。
            </p>

            {/* 预览区域 */}
            <div 
              className="rounded-xl p-5 mb-6 max-h-[400px] overflow-y-auto custom-scrollbar"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <pre className="text-white/75 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                {generateExportText() || '暂无记录'}
              </pre>
            </div>

            {/* 按钮组 */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={copyToClipboard}
                className="px-5 py-2.5 bg-white/8 hover:bg-white/12 text-white/85 rounded-xl transition-all duration-200 flex items-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="1.5"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeWidth="1.5"/>
                </svg>
                复制
              </button>
              <button
                onClick={downloadFile}
                className="px-5 py-2.5 bg-white/8 hover:bg-white/12 text-white/85 rounded-xl transition-all duration-200 flex items-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                下载
              </button>
              <button
                onClick={confirmAndClear}
                className="px-5 py-2.5 bg-white/85 hover:bg-white/95 text-black rounded-xl transition-all duration-200 font-medium text-sm"
              >
                确认并清空
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

