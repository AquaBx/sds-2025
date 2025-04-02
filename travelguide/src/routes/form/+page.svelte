<script lang="ts">
    import { goto } from "$app/navigation";

    let step: number = 1;
    let startDate: string = '';
    let endDate: string = '';

    let activityMorning: boolean = false;
    let activityAfternoon: boolean = false;
    let activityEvening: boolean = false;
    let activityNight: boolean = false;

    function handleNext(event: Event) {
        event.preventDefault();
        step += 1;
    }
</script>

<main>
    {#if step === 1}
        <!-- Step 1 : Date of the trip -->
        <form on:submit|preventDefault={handleNext} class="form">
            <label for="startDate">Start date of the trip:</label>
            <input type="date" id="startDate" bind:value={startDate} />

            <label for="endDate">End date of the trip:</label>
            <input type="date" id="endDate" bind:value={endDate} />

            <button type="submit">Next</button>
        </form>
    {/if}

    {#if step === 2}
        <!-- Step 2 : Moment of activity -->
        <form on:submit|preventDefault={handleNext} class="form">
            <label for="activity">At what time of day did you want to do activities?</label>
            <input type="checkbox" id="activityMorning" bind:checked={activityMorning} />
                in the morning
            <input type="checkbox" id="activityAfternoon" bind:checked={activityAfternoon} />
                in the afternoon
            <input type="checkbox" id="activityEvening" bind:checked={activityEvening} />
                in the evening
            <input type="checkbox" id="activityNight" bind:checked={activityNight} />
                at night

            <button type="submit">Submit</button>
        </form>
    {/if}

    {#if step === 3}
        <!-- Step 3 : Summary of the trip -->
        <h2>Summary of your trip</h2>
        <p>Start date: {startDate}</p>
        <p>End date: {endDate}</p>
        <p>Activities:</p>
        <ul>
            {#if activityMorning}<li>Morning</li>{/if}
            {#if activityAfternoon}<li>Afternoon</li>{/if}
            {#if activityEvening}<li>Evening</li>{/if}
            {#if activityNight}<li>Night</li>{/if}
        </ul>
    {/if}
</main>

<style>
    main {
        font-family: Arial, sans-serif;
        margin: 20px;
    }

    .form {
        margin-bottom: 15px;
    }

    label {
        display: block;
        margin-bottom: 5px;
    }

    input {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
    }

    button {
        padding: 10px 15px;
        background-color: #007BFF;
        color: white;
        border: none;
        cursor: pointer;
    }

    button:hover {
        background-color: #0056b3;
    }
</style>