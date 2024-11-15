<script lang="ts">
	import { createForm, type FelteSubmitError } from "felte";
	import { validator } from "@felte/validator-zod";
	import { z } from "zod";

	const schema = z.object({
		username: z.string().min(1).max(32),
		password: z.string().min(1),
	});

	const { form, errors } = createForm<z.infer<typeof schema>>({
		extend: validator({ schema }),
		// @ts-ignore
		onError: (e: FelteSubmitError) =>
			e.response.json().then((j) => console.log(j.error.message)),
	});
</script>

<div class="container">
	<h1>AuthCat Login</h1>
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
