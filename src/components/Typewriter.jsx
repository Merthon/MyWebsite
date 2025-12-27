// src/components/Typewriter.jsx
import { useState, useEffect } from 'react';

function Typewriter({ text, speed = 100 }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    // 每次 text 变了，先清空，重新开始打字
    setDisplayedText('');

    let index = 0;
    const timer = setInterval(() => {
      // 这里的逻辑是：每次取原字符串的前 index + 1 个字符
      index++;
      setDisplayedText((prev) => {
        if (index > text.length) {
          clearInterval(timer); // 打完了，清除定时器
          return prev;
        }
        return text.slice(0, index);
      });
    }, speed);

    // 组件卸载时清除定时器，防止内存泄漏
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span>
      {displayedText}
      {/* 这个是光标，我们给它加个 class 后面写样式 */}
      <span className="cursor">|</span>
    </span>
  );
}

export default Typewriter;
