<script lang="ts">
	import { application } from "$lib/application/application.svelte";
	import { createForm, type FelteSubmitError } from "felte";
	import { validator } from "@felte/validator-zod";
	import { env } from "$env/dynamic/public";
	import { goto } from "$app/navigation";
	import { toast } from "$lib/util";
	import { page } from "$app/stores";
	import { z } from "zod";
	import type { Extender } from "@felte/common";

	const schema = z.object({
		username: z.string().min(1).max(32),
		password: z.string().min(1),
	});

	const felteLoader: Extender<any> = ({ isSubmitting }) => {
		let resolve: () => void;
		const unsubscribe = isSubmitting.subscribe((v) => {
			if (v) new Promise<void>((r) => (resolve = r)).loading();
			else if (resolve) resolve();
		});

		return {
			destroy() {
				if (resolve) resolve();
				unsubscribe();
			},
		};
	};

	const { form } = createForm<z.infer<typeof schema>>({
		extend: [validator({ schema }), felteLoader],
		onSuccess: () =>
			application
				.authenticate()
				.then(() =>
					goto($page.url.searchParams.get("return-page") ?? "/", { replaceState: true }),
				),
		// @ts-ignore
		onError: (e: FelteSubmitError) =>
			e.response.json().then((j) => {
				toast({ type: "error", title: "Login Failed", description: j.error.message });
			}),
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
	<form class="island login" method="POST" use:form>
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
		text-align: center;
	}

	input {
		width: 100%;
	}

	.login {
		flex-direction: column;
		align-items: center;
		min-width: 250px;
		display: flex;
		gap: 5px;

		button {
			margin-top: 15px;
		}
	}
</style>
