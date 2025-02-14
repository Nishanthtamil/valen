import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import anime from 'animejs';

const initialMaze = [
  [0, 0, 1, 0, 0],
  [0, 3, 1, 0, 2],
  [1, 0, 0, 0, 1],
  [0, 1, 0, 3, 0],
  [0, 0, 0, 1, 0],
];

const cellSize = 80;
const gap = 2;
const containerPadding = 4;
const avatarSize = 60; 

const Stage3 = () => {
  const navigate = useNavigate();
  const [maze, setMaze] = useState(initialMaze);
  const [playerPos, setPlayerPos] = useState({ row: 0, col: 0 });
  const [fragmentsCollected, setFragmentsCollected] = useState(0);
  const totalFragments = initialMaze.flat().filter(cell => cell === 2).length;
  const [exitActive, setExitActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showMiniPuzzle, setShowMiniPuzzle] = useState(false);
  const [miniPuzzleCell, setMiniPuzzleCell] = useState(null);
  const [miniPuzzleInput, setMiniPuzzleInput] = useState([]);
  const correctMiniSequence = [1, 2, 3];
  const playerRef = useRef(null);
  const timerRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const computeAvatarPosition = (row, col) => {
    const offset = (cellSize - avatarSize) / 2;
    const x = containerPadding + col * (cellSize + gap) + offset;
    const y = containerPadding + row * (cellSize + gap) + offset;
    return { x, y };
  };
  useEffect(() => {
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(timerIntervalRef.current);
          anime({
            targets: timerRef.current,
            backgroundColor: ['#ff0000', '#555'],
            duration: 500,
            easing: 'easeInOutQuad'
          });
          setTimeout(() => {
            alert('Time is up! The maze shifts and you are returned to the start.');
            setPlayerPos({ row: 0, col: 0 });
            setTimeLeft(60);
            timerIntervalRef.current = setInterval(() => {
              setTimeLeft(prev => prev - 1);
            }, 1000);
          }, 500);
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timerIntervalRef.current);
  }, []);
  useEffect(() => {
    const progress = (timeLeft / 60) * 100;
    anime({
      targets: timerRef.current,
      width: `${progress}%`,
      easing: 'linear',
      duration: 900
    });
  }, [timeLeft]);
  useEffect(() => {
    if (fragmentsCollected === totalFragments && !exitActive) {
      setExitActive(true);
      setMaze(prevMaze => {
        const newMaze = prevMaze.map(row => [...row]);
        newMaze[newMaze.length - 1][newMaze[0].length - 1] = 4;
        return newMaze;
      });
    }
  }, [fragmentsCollected, totalFragments, exitActive]);
  const movePlayer = (direction) => {
    const { row, col } = playerPos;
    let newRow = row;
    let newCol = col;
    if (direction === 'up') newRow = row - 1;
    if (direction === 'down') newRow = row + 1;
    if (direction === 'left') newCol = col - 1;
    if (direction === 'right') newCol = col + 1;
    if (newRow < 0 || newRow >= maze.length || newCol < 0 || newCol >= maze[0].length) return;
    const cellValue = maze[newRow][newCol];
    if (cellValue === 1) return;
    if (cellValue === 3) {
      setMiniPuzzleCell({ row: newRow, col: newCol });
      setShowMiniPuzzle(true);
      return;
    }
    const { x: endX, y: endY } = computeAvatarPosition(newRow, newCol);
    anime({
      targets: playerRef.current,
      translateX: endX,
      translateY: endY,
      easing: 'easeInOutQuad',
      duration: 300,
    });
    setPlayerPos({ row: newRow, col: newCol });
    if (cellValue === 2) {
      setFragmentsCollected(prev => prev + 1);
      setMaze(prevMaze => {
        const newMaze = prevMaze.map(row => [...row]);
        newMaze[newRow][newCol] = 0;
        return newMaze;
      });
      anime({
        targets: `.cell-${newRow}-${newCol}`,
        backgroundColor: ['#eee', '#FF69B4', '#eee'],
        duration: 800,
        easing: 'easeInOutQuad'
      });
    }
    if (exitActive && cellValue === 4) {
      anime({
        targets: '.maze-container',
        scale: [1, 1.1, 1],
        easing: 'easeOutElastic(1, .8)',
        duration: 1000,
      });
      clearInterval(timerIntervalRef.current);
      setTimeout(() => {
        navigate("/Stage4");
      }, 3000);
    }
  };
  const handleMiniPuzzleClick = (num) => {
    setMiniPuzzleInput(prev => {
      const newInput = [...prev, num];
      if (newInput.length === correctMiniSequence.length) {
        if (newInput.join('') === correctMiniSequence.join('')) {
          if (miniPuzzleCell) {
            setMaze(prevMaze => {
              const newMaze = prevMaze.map(row => [...row]);
              newMaze[miniPuzzleCell.row][miniPuzzleCell.col] = 0;
              return newMaze;
            });
            anime({
              targets: '.mini-puzzle-overlay',
              opacity: [1, 0],
              easing: 'easeOutQuad',
              duration: 500,
            });
            setTimeout(() => {
              setShowMiniPuzzle(false);
              setMiniPuzzleInput([]);
              movePlayerToCell(miniPuzzleCell.row, miniPuzzleCell.col);
            }, 500);
          }
        } else {
          anime({
            targets: '.mini-puzzle-overlay .button',
            translateX: [-10, 10, -10, 10, 0],
            easing: 'easeInOutSine',
            duration: 600,
          });
          setMiniPuzzleInput([]);
        }
      }
      return newInput;
    });
  };
  const movePlayerToCell = (row, col) => {
    const { x: endX, y: endY } = computeAvatarPosition(row, col);
    anime({
      targets: playerRef.current,
      translateX: endX,
      translateY: endY,
      easing: 'easeInOutQuad',
      duration: 300,
    });
    setPlayerPos({ row, col });
  };
  useEffect(() => {
    const shiftInterval = setInterval(() => {
      anime({
        targets: '.wall-cell',
        backgroundColor: ['#333', '#555'],
        easing: 'easeInOutSine',
        duration: 800,
        direction: 'alternate',
      });
    }, 5000);
    return () => clearInterval(shiftInterval);
  }, []);

  return (
    <div style={{
      backgroundColor: "#222",
      height: "100vh",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      position: "relative"
    }}>
      <h1 style={{ marginBottom: "1rem" }}>Stage 3: The Labyrinth of Lost Memories</h1>
      <div style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        right: "20px",
        height: "10px",
        backgroundColor: "#555",
        borderRadius: "5px"
      }}>
        <div ref={timerRef} style={{
          height: "100%",
          width: "100%",
          backgroundColor: "#0f0",
          borderRadius: "5px"
        }}></div>
      </div>
      <div className="maze-container" style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: `repeat(${maze[0].length}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${maze.length}, ${cellSize}px)`,
        gap: `${gap}px`,
        backgroundColor: "#000",
        padding: `${containerPadding}px`
      }}>
        {maze.map((rowArr, rowIndex) =>
          rowArr.map((cell, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`}
              className={cell === 1 ? `wall-cell cell-${rowIndex}-${colIndex}` : `cell-${rowIndex}-${colIndex}`}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                backgroundColor: cell === 1 ? "#333" :
                                  cell === 2 ? "#8f8" :
                                  cell === 3 ? "#f80" : 
                                  cell === 4 ? "#00f" : 
                                  "#eee",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "1.2rem"
              }}
            >
              {cell === 2 && "⭐"}
              {cell === 4 && "🚪"}
            </div>
          ))
        )}
        <div ref={playerRef} style={{
          position: "absolute",
          transform: `translate(${computeAvatarPosition(playerPos.row, playerPos.col).x}px, ${computeAvatarPosition(playerPos.row, playerPos.col).y}px)`,
          width: `${avatarSize}px`,
          height: `${avatarSize}px`,
          pointerEvents: "none",
          zIndex: 10
        }}>
          <div style={{
            width: "60px",
            height: "60px",
            backgroundColor: "#FF69B4",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            color: "#fff"
          }}>
            <span style={{ transform: "rotate(-20deg)" }}>🔫</span>
          </div>
        </div>
      </div>
      <div style={{
        marginTop: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem"
      }}>
        <button onClick={() => movePlayer('up')}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#FF69B4",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}>
          Up
        </button>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={() => movePlayer('left')}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#FF69B4",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}>
            Left
          </button>
          <button onClick={() => movePlayer('down')}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#FF69B4",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}>
            Down
          </button>
          <button onClick={() => movePlayer('right')}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#FF69B4",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}>
            Right
          </button>
        </div>
      </div>
      {showMiniPuzzle && (
        <div className="mini-puzzle-overlay" style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.8)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          opacity: 1
        }}>
          <h2>Solve the Puzzle to Clear the Obstacle!</h2>
          <p>Press the buttons in the correct order:</p>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            {[1, 2, 3].map(num => (
              <button key={num} className="button"
                onClick={() => handleMiniPuzzleClick(num)}
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "1.2rem",
                  backgroundColor: "#FF69B4",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}>
                {num}
              </button>
            ))}
          </div>
          <p>Your Input: {miniPuzzleInput.join('-')}</p>
        </div>
      )}
    </div>
  );
};

export default Stage3;
