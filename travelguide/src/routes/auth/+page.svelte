<script>
	import { goto } from '$app/navigation';
</script>

<div class="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
	<h1 class="text-3xl font-bold">Welcome</h1>
	<p>Please log in or register to continue</p>
	<div class="flex gap-4">
		<button
      on:click={() => goto('/auth/login')}
      class="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap
              rounded-md text-sm font-medium outline-none transition-all
              focus-visible:ring-[3px] focus-visible:border-ring focus-visible:ring-ring/50
              bg-primary text-primary-foreground shadow-xs hover:bg-primary/90
              h-9 px-4 py-2"
    >
      Login
    </button>
    <button
      on:click={() => goto('/auth/register')}
      class="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap
              rounded-md text-sm font-medium outline-none transition-all
              focus-visible:ring-[3px] focus-visible:border-ring focus-visible:ring-ring/50
              bg-primary text-primary-foreground shadow-xs hover:bg-primary/90
              h-9 px-4 py-2"
    >
      Register
    </button>
	</div>
</div>
