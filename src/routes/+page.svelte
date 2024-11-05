<div class="container">
	<div class="section">
		<h1>Welcome to PeopleCat!</h1>
		<p>This is a recreation of the PeopleCat webapp prototype made in Svelte!</p>
	</div>
	<div class="section login">
		<input type="text" placeholder="Enter your Username" />
		<input type="password" placeholder="Enter your Password" />
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 30px;
		gap: 30px;
	}

	.login {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
</style>
