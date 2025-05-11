<script lang="ts">
	let { searchPlaces }: { searchPlaces: Function } = $props();
	let value: string = $state('');
</script>

<div class="m-2">
	<input
		type="text"
		placeholder="Search for a place (name, theme, etc...)"
		class="input w-full"
		bind:value
		oninput={() => searchPlaces(value)}
	/>
</div>