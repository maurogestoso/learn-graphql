import React from "react";

import "./ButtonWithCounter.css";

const ButtonWithCounter = ({ count, children, onClick }) => (
  <div className="ButtonWithCounter">
    <button onClick={onClick}>{children}</button>
    <div>
      <span>{count}</span>
    </div>
  </div>
);

export default ButtonWithCounter;
