import React, { useState } from 'react' ;
import { View, Button, SafeAreaView, StyleSheet } from 'react-native';

import CreateAdjacencyMatrix from './CreateAdjacencyMatrix';
import Graph from './Graph';
import Box from './Box';
import styles from './style.js';


function App(): React.JSX.Element {
  const [barriers, setBarriers] = useState<number[]>([]);
  const [start, setStart] = useState(-1);
  const [end, setEnd] = useState(-1);
  const [startEndInit, setStartEndInit] = useState(false);
  const [grid, setGrid] = useState<{ 
    onVisited: boolean; 
    isPath: boolean;
    isStart : boolean;
    isEnd : boolean;
    isBarrier : boolean;
  }[][]>(
    Array.from({ length: 13 }, () => Array(8).fill({ onVisited: false, isPath: false}))
  );
  const colSize = grid[0].length;
  const rowSize = grid.length;


  const addBarrier = (newBarrier: number) => {
    setBarriers((prevBarriers) => [...prevBarriers, newBarrier]);
  };

  const removeBarrier = (barrier : number) => {
    const newArray = barriers.filter(item => item !== barrier);
    setBarriers([]);
    setBarriers(newArray);
  }

  const handleBoxClick = (row: number, col: number) => { 
    let node = ((row * colSize) + (col + 1)) - 1;

    if (start === -1) {
      // First box clicked becomes the start node
      setStart(node + 1);
      setEnd(-1);
      setGrid((prevGrid) => {
          const newGrid = [...prevGrid];
          newGrid[row][col] = { ...newGrid[row][col], isBarrier: false, isStart: true, isEnd : false };
          return newGrid;
      });
    } else if (end === -1) {
      // Second box clicked becomes the end node
      setEnd(node + 1);
      setStartEndInit(true);
      setGrid((prevGrid) => {
          const newGrid = [...prevGrid];
          newGrid[row][col] = { ...newGrid[row][col], isBarrier: false, isStart: false, isEnd: true };
          return newGrid;
      });
    } else {
      // Any subsequent clicks add barriers
      setGrid((prevGrid) => {
          const newGrid = [...prevGrid];
          newGrid[row][col] = { ...newGrid[row][col], isBarrier: !newGrid[row][col].isBarrier, isStart: false, isEnd: false };
          if(newGrid[row][col].isBarrier){
            addBarrier(node);
          }else{
            removeBarrier(node);
          }
          return newGrid;
      });
    }
  };

  const updateVisited = (row : number, col : number) => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[row][col] = { ...newGrid[row][col], onVisited: true };
      return newGrid;
    });
  };

  const updatePath = (row : number, col : number) => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[row][col] = { ...newGrid[row][col], isPath: true, onVisited: false };
      return newGrid;
    });
  };

  const resetGrid = () => {
    setStart(-1); // resets the start node 
    setEnd(-1); // resets the end node
    setBarriers([]); // resets all barriers
    setStartEndInit(false); // the start and end node are no longer initialized
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => {
        return row.map((cell) => {
          // Set specific properties to false for each cell
          return {
            ...cell,
            isBarrier: false,
            isStart: false,
            isEnd: false,
            isPath: false,
            onVisited: false,
          };
        });
      });
      return newGrid;
    }); 
  }

  const runSimulation = () => {
    if(startEndInit){
      const numNodes = colSize * rowSize;
      const adjacencyMatrix: number[][] = CreateAdjacencyMatrix(numNodes, rowSize, colSize, barriers);
      const graph = new Graph(numNodes, adjacencyMatrix, colSize);
      const visitedNodes = graph.getVisitedNodes()
      const shortestPath = graph.findShortestPath(start, end);

      var stopLoop = false;
      var count = 0;
      visitedNodes.forEach(node => {
        setTimeout(() => {
          count++;
          if ((node.node + 1) === end) { 
            stopLoop = true;
            animateShortestPath();
          } 

          if (!stopLoop) { updateVisited(node.row, node.col); }
        }, count);
      }); 
      
      let counter = 0;
      const animateShortestPath = () => {
        if (counter < shortestPath.length) {
          const node = shortestPath[counter];
          setTimeout(() => {
            updatePath(Math.floor((node - 1) / colSize), (node - 1) % colSize);
            counter++;
            animateShortestPath();
          }, 10);
        }
      };
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Reset" onPress={ () => { resetGrid(); }}/>
      <Button title="Create Path" onPress={ () => { runSimulation(); }}/>
      <View style={styles.gridContainer}>
        {grid.map((row, rowIndex) => (
          row.map((_, colIndex) => (
            <Box
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              onVisited={grid[rowIndex][colIndex].onVisited}
              onPathCreation={grid[rowIndex][colIndex].isPath}
              isBarrier={grid[rowIndex][colIndex].isBarrier}
              isStart={grid[rowIndex][colIndex].isStart}
              isEnd={grid[rowIndex][colIndex].isEnd}
              onClick={() => handleBoxClick(rowIndex, colIndex)}
            />
          ))
        ))}
      </View>
    </SafeAreaView>
  );
};

export default App;
