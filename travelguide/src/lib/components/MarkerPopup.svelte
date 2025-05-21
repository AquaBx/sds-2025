<script>
	let { initial = 0 } = $props()
	let count = $state(initial)
</script>

intial: {initial}<br>
<div>
	<button onclick={() => count--}>-</button>
	<span>{count}</span>
	<button onclick={() => count++}>+</button>
</div>