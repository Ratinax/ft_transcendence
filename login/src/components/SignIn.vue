<template>
	<div class="inputZone">
		<form action="#">
			<input type="text" placeholder="Username" />
			<input type="password" placeholder="Password" />
			<div class="row buttonZone">
				<button class="row ft-button">
					<img src="../assets/42_logo.svg" alt="logo 42">
						LOGIN
				</button>
				<button class="ft-button" type="submit">
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

<style scoped src="../assets/formComponent.css" lang="css"></style>