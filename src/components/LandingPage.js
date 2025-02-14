import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const buttonRef = useRef(null);
  const titleRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    anime({
      targets: titleRef.current,
      opacity: [0, 1],
      translateY: [-20, 0],
      easing: 'easeOutExpo',
      duration: 1500,
    });
    anime({
      targets: buttonRef.current,
      scale: [0.8, 1],
      duration: 1500,
      easing: 'easeInOutSine',
      direction: 'alternate',
      loop: true,
    });
    anime({
      targets: '.heart',
      translateY: function () {
        return -anime.random(300, 600);
      },
      translateX: function () {
        return anime.random(-50, 50);
      },
      rotate: function () {
        return anime.random(-100, 100);
      },
      opacity: [1, 0],
      easing: 'easeOutQuad',
      duration: function(){
        return anime.random(2500,3000);
      },
      delay: anime.stagger(300, { start: 500 }),
      loop: true,
    });
  }, []);

  const handleStartGame = () => {
    navigate('/Stage1');
  };

  return (
    <div
      style={{
        backgroundImage: "url('/val1.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h1
        ref={titleRef}
        style={{
          color: 'white',
          fontSize: '3rem',
          marginBottom: '2rem',
          textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
          opacity: 0,
        }}
      >
        welcome my Love!
      </h1>
      <button
        ref={buttonRef}
        onClick={handleStartGame}
        style={{
          padding: '1rem 2rem',
          fontSize: '1.5rem',
          borderRadius: '8px',
          border: 'none',
          background: '#FF69B4',
          color: 'white',
          cursor: 'pointer',
          boxShadow: '0px 4px 8px rgba(0,0,0,0.3)',
        }}
      >
        Start Game
      </button>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
        }}
      >
        {[...Array(10)].map((_, index) => (
          <span
            key={index}
            className="heart"
            style={{
              position: 'absolute',
              top: '100%',
              left: (Math.random() * 100) + '%',
              fontSize: '2rem',
              color: '#FF1493',
              opacity: 1,
            }}
          >
            ♥
          </span>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
