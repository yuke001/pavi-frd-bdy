import { gsap } from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import "./Gallery.css";

function Gallery({ isActive }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const mediaRef = useRef([]);
  const lightboxContentRef = useRef(null);

  // --- 1. DEFINE YOUR MEMORIES HERE (Images & Videos) ---
  const memories = [
    { type: "image", src: "/images/pic01.jpeg" },
    { type: "video", src: "/videos/video1.mp4" }, // Video example
    { type: "image", src: "/images/pic02.jpeg" },
    { type: "video", src: "/videos/video2.mp4" }, // Video example
    { type: "image", src: "/images/pic03.jpeg" },
    { type: "video", src: "/videos/video3.mp4" }, // Video example
    { type: "image", src: "/images/pic04.jpeg" },
    { type: "video", src: "/videos/video5.mp4" }, // Video example
    { type: "image", src: "/images/pic05.jpeg" },
    { type: "video", src: "/videos/video6.mp4" }, // Video example
    { type: "image", src: "/images/pic06.jpeg" },
    { type: "video", src: "/videos/video7.mp4" }, // Video example
  ];

  // Animation on enter
  useEffect(() => {
    if (isActive && !revealed) {
      setTimeout(() => setRevealed(true), 10);
      gsap.fromTo(
        mediaRef.current,
        { opacity: 0, y: 50, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.4)",
          delay: 0.2,
        },
      );
    }
  }, [isActive, revealed]);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") changeMedia(-1);
      if (e.key === "ArrowRight") changeMedia(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, currentIndex]);

  const changeMedia = useCallback(
    (direction) => {
      // Fade out current content
      if (lightboxContentRef.current) {
        gsap.to(lightboxContentRef.current, {
          opacity: 0,
          scale: 0.95,
          duration: 0.2,
          onComplete: () => {
            // Update index
            setCurrentIndex((prev) => {
              const count = memories.length;
              return (prev + direction + count) % count;
            });
            // Fade in new content
            gsap.to(lightboxContentRef.current, {
              opacity: 1,
              scale: 1,
              duration: 0.3,
              delay: 0.1,
            });
          },
        });
      }
    },
    [memories.length],
  );

  const currentItem = memories[currentIndex];

  return (
    <section className="gallery">
      <h2>📸 Memories & Reels</h2>

      <div className="media-grid">
        {memories.map((item, index) => (
          <div
            key={index}
            ref={(el) => (mediaRef.current[index] = el)}
            className="media-card"
            onClick={() => openLightbox(index)}
          >
            {item.type === "video" ? (
              <>
                <video src={item.src} muted playsInline preload="metadata" />
                <div className="play-overlay">
                  <div className="play-icon">▶</div>
                </div>
              </>
            ) : (
              <img src={item.src} alt="Memory" loading="lazy" />
            )}
          </div>
        ))}
      </div>

      {lightboxOpen && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>
            ✖
          </button>

          <button
            className="nav-btn nav-prev"
            onClick={(e) => {
              e.stopPropagation();
              changeMedia(-1);
            }}
          >
            ‹
          </button>

          <div
            className="lightbox-content-wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            {currentItem.type === "video" ? (
              <video
                ref={lightboxContentRef}
                src={currentItem.src}
                className="lightbox-media"
                controls
                autoPlay
                playsInline
              />
            ) : (
              <img
                ref={lightboxContentRef}
                src={currentItem.src}
                className="lightbox-media"
                alt="Memory Fullscreen"
              />
            )}
          </div>

          <button
            className="nav-btn nav-next"
            onClick={(e) => {
              e.stopPropagation();
              changeMedia(1);
            }}
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}

export default Gallery;
