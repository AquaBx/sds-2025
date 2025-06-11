<script lang="ts">
	import type { Place } from '$lib/types';
	import { DoorOpen, HourglassMedium, Wheelchair } from '@steeze-ui/phosphor-icons';
	import { Icon } from '@steeze-ui/svelte-icon';
	export let place: Place;

	import * as Card from '$lib/components/ui/card/index.js';
</script>

<Card.Root class="w-full max-w-sm">
	<Card.Header>
		<Card.Title>{place.name}</Card.Title>
		<Card.Description>
			{place.description}
		</Card.Description>
		<!-- <Card.Action>
		</Card.Action> -->
	</Card.Header>
	<Card.Content>
		<img
			class="object-cover aspect-video w-full cursor-pointer rounded-lg"
			src={place.picture}
			alt={place.name}
		/>
		<div class="flex flex-1 flex-row gap-1">
			<!-- <div class="mb-2 text-base">{place.type}</div> -->
			{#if place.disableAccessibility}
				<div class="flex items-center gap-1 text-sm font-semibold">
					<Icon src={Wheelchair} theme="solid" class="color-gray-900 size-4" />
				</div>
			{/if}
			<div class="flex items-center gap-1 text-sm font-semibold">
				<Icon src={HourglassMedium} theme="solid" class="color-gray-900 size-4" />
				<p>{place.estimatedDuration} {place.estimatedDuration <= 1 ? 'hour' : 'hours'}</p>
			</div>
			<div class="flex items-center gap-1 text-sm font-semibold">
				<Icon src={DoorOpen} theme="solid" class="color-gray-900 size-4" />
				<p>{place.openingTime}</p>
			</div>
		</div>
	</Card.Content>
</Card.Root>
