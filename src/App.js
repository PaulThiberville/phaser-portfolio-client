import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import phaserGame from "./PhaserGame";

function App() {
  const [left, setLeft] = useState(false);
  const [right, setRight] = useState(false);
  const [up, setUp] = useState(false);
  const [down, setDown] = useState(false);
  const scene = phaserGame.scene.keys.helloworld;

  useEffect(() => {
    scene.setVelocityXY(left, right, up, down);
  }, [left, right, up, down]);

  document.querySelector("html").addEventListener("mouseup", () => {
    setLeft(false);
    setRight(false);
    setUp(false);
    setDown(false);
  });

  return (
    <div className="arrows">
      <button onMouseDown={() => setUp(true)}>Up</button>
      <div className="horizontal-arrows">
        <button onMouseDown={() => setLeft(true)}>Left</button>
        <button onMouseDown={() => setRight(true)}>Right</button>
      </div>
      <button onMouseDown={() => setDown(true)}>Down</button>
    </div>
  );
}

export default App;
