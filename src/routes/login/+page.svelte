<script lang="ts">
	import { createForm, type FelteSubmitError } from "felte";
	import { validator } from "@felte/validator-zod";
	import { env } from "$env/dynamic/public";
	import { z } from "zod";
	import { goto } from "$app/navigation";

	let { data } = $props();

	const schema = z.object({
		username: z.string().min(1).max(32),
		password: z.string().min(1),
	});

	const { form, errors } = createForm<z.infer<typeof schema>>({
		extend: validator({ schema }),
		// @ts-ignore
		onError: (e: FelteSubmitError) =>
			e.response.json().then((j) => console.log(j.error.message)),
		onSuccess: () => data.application.authenticate().then(() => goto("/")),
	});
</script>

<div class="container">
	<div class="heading">
		<h1>AuthCat Login</h1>
		<p class="reason">
			You are seeing this page as you are not connected to a
			<span class="code">{env.PUBLIC_AUTHCAT_DOMAIN}</span>
			subdomain
		</p>
	</div>
	<form class="section login" method="POST" use:form>
		<input name="username" type="text" placeholder="Enter your Username" />
		<input name="password" type="password" placeholder="Enter your Password" />
		<button type="submit">Log In</button>
	</form>
</div>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 30px;
		gap: 30px;
	}

	h1 {
		text-align: center;
	}

	p.reason {
		color: var(--text-2);
	}

	.login {
		flex-direction: column;
		align-items: center;
		display: flex;
		gap: 5px;

		button {
			margin-top: 15px;
		}
	}
</style>
