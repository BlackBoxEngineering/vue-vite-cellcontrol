<template>
	<div class="min-h-screen flex flex-col items-start pt-8 overflow-y-auto bg-cover bg-center"
	  style="background-image: url('@/assets/organic-background.png');">
	  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mx-auto">
		<div class="min-w-[300px] bg-[#263059d2] border border-[#ffc003cc] rounded-2xl shadow-lg">
		  <h2 class="text-2xl font-bold text-[#ffc003cc] tracking-wider text-center"
			style="font-family: 'Lobster', cursive;">
			Cells
		  </h2>
		  <div class="flex justify-center items-center">
			<GameGrid ref="gameGrid" :cell-size="cellSize" :underpopulation="underpopulation"
			  :crowding="crowding" :reproduction="reproduction" @stop-game="onGameStop"
			  @increment-counter="incrementCounter" @update-active-cells="updateActiveCells" />
		  </div>
		</div>
		<div class="min-w-[300px] bg-[#263059d2] border border-[#ffc003cc] rounded-2xl shadow-lg">
		  <h2 class="text-2xl font-bold text-[#ffc003cc] tracking-wider text-center"
			style="font-family: 'Lobster', cursive;">
			Controls
		  </h2>
		  <ControlsPanel :game-on="gameOn" :counter="counter" :active-cells="activeCells"
			:underpopulation="underpopulation" :crowding="crowding" :reproduction="reproduction"
			@update-cell-size="updateCellSize" @start-game="startGame" @clear-grid="clearGrid"
			@stop-game="stopGame" @update-speed="updateSpeed" @update-underpopulation="updateUnderpopulation"
			@update-crowding="updateCrowding" @update-reproduction="updateReproduction"
			@deactivate-cells="deactivateCells" @toggle-colors="toggleColors" />
		</div>
	  </div>
	</div>
  </template>
  
  <script>
  import GameGrid from './GameGrid.vue';
  import ControlsPanel from './ControlsPanel.vue';
  
  export default {
	name: 'MainLayout',
	components: {
	  GameGrid,
	  ControlsPanel
	},
	data() {
	  return {
		cellSize: 20,
		gameOn: false,
		speed: 50,
		counter: 0,
		activeCells: 0,
		underpopulation: 2,
		crowding: 3,
		reproduction: 3,
		showColors: true
	  };
	},
	methods: {
	  updateCellSize(_newSize) { this.cellSize = _newSize; },
	  updateSpeed(_newSpeed) { this.$refs.gameGrid.updateSpeed(_newSpeed); },
	  startGame() { this.gameOn = true; this.counter = 0; this.$refs.gameGrid.startGame(); },
	  clearGrid() { this.$refs.gameGrid.clearBoard(); this.counter = 0; this.activeCells = 0; },
	  stopGame() { this.gameOn = false; this.$refs.gameGrid.stopGame(); },
	  onGameStop() { this.gameOn = false; },
	  incrementCounter() { this.counter++; },
	  updateActiveCells(count) { this.activeCells = count; },
	  deactivateCells() { this.$refs.gameGrid.deactivateCells(); this.activeCells = 0; },
	  updateUnderpopulation(value) { this.underpopulation = value; },
	  updateCrowding(value) { this.crowding = value; },
	  updateReproduction(value) { this.reproduction = value; },
	  toggleColors(showColors) {
		this.$refs.gameGrid.showColors = showColors;
		this.$refs.gameGrid.toggleColors();
	  }
	}
  };
  </script>
  