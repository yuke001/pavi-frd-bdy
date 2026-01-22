import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useRef, useState } from "react";
import "./App.css";
import CelebrationPage from "./components/CelebrationPage";
import Countdown from "./components/Countdown";
import Effects from "./components/Effects";
import Gallery from "./components/Gallery";
import Hearts from "./components/Hearts";
import MessageCard from "./components/MessageCard";
import MusicPlayer from "./components/MusicPlayer";
import HeartTrail from "./components/HeartTrail";

gsap.registerPlugin(ScrollToPlugin);

function App() {
  const [currentPage, setCurrentPage] = useState(1); // Start at 1 for Countdown page
  const [showSneakPeek, setShowSneakPeek] = useState(false);
  
  // New state to toggle between the Question and the Image Reveal
  const [sneakPeekReveal, setSneakPeekReveal] = useState(false);

  // Check localStorage to persist birthday reached state
  const [birthdayReached, setBirthdayReached] = useState(() => {
    const saved = localStorage.getItem("birthdayReached");
    return saved === "true";
  });

  const [showEffects, setShowEffects] = useState(false);

  const page1Ref = useRef(null); // Countdown page
  const page2Ref = useRef(null); // Celebration Page
  const page3Ref = useRef(null); // MessageCard
  const page4Ref = useRef(null); // Gallery
  const musicPlayerRef = useRef(null); // Music player control

  const goToPage = (pageNumber) => {
    const refs = { 1: page1Ref, 2: page2Ref, 3: page3Ref, 4: page4Ref };
    const currentPageRef = refs[currentPage];
    const nextPageRef = refs[pageNumber];

    const isForward = pageNumber > currentPage;

    // Animate out current page
    gsap.to(currentPageRef.current, {
      x: isForward ? "-100%" : "100%",
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
    });

    // Prepare next page
    gsap.set(nextPageRef.current, {
      x: isForward ? "100%" : "-100%",
      opacity: 0,
      visibility: "visible",
    });

    // Animate in next page
    gsap.to(nextPageRef.current, {
      x: "0%",
      opacity: 1,
      duration: 0.6,
      ease: "power2.inOut",
      delay: 0.2,
      onComplete: () => {
        setCurrentPage(pageNumber);
        // Reset current page position
        gsap.set(currentPageRef.current, { x: "0%", visibility: "hidden" });

        // Smooth scroll to top
        gsap.to(window, { duration: 0.3, scrollTo: { y: 0 } });
      },
    });
  };

  const handleBirthdayReached = () => {
    setBirthdayReached(true);
    setShowSneakPeek(false);
    localStorage.setItem("birthdayReached", "true"); // Persist to localStorage
    setShowEffects(true);
    // Stop effects after some time
    setTimeout(() => setShowEffects(false), 10000);
  };

  // Function to open Sneak Peek and reset it to the question
  const openSneakPeek = () => {
    setSneakPeekReveal(false);
    setShowSneakPeek(true);
  };

  return (
    <div className="app">
      <MusicPlayer ref={musicPlayerRef} />
      <Hearts />

      {/* PAGE 1: Countdown Timer */}
      <div
        ref={page1Ref}
        className={`page ${currentPage === 1 ? "active" : ""}`}
        style={{ visibility: currentPage === 1 ? "visible" : "hidden" }}
      >
        {!birthdayReached && <HeartTrail />}

        <section className="hero">
          <h1 id="heroTitle">
            {birthdayReached ? (
              <>
                Happy Birthday <span className="highlight">Shannu💗</span> 🎂
              </>
            ) : (
              <>
                Counting down to <span className="highlight">Shannu's</span>{" "}
                special day 🎂
              </>
            )}
          </h1>
          <p>Some moments are worth waiting for 💗</p>
        </section>

        <Countdown
          onBirthdayReached={handleBirthdayReached}
          birthdayReached={birthdayReached}
        />

        <section className="teaser">
          <h2 id="teaserHeading">
            {birthdayReached
              ? "💖 Ready for your surprise! 💖"
              : "✨ A special celebration awaits you at midnight... ✨"}
          </h2>
          <p className="teaser-hint">Something magical is about to unfold 💫</p>
        </section>

        <button
          id="surpriseBtn"
          className="celebrate-btn"
          disabled={!birthdayReached}
          onClick={() => goToPage(2)}
        >
          🎀 Let's Celebrate
        </button>

        {!birthdayReached && (
          <button
            className="small-sneak-btn"
            onClick={openSneakPeek}
          >
            Sneak 👀
          </button>
        )}
      </div>

      {/* PAGE 2: Celebration/QNA Page */}
      <div
        ref={page2Ref}
        className={`page ${currentPage === 2 ? "active" : ""}`}
        style={{ visibility: currentPage === 2 ? "visible" : "hidden" }}
      >
        <CelebrationPage
          onComplete={() => goToPage(3)}
          musicPlayerRef={musicPlayerRef}
        />
      </div>

      {/* PAGE 3: Message Card */}
      <div
        ref={page3Ref}
        className={`page ${currentPage === 3 ? "active" : ""}`}
        style={{ visibility: currentPage === 3 ? "visible" : "hidden" }}
      >
        <button className="back-btn" onClick={() => goToPage(2)}>
          ← Back
        </button>
        <MessageCard isActive={currentPage === 3} />
        <button className="page-nav-btn" onClick={() => goToPage(4)}>
          📸 View Memories
        </button>
      </div>

      {/* PAGE 4: Gallery */}
      <div
        ref={page4Ref}
        className={`page ${currentPage === 4 ? "active" : ""}`}
        style={{ visibility: currentPage === 4 ? "visible" : "hidden" }}
      >
        <button className="back-btn" onClick={() => goToPage(3)}>
          ← Back
        </button>
        <Gallery isActive={currentPage === 4} />
        <section className="final">
          <h2 className="final-message">💖 Forever Yours — Pavi... 💖</h2>
          <p className="final-subtitle">
            I hope your birthday is as sweet as you 🍰🍬✨ <br />
            Have a blast 🎉🔥💃 <br />
            <b> Happy Birthday!</b> 🎂🥳🎈💖 ✨
          </p>
        </section>
      </div>

      {/* Effects */}
      {showEffects && <Effects />}

      {/* SNEAK PEEK MODAL */}
      {showSneakPeek && (
        <div className="modal-overlay" onClick={() => setShowSneakPeek(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            {!sneakPeekReveal ? (
              /* STEP 1: The Question */
              <div className="sneak-step-1">
                <div className="modal-emoji">🤨</div>
                <h3>Do you really want to see the surprise?</h3>
                <div className="modal-button-group" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                  <button 
                    className="modal-btn-yes" 
                    style={{ background: '#ff4d6d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer' }}
                    onClick={() => setSneakPeekReveal(true)}
                  >
                    Yes! 😍
                  </button>
                  <button 
                    className="modal-btn-no" 
                    style={{ background: '#ddd', color: '#333', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer' }}
                    onClick={() => setShowSneakPeek(false)}
                  >
                    No, I'll wait 😇
                  </button>
                </div>
              </div>
            ) : (
              /* STEP 2: The Reveal */
              <div className="sneak-step-2">
                <div className="modal-emoji"> 😜</div>
                <h3>Nice Try...!</h3>
                
                {/* Image/GIF Container */}
                <div style={{ margin: '15px 0' }}>
                    <img 
                      src="/images/NoWay.gif" 
                      alt="Prank" 
                      style={{ width: '100%', borderRadius: '10px', maxWidth: '250px' }}
                    />
                </div>

                <p>
                  Wait pannu enna avasaram! surprise-ku munnaadi paakalaam
                  nu ninaikkiryaa🙄?
                </p>
                <p>Please wait until the big day!</p>

                <button
                  className="modal-close"
                  onClick={() => setShowSneakPeek(false)}
                  style={{ marginTop: '15px' }}
                >
                  Fine, I'll Wait... 🙄
                </button>
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
}

export default App;