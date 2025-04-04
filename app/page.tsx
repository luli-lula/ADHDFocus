'use client';

import { useEffect, useState, useRef } from 'react';
import { CircularTimer } from '@/components/ui/CircularTimer';

// 背景视频列表
const videos = ['/forestvideosmall.mp4', '/forest2_small.mp4', '/forest3_small.mp4'];

export default function Home() {
  // 状态管理
  const [selectedVideo, setSelectedVideo] = useState(''); // 当前选中的视频
  const [selectedMinutes, setSelectedMinutes] = useState(0); // 选中的分钟数
  const [previewMinutes, setPreviewMinutes] = useState<number | null>(null); // 预览的分钟数
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null); // 剩余秒数
  const [isRunning, setIsRunning] = useState(false); // 倒计时是否在运行
  const audioRef = useRef<HTMLAudioElement | null>(null); // 音频引用

  // 初始化效果
  useEffect(() => {
    // 随机选择背景视频
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    setSelectedVideo(randomVideo);

    // 初始化音频，但不立即加载
    audioRef.current = new Audio();
    audioRef.current.preload = 'metadata'; // 只预加载元数据
    audioRef.current.loop = true;

    // 组件卸载时清理
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // 倒计时效果
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && remainingSeconds !== null && remainingSeconds > 0) {
      timer = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev === null || prev <= 1) {
            // 倒计时结束
            setIsRunning(false);
            if (audioRef.current) {
              audioRef.current.pause();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, remainingSeconds]);

  // 处理时间变化
  const handleTimeChange = (minutes: number) => {
    setSelectedMinutes(minutes);
    if (minutes > 0) {
      setRemainingSeconds(minutes * 60);
      setIsRunning(true);
      if (audioRef.current) {
        // 只有在需要播放时才设置音频源
        if (!audioRef.current.src) {
          audioRef.current.src = '/background.mp3';
        }
        audioRef.current.play().catch(error => {
          console.log('音乐播放失败:', error);
        });
      }
    }
  };

  // 处理预览时间变化
  const handlePreviewChange = (minutes: number | null) => {
    setPreviewMinutes(minutes);
  };

  // 格式化显示时间
  const formatTime = () => {
    if (isRunning && remainingSeconds !== null) {
      return Math.ceil(remainingSeconds / 60);
    }
    return previewMinutes ?? selectedMinutes;
  };

  return (
    <main className="min-h-screen w-full relative overflow-hidden flex items-center justify-center text-white">
      {/* 视频容器样式 */}
      <style jsx global>{`
        .video-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .video-container video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>

      {/* 背景视频 */}
      <div className="video-container z-0">
        {selectedVideo && (
          <video
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={selectedVideo} type="video/mp4" />
          </video>
        )}
      </div>

      {/* 环形计时器 */}
      <div className="z-20 relative">
        <CircularTimer 
          onChange={handleTimeChange}
          onPreviewChange={handlePreviewChange}
          currentSeconds={remainingSeconds}
        />
      </div>

      {/* 时间显示 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <span 
          style={{color: 'rgb(74 222 128 / 60%)'}} 
          className="!text-green-400/85 text-[120px] font-bold [text-shadow:_0_1px_0_rgb(0_0_0_/_40%),_0_2px_10px_rgb(0_0_0_/_20%)]"
        >
          {formatTime()}
        </span>
      </div>
    </main>
  );
} 