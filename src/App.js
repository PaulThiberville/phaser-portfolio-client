import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import phaserGame from "./PhaserGame";

function App() {
  const [left, setLeft] = useState(false);
  const [right, setRight] = useState(false);
  const [up, setUp] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    phaserGame.scene.keys.helloworld.setVelocityXY(left, right, up, down);
  }, [left, right, up, down]);

  document.addEventListener("contextmenu", (event) => event.preventDefault());

  document.querySelector("html").addEventListener("mouseup", () => {
    setLeft(false);
    setRight(false);
    setUp(false);
    setDown(false);
  });

  document.querySelector("html").addEventListener("touchend", () => {
    setLeft(false);
    setRight(false);
    setUp(false);
    setDown(false);
  });

  return (
    <div className="arrows">
      <button onMouseDown={() => setUp(true)} onTouchStart={() => setUp(true)}>
        Up
      </button>
      <div className="horizontal-arrows">
        <button
          onMouseDown={() => setLeft(true)}
          onTouchStart={() => setLeft(true)}
        >
          Left
        </button>
        <button
          onMouseDown={() => setRight(true)}
          onTouchStart={() => setRight(true)}
        >
          Right
        </button>
      </div>
      <button
        onMouseDown={() => setDown(true)}
        onTouchStart={() => setDown(true)}
      >
        Down
      </button>
    </div>
  );
}

export default App;
