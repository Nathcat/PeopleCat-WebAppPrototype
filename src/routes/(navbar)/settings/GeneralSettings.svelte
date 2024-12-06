<script lang="ts">
	import { faCog, faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
	import { isCORS, logout as acLogout, getCookie } from "$lib/application/authcat";
	import ProfilePicture from "$lib/components/profile/ProfilePicture.svelte";
	import { loadUntil } from "../../Loading.svelte";
	import { env } from "$env/dynamic/public";
	import { action } from "$lib/util";
	import { page } from "$app/stores";
	import Fa from "svelte-fa";
	import { catchToast } from "$lib/components/toast/Toaster.svelte";

	function logout() {
		loadUntil(
			(isCORS() ? action("logout") : acLogout(getCookie()!)).then(() =>
				$page.data.application.authenticate(),
			),
		).catch(catchToast);
	}
</script>

<h3>General Settings</h3>
<hr />
<h5>AuthCat Account</h5>
<div style="display: flex; gap: 10px">
	<ProfilePicture id={$page.data.application.user!.id} size={55} />
	<div style="display: flex; flex-direction: column">
		<span>
			<Fa icon={faUser} />
			{$page.data.application.user!.username}
		</span>
		<a href={env.PUBLIC_AUTHCAT_SETTINGS} target="_blank">
			<Fa icon={faCog} />
			User Settings
		</a>
		<button onclick={logout}>
			<Fa icon={faRightFromBracket} />
			Logout
		</button>
	</div>
</div>

<style lang="scss">
	h5 {
		margin-bottom: 8px;
	}
</style>
