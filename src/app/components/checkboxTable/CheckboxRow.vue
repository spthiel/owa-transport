<script lang="ts" setup>
import MSCheckbox from "../MSCheckbox.vue";
import nextId from "../../../UIDGenerator";

const uid = nextId();

const checked = defineModel<boolean>("checked", { required: true });

defineProps<{
	label: string;
}>();
</script>

<template>
	<div class="row checkbox-row">
		<div class="cell col1">
			<MSCheckbox
				v-model:checked="checked"
				:aria-labelledby="`checkbox-row-${uid}`"
			/>
		</div>
		<div class="cell col2">
			<span :id="`checkbox-row-${uid}`" class="text-large">
				{{ label }}
			</span>
		</div>
	</div>
</template>

<style scoped></style>
