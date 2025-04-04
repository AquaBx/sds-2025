<script lang="ts">
    import { goto } from "$app/navigation";

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
            <label for="startDate" class="block text-sm font-medium text-gray-700 ">Start date of the trip:</label>
            <input type="date" id="startDate" bind:value={startDate} class="w-full p-2 border border-gray-300 rounded mb-10" />

            <label for="endDate" class="block text-sm font-medium text-gray-700">End date of the trip:</label>
            <input type="date" id="endDate" bind:value={endDate} class="w-full p-2 border border-gray-300 rounded mb-10 " />

            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Next</button>
        </form>
    {/if}

    {#if step === 2}
        <!-- Step 2 : Moment of activity -->
        <form on:submit|preventDefault={handleNext} class="space-y-4">
            <h1 class="text-lg font-semibold text-gray-800">At what time of day did you want to do activities?</h1>
            <div class="flex items-center space-x-2">
                <input type="checkbox" id="activityMorning" bind:checked={activityMorning} class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label for="activityMorning" class="text-sm text-gray-700">In the morning</label>
            </div>

            <div class="flex items-center space-x-2">
                <input type="checkbox" id="activityAfternoon" bind:checked={activityAfternoon} class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label for="activityAfternoon" class="text-sm text-gray-700">In the afternoon</label>
            </div>

            <div class="flex items-center space-x-2">
                <input type="checkbox" id="activityEvening" bind:checked={activityEvening} class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label for="activityEvening" class="text-sm text-gray-700">In the evening</label>
            </div>

            <div class="flex items-center space-x-2">
                <input type="checkbox" id="activityNight" bind:checked={activityNight} class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label for="activityNight" class="text-sm text-gray-700">At night</label>
            </div>

            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Next</button>
        </form>
    {/if}

    {#if step === 3}
        <!-- Step 3 : Center of interest -->
        <h1 class="text-lg font-semibold text-gray-800"> What kind of activity you want to do ?</h1>
        <form on:submit|preventDefault={handleNext} class="space-y-4">
            <div class="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="Sport"
                    on:change={() => addInterest('Sport')}
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label for="Sport" class="text-sm text-gray-700">Sport</label>
            </div>

            <div class="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="Nature"
                    on:change={() => addInterest('Nature')}
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label for="Nature" class="text-sm text-gray-700">Nature</label>
            </div>

            <div class="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="History"
                    on:change={() => addInterest('History')}
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label for="History" class="text-sm text-gray-700">History</label>
            </div>

            <div class="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="Culture"
                    on:change={() => addInterest('Culture')}
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label for="Culture" class="text-sm text-gray-700">Culture</label>
            </div>

            <div class="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="Food"
                    on:change={() => addInterest('Food')}
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label for="Food" class="text-sm text-gray-700">Food</label>
            </div>

            <div class="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="Shopping"
                    on:change={() => addInterest('Shopping')}
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label for="Shopping" class="text-sm text-gray-700">Shopping</label>
            </div>

            <div class="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="Relaxation"
                    on:change={() => addInterest('Relaxation')}
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label for="Relaxation" class="text-sm text-gray-700">Relaxation</label>
            </div>

            <div class="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="Adventure"
                    on:change={() => addInterest('Adventure')}
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label for="Adventure" class="text-sm text-gray-700">Adventure</label>
            </div>

            <div class="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="Music"
                    on:change={() => addInterest('Music')}
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label for="Music" class="text-sm text-gray-700">Music</label>
            </div>


            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Next</button>

        </form>

        
    {/if}

    {#if step === 4}
        <!-- Step 4 : Summary of the trip -->
        <h2 class="text-xl font-bold text-gray-800">Summary of your trip</h2>
        <p class="text-gray-700">Start date: {startDate}</p>
        <p class="text-gray-700">End date: {endDate}</p>
        <p class="text-gray-700">Activities:</p>
        <ul class="list-disc list-inside text-gray-700">
            {#if activityMorning}<li>Morning</li>{/if}
            {#if activityAfternoon}<li>Afternoon</li>{/if}
            {#if activityEvening}<li>Evening</li>{/if}
            {#if activityNight}<li>Night</li>{/if}
        </ul>
        <p class="text-gray-700">Center of interest : {centerOfInterest}</p>
    {/if}
</main>