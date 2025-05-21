<script lang="ts">
	import type { Place } from '$lib/types';
	import { HourglassMedium, Wheelchair } from '@steeze-ui/phosphor-icons';
	import { Icon } from '@steeze-ui/svelte-icon';
	export let place: Place;

	let expanded = false;

	function toggle() {
		expanded = !expanded;
	}

	function close() {
		expanded = false;
	}
</script>

<div class="flex flex-col gap-4 rounded-lg border border-gray-300 p-4">
	<img
		class="object-cover aspect-video w-full cursor-pointer rounded-lg transition-transform duration-300 ease-in-out hover:scale-105"
		onclick={toggle}
		src={place.picture}
		alt={place.name}
	/>
	<div class="flex flex-1 flex-col justify-center">
		<div class="mb-1 text-2xl font-semibold">{place.name}</div>
		<div class="flex flex-1 flex-row">
			<div class="mb-2 text-base text-gray-600">{place.theme}</div>
			{#if place.disableAccessibility}
				<div class="mb-2 ml-2 flex items-center gap-1 text-sm font-semibold">
					<Icon src={Wheelchair} theme="solid" class="color-gray-900 size-4" />
				</div>
			{/if}
			<div
				class="mb-2 {place.disableAccessibility
					? 'ml-2'
					: 'ml-auto'} flex items-center gap-1 text-sm font-semibold"
			>
				<Icon src={HourglassMedium} theme="solid" class="color-gray-900 size-4" />
				<p>{place.estimatedDuration} {place.estimatedDuration <= 1 ? 'hour' : 'hours'}</p>
			</div>
		</div>
		<div class="text-sm leading-relaxed text-gray-800">{place.description}</div>
		<div>Open at : {place.openingTime}</div>
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
