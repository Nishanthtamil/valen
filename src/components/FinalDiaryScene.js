import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import anime from 'animejs';

const FinalDiaryBookRealistic = () => {
  const navigate = useNavigate();
  const diaryPages = [
    "My dearest,",
    "In the darkest hours, your love lit my way.",
    "Every heartbeat echoes your name,",
    "And every moment apart feels like an eternity.",
    "I have hidden my words on these pages,",
    "Waiting for you to uncover our story.",
    "Now, as you flip each page, know that my heart is yours,",
    "Forever and always.",
    "Without you i am nothing.",
    "Even in the darkest moments my heart searches for you.",
    "My happiness,my love,my sadness,my anger",
    "Everything is  with you.",
    "my beginning and end everything is with you.",
    "you're my comfort and you're my horizon.",
    "you're my black hole that i fell deep in with love. ",
    "your eyes are my beautiful starry night.",
    "I love you so much my love."
  ];
  const totalPages = diaryPages.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const leftPageRef = useRef(null);
  const rightPageRef = useRef(null);
  const bookRef = useRef(null);
  const audioRef = useRef(null);
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.warn("Audio playback failed:", err));
    }
  };

  const handleFlip = () => {
    if (flipping) return;
    setFlipping(true);
    const tl = anime.timeline({ autoplay: false });
    tl.add({
      targets: rightPageRef.current,
      rotateY: [0, -90],
      duration: 500,
      easing: 'easeInOutQuad',
      complete: () => {
        const nextIndex = currentIndex + 2;
        if (nextIndex >= totalPages) {
          anime({
            targets: bookRef.current,
            opacity: [1, 0],
            duration: 600,
            easing: 'easeInOutQuad',
            complete: () => navigate("/NextStage")
          });
        } else {
          setCurrentIndex(nextIndex);
          anime.set(rightPageRef.current, { rotateY: 90 });
        }
      }
    }).add({
      targets: rightPageRef.current,
      rotateY: [90, 0],
      duration: 500,
      easing: 'easeInOutQuad',
      complete: () => {
        setFlipping(false);
      }
    });
    tl.play();
    if (currentIndex === 0) playAudio();
  };

  useEffect(() => {
    for (let i = 0; i < 20; i++) {
      const flower = document.createElement('div');
      flower.innerText = '🌸';
      flower.style.position = 'absolute';
      flower.style.top = '-50px';
      flower.style.left = `${Math.random() * window.innerWidth}px`;
      flower.style.fontSize = `${20 + Math.random() * 20}px`;
      flower.style.opacity = Math.random().toString();
      flower.style.pointerEvents = 'none';
      document.body.appendChild(flower);
      anime({
        targets: flower,
        top: [ -50, window.innerHeight + 50 ],
        translateX: [0, Math.random() * 100 - 50],
        easing: 'linear',
        duration: 4000 + Math.random() * 2000,
        complete: () => flower.remove()
      });
    }
  }, []);

  // Styles
  const containerStyle = {
    background: 'linear-gradient(to bottom, #d0e9c6, #a8d08d)',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  };
  const bookContainerStyle = {
    perspective: '2000px',
    width: '50%',
    maxWidth: '500px',
    position: 'relative',
    height: '50vh',
    backgroundColor: '#fdf6e3',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    display: 'flex',
    margin: '0 auto',
    transformStyle: 'preserve-3d'
  };

  // More realistic page styling:
  const pageStyle = {
    width: '50%',
    height: '100%',
    backgroundColor: '#fdf6e3',
    backgroundImage: 'repeating-linear-gradient(180deg, #fdf6e3, #fdf6e3 30px, #eaeaea 30px, #eaeaea 31px)',
    boxShadow: 'inset 0 0 5px rgba(0,0,0,0.2)',
    border: '1px solid #ddd',
    backfaceVisibility: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Georgia, serif',
    fontSize: '1.6rem',
    padding: '1rem',
    position: 'relative'
  };

  const leftPageStyle = {
    ...pageStyle,
    borderRight: 'none'
  };

  const rightPageStyle = {
    ...pageStyle,
    borderLeft: 'none',
    transformOrigin: 'left center',
    transform: 'rotateY(0deg)'
  };

  return (
    <div style={containerStyle}>
      {/* Hidden audio element */}
      <audio ref={audioRef} src="/Die With A Smile Song Ringtone Download Bruno Mars - MobCup.Com.Co.mp3" loop />
      <div ref={bookRef} style={bookContainerStyle}>
        <div ref={leftPageRef} style={leftPageStyle}>
          {diaryPages[currentIndex]}
        </div>
        <div ref={rightPageRef} style={rightPageStyle}>
          {diaryPages[currentIndex + 1] || ""}
        </div>
      </div>
      
      <button onClick={handleFlip} style={{
        marginTop: '2rem',
        padding: '0.8rem 1.5rem',
        fontSize: '1.3rem',
        backgroundColor: '#FFD700',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer'
      }}>
        {currentIndex < totalPages - 2 ? "Flip Page" : "Close Diary"}
      </button>
      
      <div style={{
        position: 'absolute',
        bottom: '20px',
        color: '#fff',
        fontSize: '1.2rem'
      }}>
        Pages {currentIndex + 1} - {currentIndex + 2} of {totalPages}
      </div>
    </div>
  );
};

export default FinalDiaryBookRealistic;
