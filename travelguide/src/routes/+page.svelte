<script lang="ts">
	export let data: any;
</script>

<div>
	<h1>My Blog</h1>

	<main>
		<div>
			{#each data.feed as post (post.id)}
				post
			{/each}
		</div>
	</main>
</div>
