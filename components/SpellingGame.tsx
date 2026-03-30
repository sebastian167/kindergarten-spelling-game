"use client";

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

const WORDS = [
  "off", "day", "these", "water", "yellow", "be", "ran", 
  "most", "on", "lap", "gap", "map", "tap", "said", "want", 
  "people", "for", "half", "from", "how", "pretty", "am", 
  "ate", "bug", "tug", "jug", "hug", "rug", "down", "see", 
  "jump", "will", "funny", "work", "she", "up", "was", 
  "under", "fun", "sun", "bun"
];

// Shuffle an array
function shuffleArray(array: any[]) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export default function SpellingGame() {
  const [currentWord, setCurrentWord] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [status, setStatus] = useState<"playing" | "correct" | "wrong">("playing");
  const [score, setScore] = useState(0);
  const audioContextRef = useRef<boolean>(false);

  const initGame = (prevWord = "") => {
    // pick random word
    let nextWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    if (nextWord === prevWord && WORDS.length > 1) {
      while (nextWord === prevWord) {
         nextWord = WORDS[Math.floor(Math.random() * WORDS.length)];
      }
    }

    let nextOptions = [nextWord];
    while (nextOptions.length < 4) {
      const distractor = WORDS[Math.floor(Math.random() * WORDS.length)];
      if (!nextOptions.includes(distractor)) {
        nextOptions.push(distractor);
      }
    }

    setOptions(shuffleArray(nextOptions));
    setCurrentWord(nextWord);
    setStatus("playing");
  };

  useEffect(() => {
    initGame();
  }, []);

  // Whenever a new word is chosen and game is playing, automatically speak once if user has interacted before
  useEffect(() => {
    if (status === "playing" && currentWord && audioContextRef.current) {
      // Small delay just to let UI render first
      setTimeout(() => handleSpeak(), 300);
    }
  }, [currentWord, status]);

  const handleSpeak = () => {
    audioContextRef.current = true; // Mark user interaction
    if ("speechSynthesis" in window) {
      // Avoid overlapping speech
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance();
      msg.text = currentWord;
      msg.rate = 0.8; // slower for kids
      msg.pitch = 1.2; // friendly pitch
      msg.lang = "en-US";
      window.speechSynthesis.speak(msg);
    }
  };

  const checkAnswer = (selectedWord: string) => {
    audioContextRef.current = true; // Mark user interaction

    if (status !== "playing") return;

    if (selectedWord === currentWord) {
      setStatus("correct");
      setScore(s => s + 10);
      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FFC107', '#FF9800', '#4CAF50', '#2196F3', '#E91E63', '#9C27B0']
        });
      } catch (e) { }

      // Read a success message
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance("Great job!");
        msg.rate = 1;
        window.speechSynthesis.speak(msg);
      }
    } else {
      setStatus("wrong");
      // Read try again
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance("Nice try.");
        msg.rate = 1;
        window.speechSynthesis.speak(msg);
      }

      setTimeout(() => {
        setStatus("playing");
        handleSpeak();
      }, 1500);
    }
  };

  if (!currentWord) return null;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-blue-50/50 rounded-3xl shadow-xl w-full max-w-2xl mx-auto border-4 border-dashed border-blue-200">
      
      {/* Header & Score */}
      <div className="flex justify-between w-full mb-8 px-4 items-center">
        <h2 className="text-3xl font-extrabold text-blue-600 drop-shadow-sm font-sans tracking-tight">Listen & Pick!</h2>
        <div className="bg-yellow-400 text-yellow-900 font-bold px-4 py-2 rounded-full shadow-lg border-2 border-yellow-500 text-xl transform transition hover:scale-105">
          ⭐ Score: {score}
        </div>
      </div>

      {/* Speaker Button */}
      <div className="mb-12 text-center">
        <button 
          onClick={handleSpeak}
          className="btn btn-circle bg-pink-500 hover:bg-pink-400 border-none shadow-xl transform transition hover:scale-110 w-24 h-24"
          title="Listen to the word"
        >
          <span className="text-5xl text-white">🔊</span>
        </button>
        <p className="mt-4 text-gray-600 font-medium font-sans text-lg">Click to hear the magic word!</p>
      </div>

      {/* Multiple Choice Options */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {options.map((option, i) => {
          // Change colors dynamically for fun
          const colors = [
            "bg-emerald-400 hover:bg-emerald-300 border-emerald-500 text-emerald-950",
            "bg-sky-400 hover:bg-sky-300 border-sky-500 text-sky-950",
            "bg-amber-400 hover:bg-amber-300 border-amber-500 text-amber-950",
            "bg-indigo-400 hover:bg-indigo-300 border-indigo-500 text-indigo-950"
          ];
          const colorClass = colors[i % colors.length];

          const isWrongSelection = status === "wrong" && option !== currentWord;
          const isCorrectSelection = status === "correct" && option === currentWord;

          return (
            <button
              key={option}
              onClick={() => checkAnswer(option)}
              disabled={status === "correct"}
              className={`py-6 px-4 rounded-2xl text-3xl font-black border-b-8 shadow-md transform transition-all duration-200 
                ${colorClass}
                ${isCorrectSelection ? "ring-8 ring-green-300 scale-105" : ""}
                ${isWrongSelection ? "opacity-50 grayscale scale-95" : "hover:-translate-y-2 active:translate-y-2 active:border-b-0"}
              `}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Success Modal/Section */}
      {status === "correct" && (
        <div className="mt-8 animate-fade-in-up">
          <button 
            onClick={() => initGame(currentWord)}
            className="btn btn-lg bg-green-500 hover:bg-green-400 text-white border-none rounded-full px-12 text-2xl font-bold shadow-[0_6px_0_0_rgb(34,197,94)] active:shadow-none active:translate-y-[6px]"
          >
            Next Word ➔
          </button>
        </div>
      )}

      {/* Small Message */}
      {status === "wrong" && (
        <p className="mt-6 text-red-500 font-bold text-2xl animate-bounce">Nice try.</p>
      )}
      {status === "playing" && (
        <p className="mt-6 text-blue-400 font-medium text-lg">Which word did you hear?</p>
      )}

    </div>
  );
}
