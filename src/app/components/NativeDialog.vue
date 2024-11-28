<script lang="ts" setup>
import MSIcon from "./MSIcon.vue";
import { useTemplateRef, watch } from "vue";

const open = defineModel<boolean>("open", { required: true });

defineProps<{
	title: string;
}>();

const dialog = useTemplateRef<HTMLDialogElement>("dialog");

watch(open, (value) => {
	if (value) {
		dialog.value?.showModal();
	} else {
		dialog.value?.close();
	}
});
</script>

<template>
	<teleport to="body">
		<dialog ref="dialog" class="owa-transport" @close="open = false">
			<div class="content">
				<form method="dialog">
					<button
						class="o365button o365buttonRegular ms-font-m ms-fwt-r ms-fcl-np"
						title="Close"
						type="submit"
					>
						<MSIcon icon="x" />
						<span class="_fc_4 o365buttonLabel _fc_2">Close</span>
					</button>
				</form>
				<h2 class="ms-font-xl _opc_J">{{ title }}</h2>
				<div ref="body" class="body customScrollBar ms-font-s">
					<slot></slot>
				</div>
			</div>
		</dialog>
	</teleport>
</template>
