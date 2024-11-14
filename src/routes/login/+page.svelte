<script lang="ts">
	import { validator } from "@felte/validator-zod";
	import { createForm } from "felte";
	import { z } from "zod";

	const schema = z.object({
		username: z.string().min(1).max(32),
		password: z.string().min(1),
	});

	const { form, errors } = createForm<z.infer<typeof schema>>({
		extend: validator({ schema }),
		onSubmit: (values) => {
			console.log(values);
		},
	});
</script>

<div class="container">
	<div class="section">
		<h1>Welcome to PeopleCat!</h1>
		<p>This is a recreation of the PeopleCat webapp prototype made in Svelte!</p>
	</div>
	<form class="section login" use:form>
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
