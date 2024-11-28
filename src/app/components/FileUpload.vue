<script lang="ts" setup>
import { ref, useTemplateRef } from "vue";

const file = defineModel<File | undefined>("file");

defineProps<{
	buttonText: string;
	info: string;
	error?: string;
}>();

const fileUpload = useTemplateRef<HTMLInputElement>("fileUpload");
const fileName = ref<string>(file.value?.name || "");

const emit = defineEmits<{
	change: [File | undefined];
}>();

function onUpload(event: Event) {
	const target = event.target as HTMLInputElement;
	const uploadedFile = target.files?.[0];
	if (!uploadedFile) {
		file.value = undefined;
		fileName.value = "";
		return;
	}

	fileName.value = uploadedFile.name;
	file.value = uploadedFile;
}
</script>

<template>
	<div>
		<span class="_op_71">{{ info }}</span>
		<input
			:value="fileName"
			aria-readonly="true"
			class="_op_a1 allowTextSelection textbox ms-font-s ms-fwt-sl ms-fcl-np ms-bcl-nta ms-bcl-nsa-h"
			readonly
			role="textbox"
		/>
		<button
			aria-labelledby="_ariaId_550"
			class="_op_b1 o365button o365buttonOutlined ms-font-m ms-fwt-sb ms-fcl-np ms-bgc-nlr ms-bcl-nlr ms-fcl-b-f ms-bcl-tp-f"
			type="button"
			@click="fileUpload?.click()"
		>
			<span id="_ariaId_550" class="_fc_4 o365buttonLabel"
				>{{ buttonText }}
			</span>
		</button>
		<div>
			<span class="_op_61 ms-font-weight-semibold owa-color-neutral-red">
				<span :hidden="!error"> Error: </span>
			</span>
			<span class="_op_61 ms-font-color-neutralPrimary">
				{{ error }}
			</span>
		</div>
		<input ref="fileUpload" hidden type="file" @change="onUpload" />
	</div>
</template>

<style scoped></style>
