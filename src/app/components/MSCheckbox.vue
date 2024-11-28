<script lang="ts" setup>
const checked = defineModel<boolean>("checked", { required: true });

defineProps<{
	label: string;
}>();
</script>
<template>
	<button
		ref="button"
		:aria-label="label"
		aria-checked="true"
		aria-labelledby="_ariaId_43"
		class="_op_v9 o365button checkbox"
		role="checkbox"
		type="button"
		@click="checked = !checked"
	>
		<span
			:class="{
				'ms-Icon--checkboxCheck': checked,
			}"
			class="_fc_6 owaimg ms-bgc-w ms-bcl-nta ms-fcl-ns"
		/>
	</button>
</template>
<style scoped></style>
