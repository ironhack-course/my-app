import React, { useState } from 'react';
import './App.css';
import Cell from './components/cell'

function App(): React.ReactElement {
  const n = 40;
  const grid = [];
  const [gridColors, setGridColors] = useState(new Array(n**2).fill('white'));
  const [mouseClicked, setMouseClicked] = useState(false);

  const changeCellColor = (index: number) => {
    const copyGridColors = [...gridColors];
    copyGridColors[index] = 'green';
    setGridColors(copyGridColors);
  };

  const onMouseEnter = (index: number) => {
    if(mouseClicked) {
      changeCellColor(index)
    }
  }

  for (let i = 0; i < n**2; i++) {
    const newDiv = Cell(gridColors[i], i, onMouseEnter);
    grid.push(newDiv);
  }

  return (
    <div 
      className="App"
      onMouseDown={() => setMouseClicked(true)}
      onMouseUp={() => setMouseClicked(false)}
      onMouseLeave={() => setMouseClicked(false)}
    >
      {grid}
    </div>
  );
}

export default App;
