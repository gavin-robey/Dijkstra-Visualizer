import React, { useState, useRef } from 'react' 
import Graph from './Graph'
import CreateAdjacencyMatrix from './CreateAdjacencyMatrix';
import Box from './Box';
import { View, Button, SafeAreaView, StyleSheet } from 'react-native';


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
      addBarrier(node);
      setGrid((prevGrid) => {
          const newGrid = [...prevGrid];
          newGrid[row][col] = { ...newGrid[row][col], isBarrier: !newGrid[row][col].isBarrier, isStart: false, isEnd: false };
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

  return (
    <SafeAreaView style={styles.container}>
      <Button 
      title="create path" 
      onPress={
        () => {
          if(startEndInit){
            const numNodes = colSize * rowSize;
            const adjacencyMatrix: number[][] = CreateAdjacencyMatrix(numNodes, rowSize, colSize, barriers);
            const graph = new Graph(numNodes, adjacencyMatrix, colSize);

            const startNode = start; // get from user input
            const endNode = end; // get from user input

            const visitedNodes = graph.getVisitedNodes()
            const shortestPath = graph.findShortestPath(startNode, endNode);

            var stopLoop = false;
            var count = 0;
            visitedNodes.forEach(node => {
              setTimeout(() => {
                count++;
                if ((node.node + 1) === endNode) { 
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
        }}/>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "rgb(234, 234, 234)",
    justifyContent: 'center',
    alignItems: 'center',
  },
  title : {
    fontSize: 40,
    margin: 30,
  },
  gridContainer: {
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default App;
