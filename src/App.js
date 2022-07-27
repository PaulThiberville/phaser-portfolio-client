import React, { useEffect, useState } from "react";
import "./App.css";
import phaserGame from "./PhaserGame";

function App() {
  const [left, setLeft] = useState(false);
  const [right, setRight] = useState(false);
  const [up, setUp] = useState(false);
  const [down, setDown] = useState(false);
  const [text, setText] = useState("");

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

  const handleSendMessage = () => {
    if (text === "") return;
    phaserGame.scene.keys.helloworld.sendMessage(text);
    setText("");
  };

  return (
    <div className="App">
      <div className="chat">
        <input
          type="text"
          maxLength={25}
          onChange={(e) => setText(e.target.value)}
          value={text}
          className="round-left"
        ></input>
        <button className="round-right" onClick={() => handleSendMessage()}>
          <i className="fa fa-paper-plane" aria-hidden="true"></i>
        </button>
      </div>
      <div className="gamePad">
        <div className="arrows">
          <button
            className="verticalButton round-up"
            onMouseDown={() => setUp(true)}
            onTouchStart={() => setUp(true)}
          >
            <i className="fa fa-caret-up"></i>
          </button>
          <div className="horizontal-arrows">
            <button
              className="horizontalButton round-left"
              onMouseDown={() => setLeft(true)}
              onTouchStart={() => setLeft(true)}
            >
              <i className="fa fa-caret-left"></i>
            </button>
            <button
              className="horizontalButton round-right"
              onMouseDown={() => setRight(true)}
              onTouchStart={() => setRight(true)}
            >
              <i className="fa fa-caret-right"></i>
            </button>
          </div>
          <button
            className="verticalButton round-down"
            onMouseDown={() => setDown(true)}
            onTouchStart={() => setDown(true)}
          >
            <i className="fa fa-caret-down"></i>
          </button>
        </div>
        <button className="roundButton">A</button>
      </div>
    </div>
  );
}

export default App;
