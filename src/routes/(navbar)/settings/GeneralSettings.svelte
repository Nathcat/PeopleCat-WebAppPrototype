<script lang="ts">
	import { isCORS, logout as acLogout, getCookie } from "$lib/application/authcat";
	import ProfilePicture from "$lib/components/profile/ProfilePicture.svelte";
	import { application } from "$lib/application/application.svelte";
	import Settings from "$lib/application/settings.svelte";
	import Dropdown from "$lib/components/Dropdown.svelte";
	import { action, interval } from "$lib/util.svelte";
	import { env } from "$env/dynamic/public";
	import Fa from "svelte-fa";
	import {
		faBan,
		faBell,
		faCircleXmark,
		faCog,
		faRightFromBracket,
		faUser,
		faWindowMaximize,
	} from "@fortawesome/free-solid-svg-icons";

	let notificationPermission = $state(Notification.permission);

	function logout() {
		(isCORS() ? action("logout") : acLogout(getCookie()!))
			.then(() => application.authenticate())
			.catchToast("Log Out Failed")
			.loading();
	}

	interval(250, () => {
		notificationPermission = Notification.permission;
	});
</script>

<h3>General Settings</h3>
<hr />
<div class="section">
	<h5>AuthCat Account</h5>
	<div style="display: flex; gap: 10px">
		<ProfilePicture id={application.user!.id} size={55} />
		<div style="display: flex; flex-direction: column">
			<span>
				<Fa icon={faUser} />
				{application.user!.username}
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
	<div style="width: 25%;">
		<Dropdown
			bind:value={Settings.notification.value}
			options={{
				none: { label: "Disabled", icon: faBan },
				browser: {
					label: "Browser",
					icon: faWindowMaximize,
					onclick() {
						Notification.requestPermission();
					},
				},
				push: { label: "Push", icon: faBell },
			}}
		/>
	</div>
	{#if Settings.notification.value == "browser"}
		<p>Notifications will be displayed while this tab is open.</p>
		{#if notificationPermission != "granted"}
			<p class="error">
				<Fa icon={faCircleXmark} /> Permission not granted
			</p>
		{/if}
	{:else if Settings.notification.value == "push"}
		<p>Not implemented yet.</p>
	{/if}
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

	p {
		margin: 10px 0 0 0;
	}
</style>
