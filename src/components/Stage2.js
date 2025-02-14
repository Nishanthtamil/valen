import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import anime from 'animejs';

const Stage2 = () => {
  const navigate = useNavigate();
  const [bossHealth, setBossHealth] = useState(7);
  const [phase, setPhase] = useState(1);
  const bossRef = useRef(null);
  const playerRef = useRef(null);
  const bulletRef = useRef(null);
  const rewardRef = useRef(null);

  useEffect(() => {
    anime({
      targets: bossRef.current,
      scale: [0.5, 1],
      opacity: [0, 1],
      easing: 'easeOutBack',
      duration: 1200
    });
  }, []);
  const shootBullet = () => {
    const playerRect = playerRef.current.getBoundingClientRect();
    const bossRect = bossRef.current.getBoundingClientRect();
    const startX = playerRect.x + playerRect.width - 20;
    const startY = playerRect.y + playerRect.height / 2;
    const targetX = bossRect.x + bossRect.width / 2;
    const targetY = bossRect.y + bossRect.height / 2;
    bulletRef.current.style.left = `${startX}px`;
    bulletRef.current.style.top = `${startY}px`;
    bulletRef.current.style.opacity = 1;
    
    anime({
      targets: bulletRef.current,
      left: `${targetX}px`,
      top: `${targetY}px`,
      easing: 'easeInOutQuad',
      duration: 600,
      complete: () => {
        bulletRef.current.style.opacity = 0;
        anime({
          targets: bossRef.current,
          scale: [1, 0.9, 1],
          easing: 'easeInOutQuad',
          duration: 300,
        });
      }
    });
  };
  const handleAttack = () => {
    if (phase !== 1) return;
    shootBullet();
    setBossHealth(prev => {
      const newHealth = prev - 1;
      if (newHealth <= 0) {
        setPhase(2);
      }
      return newHealth;
    });
  };
  useEffect(() => {
    if (phase === 2) {
      anime({
        targets: rewardRef.current,
        opacity: [0, 1],
        scale: [0.5, 1.2, 1],
        rotate: [0, 360],
        easing: 'easeOutElastic(1, .8)',
        duration: 2000,
      });
      setTimeout(() => {
        navigate("/Stage3");
      }, 4000);
    }
  }, [phase, navigate]);

  return (
    <div style={{
      backgroundColor: "#111",
      height: "100vh",
      position: "relative",
      overflow: "hidden",
      color: "#fff",
      padding: "1rem",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <h1 style={{ marginBottom: "1rem" }}>Stage 2: The Mechanical Mayhem</h1>
      <p style={{ marginBottom: "1rem" }}>
        Use your gun to attack the rogue robot! (Click the "Attack" button below.)
      </p>
      <div style={{ marginBottom: "1rem", cursor: "pointer" }} onClick={handleAttack}>
        <svg ref={bossRef} width="300" height="300" viewBox="0 0 300 300">
          <rect x="50" y="50" width="200" height="200" rx="20" ry="20" fill="#cc3333" stroke="#fff" strokeWidth="4" />
          <circle cx="110" cy="110" r="15" fill="#fff" />
          <circle cx="190" cy="110" r="15" fill="#fff" />
          <polygon points="150,70 170,110 130,110" fill="#ff9999" />
          <polygon points="70,150 110,170 70,190" fill="#ff9999" />
          <polygon points="230,150 190,170 230,190" fill="#ff9999" />
          <path d="M100 220 L120 240 L150 230 L180 240 L200 220" stroke="#fff" strokeWidth="4" fill="none" />
        </svg>
      </div>
      <p style={{ marginBottom: "1rem" }}>Boss Health: {bossHealth}</p>
      <div style={{ position: "absolute", bottom: "20px", left: "20px" }}>
        <svg ref={playerRef} width="100" height="150" viewBox="0 0 100 150">
          <rect x="30" y="40" width="40" height="70" fill="#444" />
          <circle cx="50" cy="20" r="15" fill="#ffcc99" />
          <path d="M35 15 Q50 0 65 15 Q50 5 35 15" fill="#000" />
          <rect x="65" y="80" width="30" height="8" fill="#999" rx="2" ry="2" />
        </svg>
      </div>
      {phase === 1 && (
        <button onClick={handleAttack}
          style={{
            padding: "1rem 2rem",
            fontSize: "1.2rem",
            backgroundColor: "#FF69B4",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            position: "absolute",
            bottom: "20px",
            right: "20px"
          }}>
          Attack!
        </button>
      )}
      <div ref={bulletRef} style={{
        position: "absolute",
        width: "20px",
        height: "20px",
        backgroundColor: "#00FFFF",
        borderRadius: "50%",
        opacity: 0,
        pointerEvents: "none"
      }}></div>
      {phase === 2 && (
        <div ref={rewardRef} style={{
          position: "absolute",
          top: "20%",
          right: "20%",
          opacity: 0
        }}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <path d="M10 50 L40 50 L40 40 L60 60 L40 80 L40 70 L10 70 Z" fill="#FFD700" stroke="#fff" strokeWidth="3" />
          </svg>
          <p style={{ fontSize: "1.2rem", marginTop: "0.5rem", color: "#FFD700" }}>Key Acquired!</p>
        </div>
      )}
    </div>
  );
};

export default Stage2;
