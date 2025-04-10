import { useState, useCallback } from 'react';

interface CircularTimerProps {
  onChange?: (minutes: number) => void;
  onPreviewChange?: (minutes: number | null) => void;
  currentSeconds?: number | null; // 当前剩余秒数
  isRunning?: boolean; // 是否正在运行
  isPaused?: boolean; // 是否暂停
  onPause?: () => void; // 暂停回调
}

export function CircularTimer({ 
  onChange, 
  onPreviewChange, 
  currentSeconds,
  isRunning,
  isPaused,
  onPause 
}: CircularTimerProps) {
  const [minutes, setMinutes] = useState(0);
  const [previewMinutes, setPreviewMinutes] = useState<number | null>(null);
  const [isInnerHovered, setIsInnerHovered] = useState(false);

  // SVG 参数
  const size = 300; // 调整大小更合适
  const center = size / 2;
  const radius = size * 0.35; // 调整半径使刻度线更集中
  const strokeWidth = 2;
  const segments = 60; // 60个刻度，每个代表1分钟

  // 计算当前进度
  const currentProgress = currentSeconds !== null && currentSeconds !== undefined
    ? Math.ceil(currentSeconds / 60)
    : minutes;

  // 计算角度和分钟数
  const calculateMinutes = useCallback((clientX: number, clientY: number, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const x = clientX - rect.left - center;
    const y = clientY - rect.top - center;
    
    // 计算角度（弧度）
    let angle = Math.atan2(y, x);
    // 转换为以12点为起点的角度
    angle = (angle + Math.PI / 2) % (2 * Math.PI);
    if (angle < 0) angle += 2 * Math.PI;
    
    // 转换为分钟（0-59）
    const newMinutes = Math.round((angle / (2 * Math.PI)) * 60) % 60;
    return newMinutes;
  }, [center]);

  // 格式化坐标值，确保服务器端和客户端渲染一致
  const formatCoord = (num: number) => Number(num.toFixed(2));

  // 计算波浪效果的刻度线长度
  const calculateWaveLength = (index: number, previewPos: number | null) => {
    const baseLength = 15; // 基础向外延伸长度
    const longTickExtra = 5; // 每5个刻度的额外长度
    
    // 获取基础刻度长度（考虑每5个刻度的长线）
    const baseTickLength = index % 5 === 0 ? baseLength + longTickExtra : baseLength;
    
    if (previewPos === null) return baseTickLength;
    
    // 计算与预览位置的距离（考虑环形）
    let distance = Math.abs(index - previewPos);
    distance = Math.min(distance, segments - distance); // 取最短距离
    
    // 波浪效果的范围（影响几个刻度）
    const waveRange = 5;
    
    if (distance <= waveRange) {
      // 使用余弦函数创建平滑的波浪效果，只向外延伸
      const waveHeight = Math.cos((distance / waveRange) * Math.PI) * 20;
      // 确保波浪效果只增加长度，不减少长度
      return baseTickLength + Math.max(0, waveHeight);
    }
    
    return baseTickLength;
  };

  // 检查点是否在圆内
  const isPointInCircle = (x: number, y: number, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const svgSize = Math.min(rect.width, rect.height);
    const svgScale = svgSize / size;
    
    // 计算鼠标相对于SVG中心的位置
    const relativeX = (x - rect.left - (rect.width / 2)) / svgScale;
    const relativeY = (y - rect.top - (rect.height / 2)) / svgScale;
    
    // 计算到中心的距离
    const distance = Math.sqrt(relativeX * relativeX + relativeY * relativeY);
    
    // 使用稍大一点的判断范围，确保整个圆内都能检测到
    return distance <= radius + strokeWidth;
  };

  // 鼠标事件处理
  const handleMouseMove = (e: React.MouseEvent) => {
    const element = e.currentTarget as HTMLElement;
    const isInCircle = isPointInCircle(e.clientX, e.clientY, element);
    setIsInnerHovered(isInCircle);

    if (!isInCircle) {
      const newMinutes = calculateMinutes(e.clientX, e.clientY, element);
      setPreviewMinutes(newMinutes);
      onPreviewChange?.(newMinutes);
    } else {
      setPreviewMinutes(null);
      onPreviewChange?.(null);
    }
  };

  const handleMouseLeave = () => {
    setPreviewMinutes(null);
    onPreviewChange?.(null);
    setIsInnerHovered(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    const element = e.currentTarget as HTMLElement;
    const isInCircle = isPointInCircle(e.clientX, e.clientY, element);

    if (isInCircle && isRunning) {
      onPause?.();
    } else if (!isInCircle && previewMinutes !== null) {
      setMinutes(previewMinutes);
      onChange?.(previewMinutes);
    }
  };

  // 生成刻度线
  const ticks = Array.from({ length: segments }, (_, i) => {
    // 调整角度计算，使12点为起点
    const angle = ((i * 2 * Math.PI) / segments) - (Math.PI / 2);
    const isHighlighted = i <= currentProgress;
    const isPreview = !isInnerHovered && previewMinutes !== null && i <= previewMinutes;
    
    // 计算刻度线长度（带波浪效果）
    const tickLength = !isInnerHovered ? calculateWaveLength(i, previewMinutes) : 
      (i % 5 === 0 ? 20 : 15); // 在内圈悬停时使用固定长度
    
    // 从圆环开始向外延伸
    const x1 = formatCoord(center + radius * Math.cos(angle));
    const y1 = formatCoord(center + radius * Math.sin(angle));
    const x2 = formatCoord(center + (radius + tickLength) * Math.cos(angle));
    const y2 = formatCoord(center + (radius + tickLength) * Math.sin(angle));

    return (
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isPreview ? "rgb(74 222 128)" : (isHighlighted ? "rgb(74 222 128)" : "#ffffff")}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        style={{
          transition: 'all 0.15s ease'
        }}
      />
    );
  });

  return (
    <div className="relative select-none">
      <svg
        width={size}
        height={size}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="cursor-pointer"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* 背景圆环 */}
        <circle
          cx={center}
          cy={center}
          r={formatCoord(radius)}
          className="fill-none stroke-white/10"
          strokeWidth={1}
        />
        
        {/* 刻度线 */}
        {ticks}

        {/* 暂停/继续按钮 */}
        {isRunning && (isPaused || isInnerHovered) && (
          <g style={{ isolation: 'isolate' }}>
            {/* 半透明背景圆 */}
            <circle
              cx={center}
              cy={center}
              r={radius - 10}
              fill="white"
              fillOpacity={isPaused ? 0.15 : 0.1}
              style={{ mixBlendMode: 'overlay' }}
            />
            {/* 暂停/继续图标 */}
            <g>
              {isPaused ? (
                // 播放图标（三角形）
                <path
                  d={`M${center - 10},${center - 20} L${center - 10},${center + 20} L${center + 20},${center} Z`}
                  fill="white"
                  fillOpacity={0.8}
                />
              ) : (
                // 暂停图标（两个矩形）
                <>
                  <rect
                    x={center - 15}
                    y={center - 25}
                    width={10}
                    height={50}
                    fill="white"
                    fillOpacity={0.8}
                    rx={2}
                  />
                  <rect
                    x={center + 5}
                    y={center - 25}
                    width={10}
                    height={50}
                    fill="white"
                    fillOpacity={0.8}
                    rx={2}
                  />
                </>
              )}
            </g>
          </g>
        )}
      </svg>
    </div>
  );
} 