<script lang="ts">
	import { goto } from '$app/navigation';

	let step: number = 1;
	let startDate: string = '';
	let endDate: string = '';

	let activityMorning: boolean = false;
	let activityAfternoon: boolean = false;
	let activityEvening: boolean = false;
	let activityNight: boolean = false;

	let centerOfInterest: string[] = [];

	function addInterest(interest: string) {
		if (centerOfInterest.includes(interest)) {
			// Remove the interest if it is already selected
			centerOfInterest = centerOfInterest.filter((item) => item !== interest);
		} else {
			// Add the interest if it is not selected
			centerOfInterest.push(interest);
		}
	}

	function handleNext(event: Event) {
		event.preventDefault();
		step += 1;
	}
</script>

<main class="p-6">
	{#if step === 1}
		<!-- Step 1 : Date of the trip -->
		<form on:submit|preventDefault={handleNext} class="space-y-4">
			<label for="startDate" class="block text-sm font-medium text-gray-700"
				>Start date of the trip:</label
			>
			<input
				type="date"
				id="startDate"
				bind:value={startDate}
				class="mb-10 w-full rounded border border-gray-300 p-2"
			/>

			<label for="endDate" class="block text-sm font-medium text-gray-700"
				>End date of the trip:</label
			>
			<input
				type="date"
				id="endDate"
				bind:value={endDate}
				class="mb-10 w-full rounded border border-gray-300 p-2"
			/>

			<button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				>Next</button
			>
		</form>
	{/if}

	{#if step === 2}
		<!-- Step 2 : Moment of activity -->
		<form on:submit|preventDefault={handleNext} class="space-y-4">
			<h1 class="text-lg font-semibold text-gray-800">
				At what time of day did you want to do activities?
			</h1>
			<div class="flex items-center space-x-2">
				<input
					type="checkbox"
					id="activityMorning"
					bind:checked={activityMorning}
					class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
				/>
				<label for="activityMorning" class="text-sm text-gray-700">In the morning</label>
			</div>

			<div class="flex items-center space-x-2">
				<input
					type="checkbox"
					id="activityAfternoon"
					bind:checked={activityAfternoon}
					class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
				/>
				<label for="activityAfternoon" class="text-sm text-gray-700">In the afternoon</label>
			</div>

			<div class="flex items-center space-x-2">
				<input
					type="checkbox"
					id="activityEvening"
					bind:checked={activityEvening}
					class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
				/>
				<label for="activityEvening" class="text-sm text-gray-700">In the evening</label>
			</div>

			<div class="flex items-center space-x-2">
				<input
					type="checkbox"
					id="activityNight"
					bind:checked={activityNight}
					class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
				/>
				<label for="activityNight" class="text-sm text-gray-700">At night</label>
			</div>

			<button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				>Next</button
			>
		</form>
	{/if}

	{#if step === 3}
		<!-- Step 3 : Center of interest -->
		<h1 class="text-lg font-semibold text-gray-800">What kind of activity you want to do ?</h1>
		<form on:submit|preventDefault={handleNext} class="space-y-4">
			{#each ['Sport', 'Nature', 'History', 'Shopping', 'Gastronomy', 'Relaxation', 'Adventure', 'Music', 'Culture'] as category}
				<div class="flex items-center space-x-2">
					<input
						type="checkbox"
						id={category}
						on:change={() => addInterest(category)}
						class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					/>
					<label for={category} class="text-sm text-gray-700">{category}</label>
				</div>
			{/each}

			<button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				>Next</button
			>
		</form>
	{/if}

	{#if step === 4}
		<!-- Step 4 : Summary of the trip -->
		<h2 class="text-xl font-bold text-gray-800">Summary of your trip</h2>
		<p class="text-gray-700">Start date: {startDate}</p>
		<p class="text-gray-700">End date: {endDate}</p>
		<p class="text-gray-700">Activities:</p>
		<ul class="list-inside list-disc text-gray-700">
			{#if activityMorning}<li>Morning</li>{/if}
			{#if activityAfternoon}<li>Afternoon</li>{/if}
			{#if activityEvening}<li>Evening</li>{/if}
			{#if activityNight}<li>Night</li>{/if}
		</ul>
		<p class="text-gray-700">Center of interest : {centerOfInterest}</p>
	{/if}
</main>
