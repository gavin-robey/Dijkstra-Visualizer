class Graph {
    private readonly vertices: number;
    private readonly adjacencyMatrix: number[][];
    private visited : boolean[] = [];
    private distances : {row: number, col : number, node: number, distance: number}[] = []
    private maxDistance : number = 0;
    private colSize : number;

    constructor(vertices: number, adjacencyMatrix: number[][], colSize : number) {
        this.vertices = vertices;
        this.visited = new Array(this.vertices).fill(false)
        this.adjacencyMatrix = adjacencyMatrix;
        this.colSize = colSize;
    }

    dijkstra(startVertex: number): number[] {
        const distance: number[] = new Array(this.vertices).fill(Number.MAX_SAFE_INTEGER);

        distance[startVertex - 1] = 0;

        for (let count = 0; count < this.vertices - 1; count++) {
            const u = this.minDistance(distance, this.visited);
            this.visited[u] = true;
            

            for (let v = 0; v < this.vertices; v++) {
                if (!this.visited[v] && this.adjacencyMatrix[u][v] && distance[u] !== Number.MAX_SAFE_INTEGER &&
                    distance[u] + this.adjacencyMatrix[u][v] < distance[v]) {
                    distance[v] = distance[u] + this.adjacencyMatrix[u][v];

                    if(distance[v] > this.maxDistance){
                        this.maxDistance = distance[v];
                    }

                    // object in charge of 
                    this.distances.push({row : Math.floor(v / this.colSize), col : v % this.colSize, node : v, distance : distance[v]})
                }
            }
        }
        return distance;
    }

    getVisitedNodes(){
        return this.distances.sort((a, b) => a.distance - b.distance);
    }

    getMaxDistance(): number{
        return this.maxDistance;
    }

    private minDistance(distance: number[], visited: boolean[]): number {
        let min = Number.MAX_SAFE_INTEGER;
        let minIndex = -1;

        for (let v = 0; v < this.vertices; v++) {
            if (!visited[v] && distance[v] <= min) {
                min = distance[v];
                minIndex = v;
            }
        }
        return minIndex;
    }

    findShortestPath(startNode: number, endNode: number): number[] {
        const distances = this.dijkstra(startNode);
        const path: number[] = [];

        let current = endNode - 1;

        while (current !== startNode - 1) {
            path.unshift(current + 1);
            for (let v = 0; v < this.vertices; v++) {
                if (this.adjacencyMatrix[current][v] === 1 &&
                    distances[current] === distances[v] + this.adjacencyMatrix[current][v]) {
                    current = v;
                    break;
                }
            }
        }

        path.unshift(startNode);
        return path;
    }
}

export default Graph;
