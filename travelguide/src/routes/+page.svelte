<script lang="ts">
	import { goto } from '$app/navigation';
  
	let selected: string[] = [];
	let budget = 50;
	let startTime = '09:00';
	let endTime = '17:00';
	const categories = ['nature', 'history', 'art', 'food', 'sport'];
  
	function generateGuide() {
	  const search = new URLSearchParams();
	  selected.forEach(tag => search.append('interest', tag));
	  search.append('budget', budget.toString());
	  search.append('start', startTime);
	  search.append('end', endTime);
	  goto(`/guide?${search.toString()}`);
	}
  
	function showAll() {
	  goto('/allPlaces');
	}
  </script>
  
  <style>
	.container {
	  max-width: 800px;
	  margin: 2rem auto;
	  padding: 2rem;
	  background-color: #f9f9f9;
	  border-radius: 16px;
	  box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
	}
  
	h1 {
	  text-align: center;
	  margin-bottom: 1.5rem;
	  font-size: 2rem;
	}
  
	fieldset {
	  display: flex;
	  gap: 1rem;
	  flex-wrap: wrap;
	  border: none;
	  padding: 0;
	  margin: 0;
	}
  
	label {
	  display: flex;
	  flex-direction: column;
	  font-size: 0.95rem;
	  margin-bottom: 1rem;
	  width: 100%;
	}
  
	.checkbox-group label {
	  width: auto;
	  font-weight: 500;
	}
  
	input[type='number'],
	input[type='time'] {
	  padding: 0.5rem;
	  font-size: 1rem;
	  border: 1px solid #ccc;
	  border-radius: 6px;
	}
  
	.buttons {
	  display: flex;
	  gap: 1rem;
	  margin-top: 1rem;
	}
  
	button {
	  padding: 0.6rem 1.5rem;
	  font-size: 1rem;
	  border: none;
	  border-radius: 8px;
	  background-color: #0070f3;
	  color: white;
	  cursor: pointer;
	  transition: background 0.2s ease;
	}
  
	button:hover {
	  background-color: #005ec0;
	}
  </style>
  
  <div class="container">
	<h1>Plan Your Day in Poznań</h1>
  
	<form on:submit|preventDefault={generateGuide}>
	  <label>
		What are you into?
		<fieldset class="checkbox-group">
		  {#each categories as category}
			<label>
			  <input type="checkbox" bind:group={selected} value={category} />
			  {category}
			</label>
		  {/each}
		</fieldset>
	  </label>
  
	  <label>
		Budget (PLN):
		<input type="number" bind:value={budget} min="0" />
	  </label>
  
	  <label>
		Start time:
		<input type="time" bind:value={startTime} />
	  </label>
  
	  <label>
		End time:
		<input type="time" bind:value={endTime} />
	  </label>
  
	  <div class="buttons">
		<button type="submit">Generate My Guide</button>
		<button type="button" on:click={showAll}>Show All Places</button>
	  </div>
	</form>
  </div>
  