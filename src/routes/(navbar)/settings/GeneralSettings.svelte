<script lang="ts">
	import { faCog, faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
	import { isCORS, logout as acLogout, getCookie } from "$lib/application/authcat";
	import ProfilePicture from "$lib/components/profile/ProfilePicture.svelte";
	import { catchToast } from "$lib/components/toast/Toaster.svelte";
	import { loadUntil } from "../../Loading.svelte";
	import { env } from "$env/dynamic/public";
	import { action } from "$lib/util";
	import { page } from "$app/stores";
	import Fa from "svelte-fa";
	import Select from "$lib/components/Select.svelte";

	function logout() {
		loadUntil(
			(isCORS() ? action("logout") : acLogout(getCookie()!)).then(() =>
				$page.data.application.authenticate(),
			),
		).catch(catchToast("Logout failed"));
	}
</script>

<h3>General Settings</h3>
<hr />
<div class="section">
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
</div>
<div class="section">
	<h5>Notification Settings</h5>
	<Select options={[{ label: "None" }, { label: "Browser" }]} />
</div>

<style lang="scss">
	.section {
		margin-bottom: 20px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	h5 {
		margin-bottom: 5px;
	}
</style>
