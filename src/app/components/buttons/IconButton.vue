<script lang="ts" setup>
import MSIcon from "../MSIcon.vue";

defineProps<{
	title: string;
	icon: string;
}>();

const emit = defineEmits<{
	click: [];
}>();
</script>

<template>
	<button
		:title="title"
		class="_opc_e ms-font-xs ms-font-color-neutralSecondary o365button"
		@click="emit('click')"
	>
		<MSIcon :icon="icon" />
	</button>
</template>

<style scoped></style>
