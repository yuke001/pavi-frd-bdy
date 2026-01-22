import React, { useEffect } from 'react';
import './HeartTrail.css';

const HeartTrail = () => {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const container = document.querySelector('.heart-trail-container');
      if (!container) return;

      // Get position relative to the viewport
      const xP = e.clientX;
      const yP = e.clientY;

      // 1. Create the first heart (Span)
      const span = document.createElement("span");
      span.className = "trail-heart-1";
      span.style.left = xP + "px";
      span.style.top = yP + "px";

      const size = Math.random() * 50;
      span.style.width = size + "px";
      span.style.height = size + "px";

      // 2. Create the second heart (Strong)
      const strong = document.createElement("strong");
      strong.className = "trail-heart-2";
      strong.style.left = xP + "px";
      strong.style.top = yP + "px";

      const sizeT = Math.random() * 40;
      strong.style.width = sizeT + "px";
      strong.style.height = sizeT + "px";

      container.appendChild(span);
      container.appendChild(strong);

      // Audio effect (Optional - will play if user has interacted)
      const audio = document.getElementById('bubbleAudio');
      if (audio) {
        audio.currentTime = 0; // Reset to start for fast clicking
        audio.play().catch(() => { /* Ignore autoplay block */ });
      }

      // Cleanup
      setTimeout(() => {
        span.remove();
        strong.remove();
      }, 2000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="heart-trail-container">
      {/* Fallback audio - place bubble sound.mp3 in public folder */}
      {/* <audio id="bubbleAudio" src="/bubble-sound.mp3"></audio> */}
    </div>
  );
};

export default HeartTrail;