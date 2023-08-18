<template>
	<div class="inputZone">
		<form action="#">
			<input class="register-input" type="text" placeholder="Username" />
			<input class="register-input" type="password" placeholder="Password" />
			<div class="buttonZone">
				<button class="register-button">
					<img src="../assets/42_logo.svg" alt="logo 42">
						LOGIN
				</button>
				<button type="submit" class="register-button">
					LOGIN
				</button>
			</div>
		</form>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({

});
</script>

<style src="../assets/formComponent.css" lang="css">

</style>
