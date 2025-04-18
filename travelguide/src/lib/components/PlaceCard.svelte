<script lang="ts">
	import type { Place } from '$lib/types';
	export let place: Place;

	let expanded = false;

	function toggle() {
		expanded = !expanded;
	}

	function close() {
		expanded = false;
	}
</script>

<div
	class="flex flex-col gap-4 rounded-lg border border-gray-300 p-4 "
>
	<img
		class="w-full aspect-video cursor-pointer rounded-lg transition-transform duration-300 ease-in-out hover:scale-105"
		onclick={toggle}
		src={place.picture[0]?.url}
		alt={place.name}
	/>
	<div class="flex flex-1 flex-col justify-center">
		<div class="mb-1 text-2xl font-semibold">{place.name}</div>
		<div class="mb-2 text-base text-gray-600">{place.theme}</div>
		<div class="text-sm leading-relaxed text-gray-800">{place.description}</div>
	</div>
</div>

{#if expanded}
	<div
		class="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/70"
		onclick={close}
	>
		<img
			src={place.picture[0]?.url}
			alt={place.name}
			class="max-h-[90%] max-w-[90%] rounded-xl shadow-2xl"
		/>
	</div>
{/if}
