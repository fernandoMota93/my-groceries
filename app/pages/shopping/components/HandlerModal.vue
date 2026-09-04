<script setup lang="ts">

const open = defineModel<boolean>('open', {
    default: false,
});


const emit = defineEmits<{
    selectedType: [value: string];
}>();


function setType(val: string) {

    emit('selectedType', val);

}

</script>


<template>

    <UModal v-model:open="open">

        <template #content>

            <UCard>

                <template #header>

                    <h3 class="font-semibold">
                        Selecione o tipo de compra
                    </h3>

                </template>


                <UForm>

                    <div class="flex justify-end gap-2">

                        <UButton color="neutral" variant="outline" type="button" @click="setType('mensal')">
                            Mensal
                        </UButton>


                        <UButton color="neutral" variant="outline" type="button" @click="setType('semanal')">
                            Semanal
                        </UButton>

                    </div>

                </UForm>

            </UCard>

        </template>

    </UModal>

</template>