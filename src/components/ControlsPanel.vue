<template>
	<div class="controls-panel p-4 bg-[#263059d2] rounded-2xl shadow-lg">
		<div class="flex space-x-4 justify-center">
			<button @click="startGame"
				class="control-button bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Start</button>
			<button @click="stopGame"
				class="control-button bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">Stop</button>
			<button @click="deactivateCells"
				class="control-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Clear</button>
			<button @click="clearGrid"
				class="control-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Clean</button>
		</div>
		<div class="grid grid-cols-2 gap-1 mb-4 justify-items-left p-4">
			<div class="text-xl text-[#ffc003cc] mb-2">Cycles: {{ counter }}</div>
			<div class="text-xl text-[#ffc003cc] mb-2">Active Cells: {{ activeCells }}</div>
		</div>
		<div class="flex justify-center mt-4 space-x-4 mb-6">
			<button @click="showModal = true"
				class="control-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Game Rules
				Explained</button>
			<button @click="resetSliders"
				class="control-button bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Reset to
				Defaults</button>
		</div>
		<div v-if="showModal" class="modal">
			<div class="modal-content">
				<span @click="showModal = false" class="close">&times;</span>
				<div class="text-yellow-500 font-bold text-md mt-6 space-y-2 backdrop-blur-3xl">
					<p>1. Any live cell with fewer than {{internalUnderpopulation }} live neighbors dies due to underpopulation.</p>
					<p>2. Any live cell with more than {{internalCrowding }} neighbors dies due to overcrowding.</p>
					<p>3. Any dead cell with exactly {{internalReproduction }} live neighbors can reproduce.</p>					
				</div>
			</div>
		</div>
		<div class="flex justify-center my-4">
			<label class="text-xl text-[#ffc003cc] mb-2">Show Cell Colors</label>
			<input type="checkbox" v-model="showColors" @change="toggleColors" class="ml-2" />
		</div>
		<div class="flex flex-col items-center mb-4">
			<label for="cellSizeSlider" class="text-xl text-[#ffc003cc] mb-2">Cell Size: {{ cellSize }}px</label>
			<input id="cellSizeSlider" type="range" min="20" max="50" v-model.number="cellSize" :disabled="gameOn"
				@input="updateCellSize" class="slider" />
		</div>
		<div class="flex flex-col items-center mb-4">
			<label for="speedSlider" class="text-xl text-[#ffc003cc] mb-2">Speed: {{ speed }}ms</label>
			<input id="speedSlider" type="range" min="50" max="500" step="50" v-model.number="speed"
				@input="updateSpeed" class="slider" />
		</div>
		<div class="flex flex-col items-center my-4">
			<label for="underpopulationSlider" class="text-xl text-[#ffc003cc] mb-2">Underpopulation: {{
				internalUnderpopulation }}</label>
			<input id="underpopulationSlider" type="range" min="0" max="8" v-model.number="internalUnderpopulation"
				@input="emitUnderpopulation" class="slider" />
		</div>
		<div class="flex flex-col items-center mb-4">
			<label for="crowdingSlider" class="text-xl text-[#ffc003cc] mb-2">Crowding: {{ internalCrowding }}</label>
			<input id="crowdingSlider" type="range" min="0" max="8" v-model.number="internalCrowding"
				@input="emitCrowding" class="slider" />
		</div>
		<div class="flex flex-col items-center mb-4">
			<label for="reproductionSlider" class="text-xl text-[#ffc003cc] mb-2">Reproduction: {{ internalReproduction
				}}</label>
			<input id="reproductionSlider" type="range" min="0" max="8" v-model.number="internalReproduction"
				@input="emitReproduction" class="slider" />
		</div>
	</div>
</template>

<script>
export default {
	name: 'ControlsPanel',
	props: {
		gameOn: Boolean,
		counter: Number,
		activeCells: Number,
		underpopulation: Number,
		crowding: Number,
		reproduction: Number
	},
	data() {
		return {
			internalUnderpopulation: this.underpopulation,
			internalCrowding: this.crowding,
			internalReproduction: this.reproduction,
			cellSize: 20,
			speed: 50,
			showModal: false,
			showColors: true
		};
	},
	methods: {
		updateCellSize() { this.$emit('update-cell-size', this.cellSize); },
		updateSpeed() { this.$emit('update-speed', this.speed); },
		startGame() { this.$emit('start-game'); },
		clearGrid() { this.$emit('clear-grid'); },
		stopGame() { this.$emit('stop-game'); },
		deactivateCells() { this.$emit('deactivate-cells'); },
		emitUnderpopulation() { this.$emit('update-underpopulation', this.internalUnderpopulation); },
		emitCrowding() { this.$emit('update-crowding', this.internalCrowding); },
		emitReproduction() { this.$emit('update-reproduction', this.internalReproduction); },
		toggleColors() { this.$emit('toggle-colors', this.showColors); },
		resetSliders() {
			this.internalUnderpopulation = 2;
			this.internalCrowding = 3;
			this.internalReproduction = 3;
			this.emitUnderpopulation();
			this.emitCrowding();
			this.emitReproduction();
		}
	},
	watch: {
		underpopulation(newVal) { this.internalUnderpopulation = newVal; },
		crowding(newVal) { this.internalCrowding = newVal; },
		reproduction(newVal) { this.internalReproduction = newVal; }
	}
};
</script>