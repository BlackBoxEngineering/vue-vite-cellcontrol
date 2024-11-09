<template>
  <div ref="gridContainer" class="grid-container mx-auto" @mousedown="handleMouseDown" @mouseup="handleMouseUp"
    @mouseleave="handleMouseLeave">
    <div v-for="(cell, index) in cells" :key="index" class="cell" :style="{ background: colors[index] }"
      :class="{ active: cell }" @mouseenter="handleMouseEnter(index)" @click="toggleCell(index)">
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameGrid',
  props: {
    cellSize: { type: Number, default: 20 },
    underpopulation: { type: Number, default: 2 },
    crowding: { type: Number, default: 3 },
    reproduction: { type: Number, default: 3 }
  },
  data() {
    return {
      cells: [],
      lastCells: [],
      colors: [],
      originalColors: [],
      rows: 0,
      columns: 0,
      gameOn: false,
      speed: 50,
      isMouseDown: false,
      showColors: true
    };
  },
  methods: {
    calculateGridSize() {
      const container = this.$refs.gridContainer;
      if (container) {
        const containerWidth = container.clientWidth;
        const cellSize = this.cellSize;
        this.columns = Math.floor((containerWidth / cellSize) - 2);
        this.rows = this.columns;
        this.cells = Array(this.columns * this.rows).fill(false);
        this.colors = Array(this.columns * this.rows).fill('#808080');
        this.originalColors = Array(this.columns * this.rows).fill('#808080');
        this.lastCells = Array(this.columns * this.rows).fill(false);
        container.style.gridTemplateColumns = `repeat(${this.columns}, ${cellSize}px)`;
        container.style.gridTemplateRows = `repeat(${this.rows}, ${cellSize}px)`;
      }
    },
    toggleColors() {
      if (this.showColors) {
        // Restore original colors except for active cells which should remain yellow
        this.colors = this.cells.map((cell, index) => cell ? 'yellow' : this.originalColors[index]);
      } else {
        // Hide colors except for active cells which should remain yellow
        this.colors = this.cells.map((cell) => cell ? 'yellow' : '#808080');
      }
    },
    // Other methods remain unchanged...
    deactivateCells() {
      this.cells.forEach((cell, index) => {
        if (this.cells[index]) {
          this.cells[index] = false;
          this.colors[index] = this.getRandomGradient();
          this.originalColors[index] = this.colors[index];
        }
      });
      this.$emit('update-active-cells', 0);
      this.stopGame();
    },
    toggleCell(index) {
      this.cells.splice(index, 1, !this.cells[index]);
      if (this.cells[index]) {
        this.colors.splice(index, 1, 'yellow');
        this.originalColors.splice(index, 1, 'yellow');
      } else {
        const newColor = this.getRandomGradient();
        this.colors.splice(index, 1, newColor);
        this.originalColors.splice(index, 1, newColor);
      }
      const activeCellsCount = this.cells.filter(cell => cell).length;
      this.$emit('update-active-cells', activeCellsCount);
    },
    handleMouseDown() {
      this.isMouseDown = true;
    },
    handleMouseUp() {
      this.isMouseDown = false;
    },
    handleMouseLeave() {
      this.isMouseDown = false;
    },
    handleMouseEnter(index) {
      if (this.isMouseDown) {
        if (!this.cells[index]) {
          this.cells.splice(index, 1, true);
          this.colors.splice(index, 1, 'yellow');
          const activeCellsCount = this.cells.filter(cell => cell).length;
          this.$emit('update-active-cells', activeCellsCount);
        }
      }
    },
    startGame() {
      this.gameOn = true;
      this.$emit('game-on', true);
      this.runGameLogic();
    },
    stopGame() {
      this.gameOn = false;
      this.$emit('stop-game');
    },
    updateSpeed(_newSpeed) {
      this.speed = _newSpeed;
    },
    clearBoard() {
      this.cells = Array(this.columns * this.rows).fill(false);
      this.lastCells = Array(this.columns * this.rows).fill(false);
      this.colors = Array(this.columns * this.rows).fill('#808080');
      this.originalColors = Array(this.columns * this.rows).fill('#808080');  // Update original colors to grey
      this.stopGame();
    },
    getRandomRGBA() {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      const a = (Math.random() * (1 - 0.5) + 0.5).toFixed(2);
      return `${r},${g},${b},${a}`;
    },
    getRandomGradient() {
      const color1 = this.getRandomRGBA();
      const color2 = this.getRandomRGBA();
      const color3 = this.getRandomRGBA();
      return `radial-gradient(circle, rgba(${color1}) 0%, rgba(${color2}) 50%, rgba(${color3}) 100%)`;
    },
    countNeighbours(_cellArray, _rowIndex, _colIndex, _columns, _rows) {
      let neighbours = 0;
      for (let row = _rowIndex - 1; row <= _rowIndex + 1; row++) {
        for (let col = _colIndex - 1; col <= _colIndex + 1; col++) {
          if (row === _rowIndex && col === _colIndex) continue;
          if (row >= 0 && col >= 0 && row < _rows && col < _columns) {
            const index = row * _columns + col;
            if (_cellArray[index]) neighbours++;
          }
        }
      }
      return neighbours;
    },
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    runActiveCellRules(_cellArray, _index, _columns, _rows) {
      const rowIndex = Math.floor(_index / _columns);
      const colIndex = _index % _columns;
      const neighbours = this.countNeighbours(_cellArray, rowIndex, colIndex, _columns, _rows);
      if (neighbours < this.underpopulation) {
        //console.log(`[Under population] not enough neighbours ${neighbours}. To survive ${this.underpopulation} are needed`);
        return 0;
      }
      if (neighbours >= this.underpopulation && neighbours <= this.crowding) {
        if (neighbours > this.crowding) {
          //console.log(`[Overcrowded] by ${neighbours} neighbours, limit ${this.crowding}`);
          return 0;
        }
      } else {
        //console.log(`[Community] ${neighbours} neighbours. Require ${this.underpopulation} -  ${this.crowding} to survive`);
        return 0;
      }
      return 1;
    },
    runDeadCellRules(_cellArray, _index, _columns, _rows) {
      const rowIndex = Math.floor(_index / _columns);
      const colIndex = _index % _columns;
      const neighbours = this.countNeighbours(_cellArray, rowIndex, colIndex, _columns, _rows);
      return neighbours === this.reproduction ? 1 : 0;
    },
    runLiveSweep(_cellArray, _rows, _columns) {
      const copiedCellArray = _cellArray.concat();
      for (let index = 0; index < copiedCellArray.length; index++) {
        if (_cellArray[index]) {
          const result = this.runActiveCellRules(copiedCellArray, index, _columns, _rows);
          copiedCellArray[index] = result;
        }
      }
      return copiedCellArray;
    },
    runDeadSweep(_cellArray, _rows, _columns) {
      const copiedCellArray = _cellArray.concat();
      for (let index = 0; index < copiedCellArray.length; index++) {
        if (!_cellArray[index]) {
          const result = this.runDeadCellRules(copiedCellArray, index, _columns, _rows);
          copiedCellArray[index] = result;
        }
      }
      return copiedCellArray;
    },
    async automateGrid(_lastCells) {
      const liveSweep = await this.runLiveSweep(_lastCells, this.rows, this.columns);
      const deadSweep = await this.runDeadSweep(liveSweep, this.rows, this.columns);
      this.cells = deadSweep;
      this.cells.forEach((cell, index) => {
        if (cell) {
          this.colors[index] = '#ffc003';
        } else {
          if (this.lastCells[index]) {
            if (this.showColors) {
              this.colors[index] = this.getRandomGradient();
              this.originalColors[index] = this.colors[index];
            }else{
              this.colors[index] = '#808080';
            }
          }
        }
      });
      const activeCellsCount = this.cells.filter(cell => cell).length;
      this.$emit('update-active-cells', activeCellsCount);
      this.$emit('increment-counter');
    },

    async runGameLogic() {
      if (this.gameOn && !this.$props.isPopupActive) {
        if (this.isMatchedArrays(this.lastCells, this.cells)) {
          this.stopGame();
        } else {
          this.lastCells = [].concat(this.cells);
          await this.delay(this.speed);
          this.automateGrid(this.lastCells);
        }
      }
    },
    isMatchedArrays(_array1, _array2) {
      if (_array1.length !== _array2.length) return false;
      for (let i = 0; i < _array1.length; i++) {
        if (Array.isArray(_array1[i]) && Array.isArray(_array2[i])) {
          if (!this.isMatchedArrays(_array1[i], _array2[i])) return false;
        } else if (_array1[i] !== _array2[i]) {
          return false;
        }
      }
      return true;
    },
    arrayToObject(_array) {
      return _array.map(cell => ({ cellState: cell }));
    },
    objectToArray(_array) {
      return _array.map(cell => cell.cellState);
    }
  },
  watch: {
    showColors(newVal) {
      this.toggleColors();
    },
    cells: {
      deep: true,
      handler(newCells, oldCells) {
        if (!this.isMatchedArrays(newCells, oldCells)) {
          this.runGameLogic();
        } else {
          this.stopGame();
        }
      }
    },
    cellSize() {
      this.calculateGridSize();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.calculateGridSize();
      window.addEventListener('resize', this.calculateGridSize);
    });
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.calculateGridSize);
  }
};
</script>