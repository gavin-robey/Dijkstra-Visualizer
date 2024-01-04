function CreateAdjacencyMatrix(numNodes: number, rows: number, cols: number, barriers: number[]): number[][] {
    const numCols = cols;
    const numRows = rows;
    
    const adjacencyMatrix: number[][] = [];

    // Initialize the adjacency matrix and set all entries to 0
    for (let i = 0; i < numNodes; i++) {
        adjacencyMatrix[i] = new Array(numNodes).fill(0);
    }

    // Populate the adjacency matrix for a grid
    for (let i = 0; i < numNodes; i++) {
        const row = Math.floor(i / numCols);
        const col = i % numCols;

        // Connect to the right neighbor
        if (col < numCols - 1) {
            adjacencyMatrix[i][i + 1] = 1;
        }

        // Connect to the left neighbor
        if (col > 0) {
            adjacencyMatrix[i][i - 1] = 1;
        }

        // Connect to the upper neighbor
        if (row > 0) {
            adjacencyMatrix[i][i - numCols] = 1;
        }

        // Connect to the lower neighbor
        if (row < numRows - 1) {
            adjacencyMatrix[i][i + numCols] = 1;
        }
    }

    // Remove connections to and from barrier nodes
    for (let node of barriers) {
        for (let i = 0; i < numNodes; i++) {
            adjacencyMatrix[node][i] = 0;
            adjacencyMatrix[i][node] = 0;
        }
    }

    return adjacencyMatrix;
}

export default CreateAdjacencyMatrix;