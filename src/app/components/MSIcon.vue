<script lang="ts" setup>
defineProps<{
	icon: string;
}>();
</script>

<template>
	<span
		:class="[`ms-Icon--${icon}`]"
		class="_fc_3 owaimg ms-icon-font-size-16 ms-fcl-ns-b"
	/>
</template>

<style scoped></style>
