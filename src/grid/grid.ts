interface GameInterface {
    w: number,
    step: number,
    grid: Array<Cell>,
    stack: Array<Cell>,
    rows: number,
    cols: number
}

export default class Game implements GameInterface {
    private w;
    private step;
    // remove
    private ctx;
    private grid: Array<Cell>;
    private stack: Array<Cell>;
    private rows;
    private cols;

    constructor(width: number, height: number, ctx: number) {
        this.w = 40;
        this.step = 0;
        this.ctx = ctx;
        this.grid = [];
        this.stack = [];
        this.rows = height / this.w;    
        this.cols = width / this.w;
    }

    setup() {
        for (let y = 0; y < this.rows; y++) {
            for(let x = 0; x < this.cols; x++) {
                const cell = new Cell(x, y, this.grid.length, this.ctx);
                this.grid.push(cell);
            }
        }
        this.current = this.grid[0];
        this.interval = setInterval(this.draw, 20);
    }

    killSolve() {
        clearInterval(this.solveStack);
    }

    resetTheMaze() {
        this.grid = this.resetMaze;
    }

    solveStep = () => {
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.width, this.height);
        for(const cell of this.grid) {
            cell.show(this.w);
            this.current.show(this.w, true);
        }
        this.current.solved = true;
        this.current.solution = true;
        // if bfs shift if dfs pop
        const next = this.stack.pop();

        this.step = next?.step;
        if(this.current.goal) {
            console.log('solved', this.grid.length, this.current.step, this.grid.filter(c => c.solved).length, this.grid.filter(c => c.solution).length);
            clearInterval(this.solveStack);
        }
        if(next) {
            this.grid.forEach(n => {
                if(n.step >= next.step) n.solution = false;
            });
            const neighbors = next.neighbors.reduce((a,v) => !v.solved ? (v.step = v.step ? v.step : next.step + 1, [...a, v]) : a, []);
            this.stack.push(...neighbors);
            this.current = next;
            next.solved = true;
            this.current.solution = true;
        }
    }

    draw = () => {
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, width, height);
        for(const cell of this.grid) {
            cell.show(this.w);
            this.current.show(this.w, true);
        }
        this.current.visited = true;
        const next = this.current.checkNeighbors(this.rows, this.grid);
        if(next) {
            this.removeWalls(this.current, next);
            this.stack.push(next);
            this.current = next;
            next.visited = true;
        } else if(this.stack.length) {
            this.current = this.stack.pop();
        } else {
            this.current = this.grid[0];
            this.current.step = 0;
            this.draw(); 

            // init neighbors for 0
            const neighbors = this.current.neighbors.reduce((a,v) => !v.solved ? (v.step = this.current.step + 1, [...a, v]) : a, []);
            this.stack.push(...neighbors);

            // clear drawing interval
            clearInterval(this.interval);
            // set a goal
            const goal = this.grid[this.grid.length - 1];
            goal.goal = true;
            console.log('goal', goal.x, goal.y)
            
            //reset the maze
            this.resetMaze = this.grid.map(c => ({...c}));
        }
    }
    
    solve = () => {
        // call the solve
        this.solveStack = setInterval(this.solveStep, 20);
    }


    removeWalls(current, next) {
        current.neighbors.push(next);
        next.neighbors.push(current);
        const res = current.index - next.index;
        if(res > 1) {
            current.walls[3] = false;
            next.walls[1] = false;   
        }
        if(res === 1) { 
            current.walls[0] = false;
            next.walls[2] = false;
        }
        if(res < -1) {
            current.walls[1] = false;
            next.walls[3] = false;
        }
        if(res === -1) {
            current.walls[2] = false;
            next.walls[0] = false;
        }
    }
}

class Cell {
    constructor(x, y, i, ctx) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.index = i;
        this.walls = [true, true, true, true];
        this.visited = false;
        // change
        this.solved = false;
        this.solution = false;
        this.neighbors = [];
    }
    show(w, current) {
        const x = this.x * w;
        const y = this.y * w;
        this.ctx.strokeStyle = '#000';
        let color =  '#00F';
        if(this.solved) {
            color = '#96A';
        }
        if(this.solved && this.solution) {
            color = '#749';
        } 
        if(current) color = this.solved ? '#22C5E9' : '#A42'
        if (this.walls[0])
            this.drawLine(ctx, x, y, x, y + w);
        if (this.walls[1])
            this.drawLine(ctx, x, y + w, x + w, y + w);
        if (this.walls[2])
            this.drawLine(ctx, x + w, y + w, x + w, y);
        if (this.walls[3])
            this.drawLine(ctx, x + w, y, x, y);
        if(this.visited) {
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, w, w);
        }
    }
    drawLine(ctx, startX, startY, endX, endY) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke(); 
    }
    checkNeighbors(rows, grid) {
        const neighbors = [];
        const top = grid[this.index - rows]; 
        const rgt = (this.index + 1) % rows && grid[this.index + 1];
        const btm = grid[this.index + rows]; 
        const lft = this.index % rows && grid[this.index - 1];
        const { floor, random } = Math;
        if(top && !top.visited) {
            neighbors.push(top);
        }
        if(rgt && !rgt.visited) {
            neighbors.push(rgt);
        }
        if(btm && !btm.visited) {
            neighbors.push(btm);
        }
        if(lft && !lft.visited) {
            neighbors.push(lft);
        }
        
        const randomIndex = floor(random() * neighbors.length);
        return neighbors[randomIndex] || undefined;
    }

    getNeighbors() {

    }
}