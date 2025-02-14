// src/components/Stage3ComplexMaze.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import anime from 'animejs';

// Maze cell values:
// 0 = free cell
// 1 = wall
// 2 = memory fragment cell (collectible)
// 3 = obstacle cell (requires solving mini-puzzle)
// 4 = exit cell (activated once all fragments are collected)
const initialMaze = [
  [0, 0, 1, 0, 0],
  [0, 3, 1, 0, 2],
  [1, 0, 0, 0, 1],
  [0, 1, 0, 3, 0],
  [0, 0, 0, 1, 0],
];

const cellSize = 80; // size in pixels for each cell
const gap = 2;       // gap between cells (in pixels)
const containerPadding = 4; // padding on the maze container (in pixels)
const avatarSize = 60;      // size (width and height) of the avatar

const Stage3 = () => {
  const navigate = useNavigate();
  
  // Maze state remains fixed for this example
  const [maze, setMaze] = useState(initialMaze);
  // Player position state: starting at top-left (row: 0, col: 0)
  const [playerPos, setPlayerPos] = useState({ row: 0, col: 0 });
  // Count how many memory fragments (value 2) have been collected
  const [fragmentsCollected, setFragmentsCollected] = useState(0);
  const totalFragments = initialMaze.flat().filter(cell => cell === 2).length;
  // Whether exit is active (will set bottom-right cell to 4 when fragments collected)
  const [exitActive, setExitActive] = useState(false);
  // Timer state (60 seconds)
  const [timeLeft, setTimeLeft] = useState(60);
  // Mini-puzzle state for obstacle cells (value 3)
  const [showMiniPuzzle, setShowMiniPuzzle] = useState(false);
  const [miniPuzzleCell, setMiniPuzzleCell] = useState(null); // store {row, col} of current obstacle
  const [miniPuzzleInput, setMiniPuzzleInput] = useState([]);
  const correctMiniSequence = [1, 2, 3]; // sequence required to clear an obstacle

  // Refs for animations
  const playerRef = useRef(null);
  const timerRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Helper function: compute absolute position (in pixels) of a cell's center for the avatar.
  const computeAvatarPosition = (row, col) => {
    const offset = (cellSize - avatarSize) / 2;
    const x = containerPadding + col * (cellSize + gap) + offset;
    const y = containerPadding + row * (cellSize + gap) + offset;
    return { x, y };
  };

  // Start countdown timer on mount
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

  // Animate timer bar width on timeLeft change
  useEffect(() => {
    const progress = (timeLeft / 60) * 100;
    anime({
      targets: timerRef.current,
      width: `${progress}%`,
      easing: 'linear',
      duration: 900
    });
  }, [timeLeft]);

  // Activate exit cell when all fragments are collected
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

  // Function to move the player using arrow buttons
  const movePlayer = (direction) => {
    const { row, col } = playerPos;
    let newRow = row;
    let newCol = col;
    if (direction === 'up') newRow = row - 1;
    if (direction === 'down') newRow = row + 1;
    if (direction === 'left') newCol = col - 1;
    if (direction === 'right') newCol = col + 1;
    
    // Check boundaries
    if (newRow < 0 || newRow >= maze.length || newCol < 0 || newCol >= maze[0].length) return;
    const cellValue = maze[newRow][newCol];
    if (cellValue === 1) return; // wall
    if (cellValue === 3) {
      // Trigger mini-puzzle if obstacle cell
      setMiniPuzzleCell({ row: newRow, col: newCol });
      setShowMiniPuzzle(true);
      return;
    }
    // Compute new position for the avatar
    const { x: endX, y: endY } = computeAvatarPosition(newRow, newCol);
    anime({
      targets: playerRef.current,
      translateX: endX,
      translateY: endY,
      easing: 'easeInOutQuad',
      duration: 300,
    });
    setPlayerPos({ row: newRow, col: newCol });
    
    // If cell is a memory fragment (2), collect it
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
    // If exit cell (4) and exit is active, win stage
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

  // Mini-puzzle for obstacle cell: require sequence [1, 2, 3]
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

  // Helper: move player immediately (after mini-puzzle success)
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

  // Animate a "shift" effect on wall cells every few seconds
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
      {/* Timer Bar */}
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
      {/* Maze Grid Container */}
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
                                  cell === 2 ? "#8f8" :  // memory fragment
                                  cell === 3 ? "#f80" :  // obstacle
                                  cell === 4 ? "#00f" :  // exit
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
        {/* Player Avatar: positioned absolutely within the maze container */}
        <div ref={playerRef} style={{
          position: "absolute",
          // Calculate position using our helper function:
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
      {/* Control Buttons */}
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
      {/* Mini-puzzle overlay for obstacle cells */}
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
