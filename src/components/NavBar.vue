<template>
	<nav
		class="bg-[#263059d2] text-[#ffc003cc] p-4 shadow-lg w-full border-t-8 border border-[#ffc003cc] rounded-b-2xl">
		<div class="container mx-auto flex items-center space-x-4">
			<img src="@/assets/logo.png" alt="Logo" class="w-[55px] h-[55px]">
			<h1 class="text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 drop-shadow-lg"
				style="font-family: 'Lobster', cursive;">
				The Game of Life
			</h1>
		</div>
	</nav>
</template>
<script>
export default {
	name: 'NavBar'
};
</script>
