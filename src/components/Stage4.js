import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import anime from 'animejs';

const Stage4 = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(1);
  const [rescueStarted, setRescueStarted] = useState(false);
  const [puzzleGrid, setPuzzleGrid] = useState(Array(9).fill(false));
  const puzzleTimeLimit = 20; 
  const [puzzleTimeLeft, setPuzzleTimeLeft] = useState(puzzleTimeLimit);
  const puzzleTimerRef = useRef(null);
  const puzzleProgressRef = useRef(null);
  
  useEffect(() => {
    const solved = puzzleGrid.every(cell => cell === true);
    if (solved) {
      clearInterval(puzzleTimerRef.current);
      anime({
        targets: '.puzzle-message',
        opacity: [0, 1],
        translateY: [20, 0],
        easing: 'easeOutExpo',
        duration: 1000,
      });
      setTimeout(() => setPhase(2), 1500);
    }
  }, [puzzleGrid]);
  
  useEffect(() => {
    if (phase === 1) {
      setPuzzleTimeLeft(puzzleTimeLimit);
      puzzleTimerRef.current = setInterval(() => {
        setPuzzleTimeLeft(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            clearInterval(puzzleTimerRef.current);
            alert('Time is up! Puzzle resets.');
            setPuzzleGrid(Array(9).fill(false));
            return puzzleTimeLimit;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(puzzleTimerRef.current);
  }, [phase]);
  
  useEffect(() => {
    if (phase === 1 && puzzleProgressRef.current) {
      const progress = (puzzleTimeLeft / puzzleTimeLimit) * 100;
      anime({
        targets: puzzleProgressRef.current,
        width: `${progress}%`,
        easing: 'linear',
        duration: 900,
      });
    }
  }, [puzzleTimeLeft, phase]);
  
  const togglePuzzleCell = (index) => {
    setPuzzleGrid(prev => {
      const newGrid = [...prev];
      const toggle = (i) => { if (i >= 0 && i < 9) newGrid[i] = !newGrid[i]; };
      toggle(index);
      if (index % 3 !== 0) toggle(index - 1);
      if ((index + 1) % 3 !== 0) toggle(index + 1);
      if (index >= 3) toggle(index - 3);
      if (index < 6) toggle(index + 3);
      return newGrid;
    });
  };
  const [bombActivated, setBombActivated] = useState(false);
  const bombRef = useRef(null);
  
  const handleBombClick = () => {
    if (phase !== 2 || bombActivated) return;
    setBombActivated(true);
    anime({
      targets: bombRef.current,
      scale: [1, 1.2, 1],
      easing: 'easeInOutSine',
      duration: 500,
      loop: 3,
      complete: () => {
        anime({
          targets: bombRef.current,
          scale: [1, 3],
          opacity: [1, 0],
          easing: 'easeOutExpo',
          duration: 800,
        });
        setTimeout(() => setPhase(3), 1000);
      }
    });
  };
  const wifeRef = useRef(null);
  const husbandRef = useRef(null);
  const wifeRightArmRef = useRef(null);
  const husbandArmRef = useRef(null);
  const letterRef = useRef(null);
  const environmentRef = useRef(null);
  const audioRef = useRef(null);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.warn("Autoplay prevented; user interaction may be required.", err);
      });
    }
  }, []);
  
  useEffect(() => {
    if (phase === 3) {
      anime({
        targets: environmentRef.current,
        backgroundColor: ['#000', '#7ec850'],
        easing: 'easeInOutQuad',
        duration: 1500,
      });
      for (let i = 0; i < 30; i++) {
        const flower = document.createElement('div');
        flower.innerText = '🌸';
        flower.style.position = 'absolute';
        flower.style.top = '-50px';
        flower.style.left = `${Math.random() * window.innerWidth}px`;
        flower.style.fontSize = `${20 + Math.random() * 30}px`;
        flower.style.opacity = Math.random().toString();
        flower.style.pointerEvents = 'none';
        document.body.appendChild(flower);
        anime({
          targets: flower,
          top: [ -50, window.innerHeight + 50 ],
          translateX: [0, Math.random() * 100 - 50],
          easing: 'linear',
          duration: 5000 + Math.random() * 3000,
          complete: () => flower.remove()
        });
      }
      setTimeout(() => {
        setRescueStarted(true);
        startRescueAnimation();
      }, 1500);
    }
  }, [phase]);
  
  const startRescueAnimation = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.warn("Audio playback failed:", err));
    }
    anime({
      targets: wifeRef.current,
      left: ['10%', '35%'],
      easing: 'easeInOutExpo',
      duration: 1500,
    });
    anime({
      targets: husbandRef.current,
      right: ['10%', '35%'],
      easing: 'easeInOutExpo',
      duration: 1500,
      delay: 300,
    });
    anime({
      targets: husbandRef.current,
      opacity: [0, 1],
      easing: 'easeOutExpo',
      duration: 1000,
      delay: 300,
    });
    anime({
      targets: wifeRightArmRef.current,
      rotate: [-45],
      easing: 'easeInOutExpo',
      duration: 1500,
      delay: 1700,
    });
    anime({
      targets: husbandArmRef.current,
      rotate: [45],
      easing: 'easeInOutExpo',
      duration: 1500,
      delay: 1700,
    });
    anime({
      targets: [wifeRef.current, husbandRef.current],
      translateX: ['0', '-20'],
      easing: 'easeInOutExpo',
      duration: 1000,
      delay: 3500,
    });
    anime({
      targets: letterRef.current,
      opacity: [0, 1],
      translateY: [50, 0],
      easing: 'easeOutExpo',
      duration: 1500,
      delay: 5000,
    });
    setTimeout(() => {
      navigate("/FinalDiary");
    }, 8000);
  };
  
  const handleRescueClick = () => {
    if (!rescueStarted) {
      setRescueStarted(true);
      startRescueAnimation();
    }
  };

  return (
    <div ref={environmentRef} style={{
      background: '#000',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <audio ref={audioRef} src="/Ennodu Nee Irundhaal Reprise Ringtone Download – I - MobCup.Com.Co.mp3" loop />
      
      {phase === 1 && (
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>The Final Redstone Gauntlet</h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            Solve the puzzle before time runs out!
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 80px)',
            gap: '5px',
            marginBottom: '1rem'
          }}>
            {puzzleGrid.map((cell, index) => (
              <div key={index} 
                   onClick={() => togglePuzzleCell(index)}
                   style={{
                     width: '80px',
                     height: '80px',
                     backgroundColor: cell ? '#FF0000' : '#555',
                     border: '2px solid #fff',
                     cursor: 'pointer'
                   }} />
            ))}
          </div>
          <div style={{
            width: '300px',
            height: '20px',
            backgroundColor: '#444',
            borderRadius: '10px',
            margin: '0 auto'
          }}>
            <div ref={puzzleProgressRef} style={{
              height: '100%',
              width: `${(puzzleTimeLeft / puzzleTimeLimit) * 100}%`,
              backgroundColor: '#0f0',
              borderRadius: '10px'
            }}></div>
          </div>
          <p className="puzzle-message" style={{ opacity: 0, fontSize: '1.2rem', marginTop: '1rem' }}>
            Puzzle Solved!
          </p>
        </div>
      )}
      
      {phase === 2 && (
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'white' }}>Bomb Activation</h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>
            Activate the bomb to blast away the villain’s stronghold!
          </p>
          <div ref={bombRef} onClick={handleBombClick} style={{
            width: '100px',
            height: '100px',
            backgroundColor: '#222',
            borderRadius: '50%',
            border: '4px solid #FF4500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}>
            Bomb
          </div>
          <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
            {bombActivated ? "Bomb activated!" : "Click the bomb!"}
          </p>
        </div>
      )}
      
      {phase === 3 && (
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color:"white" }}>The Grand Rescue</h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '1rem', color:"white" }}>
            The explosion has cleared the path, the villain is dead—rescue your husband!
          </p>
          <div style={{
            position: 'relative',
            width: '100%',
            height: '50vh',
            overflow: 'hidden'
          }}>
            <div ref={wifeRef} style={{
              position: 'absolute',
              bottom: '10%',
              left: '10%',
              width: '150px',
              height: '300px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#FADADD',
                borderRadius: '50%',
                border: '3px solid #fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}></div>
              <div style={{
                width: '120px',
                height: '150px',
                backgroundColor: '#FF69B4',
                borderRadius: '10px',
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1.2rem'
              }}>
                Ragavi
              </div>
              <div ref={wifeRightArmRef} style={{
                position: 'absolute',
                top: '120px',
                right: '-40px',
                width: '40px',
                height: '20px',
                backgroundColor: '#FF69B4',
                transformOrigin: 'left center',
                transform: 'rotate(0deg)'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#FF69B4',
                  borderRadius: '50%',
                  position: 'absolute',
                  right: '-10px',
                  top: '0'
                }}></div>
              </div>
            </div>
            <div ref={husbandRef} style={{
              position: 'absolute',
              bottom: '10%',
              right: '10%',
              width: '150px',
              height: '300px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#ADD8E6',
                borderRadius: '50%',
                border: '3px solid #fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}></div>
              <div style={{
                width: '120px',
                height: '150px',
                backgroundColor: '#00BFFF',
                borderRadius: '10px',
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1.2rem'
              }}>
                Nishanth
              </div>
              <div ref={husbandArmRef} style={{
                position: 'absolute',
                top: '120px',
                left: '-40px',
                width: '40px',
                height: '20px',
                backgroundColor: '#00BFFF',
                transformOrigin: 'right center',
                transform: 'rotate(0deg)'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#00BFFF',
                  borderRadius: '50%',
                  position: 'absolute',
                  left: '-10px',
                  top: '0'
                }}></div>
              </div>
            </div>
          </div>
          <div ref={letterRef} style={{
            opacity: 0,
            fontSize: '2rem',
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: '1rem 2rem',
            borderRadius: '8px',
            color: '#000',
            position: 'absolute',
            bottom: '5%',
            left: '50%',
            transform: 'translateX(-50%)'
          }}>
            "En pondatti, you have rescued me my dear. Here, this is for you, my karadi."
          </div>
          <button onClick={handleRescueClick} style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            backgroundColor: '#FFD700',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            Activate Final Rescue
          </button>
        </div>
      )}
    </div>
  );
};

export default Stage4;
