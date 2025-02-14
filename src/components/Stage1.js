import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import anime from "animejs";
import rewardImage from "../assets/IMG_20240719_133322.jpg";

const Stage1 = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(1);
  const [riddleAnswer, setRiddleAnswer] = useState("");
  const secretCode = ["O", "P", "E", "N"];
  const [collectedLetters, setCollectedLetters] = useState([]);
  const [assembledCode, setAssembledCode] = useState([]);
  const [proposalDate, setProposalDate] = useState("");
  const correctProposalDate = "2024-05-24";
  const audioRef = useRef(null);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.warn("Autoplay prevented; user interaction is required.", err);
      });
    }
  }, []);

  const handleRiddleSubmit = (e) => {
    e.preventDefault();
    if (riddleAnswer.trim().toLowerCase() === "echo") {
      setCollectedLetters(["O"]);
      anime({
        targets: ".riddle-message",
        opacity: [0, 1],
        translateY: [20, 0],
        easing: "easeOutExpo",
        duration: 1000,
      });
      setTimeout(() => {
        setPhase(2);
      }, 1500);
    } else {
      alert("Incorrect answer! Try again.");
    }
  };

  const handleClueClick = (letter) => {
    if (!collectedLetters.includes(letter)) {
      anime({
        targets: `#clue-${letter}`,
        scale: [1, 1.2, 1],
        rotate: [0, 20, 0],
        easing: "easeOutElastic(1, .8)",
        duration: 800,
      });
      setCollectedLetters((prev) => [...prev, letter]);
    }
  };

  useEffect(() => {
    if (phase === 2 && collectedLetters.length === secretCode.length) {
      setTimeout(() => {
        setPhase(3);
      }, 1000);
    }
  }, [collectedLetters, phase, secretCode.length]);

  const handleAssembleLetter = (letter) => {
    if (assembledCode.length < secretCode.length) {
      setAssembledCode((prev) => [...prev, letter]);
    }
  };

  useEffect(() => {
    if (phase === 3 && assembledCode.length === secretCode.length) {
      if (assembledCode.join("") === secretCode.join("")) {
        anime({
          targets: ".assembly-complete",
          opacity: [0, 1],
          translateY: [20, 0],
          easing: "easeOutExpo",
          duration: 1500,
        });
        setTimeout(() => {
          setPhase(4);
        }, 1500);
      } else {
        alert("Incorrect code assembly. Please try again!");
        setAssembledCode([]);
      }
    }
  }, [assembledCode, phase, secretCode]);

  const handleProposalSubmit = (e) => {
    e.preventDefault();
    if (proposalDate.trim() === correctProposalDate) {
      setPhase(5);
      anime({
        targets: ".proposal-message",
        opacity: [0, 1],
        scale: [0.8, 1.2, 1],
        easing: "easeOutElastic(1, .8)",
        duration: 1000,
      });
    } else {
      alert("That date is incorrect. Try again!");
    }
  };

  useEffect(() => {
    if (phase === 5) {
      anime({
        targets: ".reward-image",
        opacity: [0, 1],
        scale: [0.5, 1.2, 1],
        rotate: [0, 360],
        easing: "easeOutElastic(1, .8)",
        duration: 2000,
      });
      setTimeout(() => {
        navigate("/Stage2"); 
      }, 4000);
    }
  }, [phase, navigate]);

  return (
    <div
      style={{
        backgroundColor: "#e8f0fe",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        textAlign: "center",
        position: "relative",
      }}
    >
      <audio ref={audioRef} src="/Varaha-Nadhikarai-Oram.mp3" loop />
      
      {phase === 1 && (
        <div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
            Stage 1: The Abduction – Riddle Challenge!
          </h1>
          <p style={{ fontSize: "1.2rem", maxWidth: "600px", marginBottom: "1.5rem" }}>
            Your husband has been abducted by a mischievous villain who loves riddles.
            Solve this riddle to retrieve your first clue:
          </p>
          <p style={{ fontSize: "1.2rem", fontStyle: "italic", marginBottom: "1rem" }}>
            "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?"
          </p>
          <form onSubmit={handleRiddleSubmit}>
            <input
              type="text"
              value={riddleAnswer}
              onChange={(e) => setRiddleAnswer(e.target.value)}
              placeholder="Enter your answer"
              style={{
                padding: "0.5rem",
                fontSize: "1rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                marginRight: "0.5rem",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                borderRadius: "4px",
                border: "none",
                background: "#FF69B4",
                color: "white",
                cursor: "pointer",
              }}
            >
              Submit Answer
            </button>
          </form>
          <div className="riddle-message" style={{ opacity: 0, marginTop: "1rem" }}>
            {riddleAnswer.trim().toLowerCase() === "echo" && (
              <p>Correct! Clue acquired: "O"</p>
            )}
          </div>
        </div>
      )}

      {phase === 2 && (
        <div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
            Stage 1: The Abduction – Clue Collection!
          </h1>
          <p style={{ fontSize: "1.2rem", maxWidth: "600px", marginBottom: "2rem" }}>
            Great job on the riddle! Now, collect the remaining clues by clicking on these mysterious boxes.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            {["P", "E", "N"].map((letter, index) => (
              <div
                key={index}
                id={`clue-${letter}`}
                onClick={() => handleClueClick(letter)}
                style={{
                  width: "80px",
                  height: "80px",
                  border: "2px solid #FF69B4",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  cursor: "pointer",
                  backgroundColor: collectedLetters.includes(letter) ? "#FF69B4" : "#fff",
                  color: collectedLetters.includes(letter) ? "#fff" : "#FF69B4",
                  opacity: collectedLetters.includes(letter) ? 1 : 0.8,
                  transition: "background-color 0.3s, color 0.3s",
                }}
              >
                {collectedLetters.includes(letter) ? letter : "?"}
              </div>
            ))}
          </div>
        </div>
      )}

      {phase === 3 && (
        <div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
            Stage 1: The Abduction – Assemble the Code!
          </h1>
          <p style={{ fontSize: "1.2rem", maxWidth: "600px", marginBottom: "1.5rem" }}>
            You have collected all clues! Now, arrange the letters in the correct order.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "1rem" }}>
            {collectedLetters
              .slice()
              .sort(() => Math.random() - 0.5)
              .map((letter, index) => (
                <button
                  key={index}
                  onClick={() => handleAssembleLetter(letter)}
                  style={{
                    padding: "0.5rem 1rem",
                    fontSize: "1.5rem",
                    borderRadius: "4px",
                    border: "2px solid #FF69B4",
                    background: "#fff",
                    color: "#FF69B4",
                    cursor: "pointer",
                  }}
                >
                  {letter}
                </button>
              ))}
          </div>
          <div style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>
            Assembled Code: {assembledCode.join("")}
          </div>
          <div className="assembly-complete" style={{ opacity: 0 }}>
            <p style={{ fontSize: "1.5rem", color: "#FF69B4" }}>
              Congratulations! The code is: {secretCode.join("")}
            </p>
          </div>
        </div>
      )}

      {phase === 4 && (
        <div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
            Stage 1: The Abduction – One More Question!
          </h1>
          <p style={{ fontSize: "1.2rem", maxWidth: "600px", marginBottom: "1.5rem" }}>
            Tell me, when did I first propose to you? Please enter the date (in YYYY-MM-DD format).
          </p>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (proposalDate.trim() === correctProposalDate) {
              setPhase(5);
              anime({
                targets: ".proposal-message",
                opacity: [0, 1],
                scale: [0.8, 1.2, 1],
                easing: "easeOutElastic(1, .8)",
                duration: 1000,
              });
            } else {
              alert("That date is incorrect. Try again!");
            }
          }}>
            <input
              type="text"
              value={proposalDate}
              onChange={(e) => setProposalDate(e.target.value)}
              placeholder="e.g., 2020-05-14"
              style={{
                padding: "0.5rem",
                fontSize: "1rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                marginRight: "0.5rem",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                borderRadius: "4px",
                border: "none",
                background: "#FF69B4",
                color: "white",
                cursor: "pointer",
              }}
            >
              Submit Answer
            </button>
          </form>
          <div className="proposal-message" style={{ opacity: 0, marginTop: "1rem" }}>
            {proposalDate === correctProposalDate && <p>Correct! Preparing your reward...</p>}
          </div>
        </div>
      )}

      {phase === 5 && (
        <div className="reward-image" style={{ opacity: 0, marginTop: "2rem" }}>
          <img
            src={rewardImage}
            alt="Reward"
            style={{
              width: "300px",
              borderRadius: "8px",
              boxShadow: "0px 4px 8px rgba(0,0,0,0.3)",
            }}
          />
          <p style={{ fontSize: "1.5rem", color: "#FF69B4", marginTop: "1rem" }}>
            You've unlocked the ultimate reward!
          </p>
        </div>
      )}
    </div>
  );
};

export default Stage1;
