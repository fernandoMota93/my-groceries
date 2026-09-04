<script setup lang="ts">

import {
    createShopping,
    updateShopping,
} from '~/services/shopping-weekly';

import type { Shopping } from '~/types/shopping';


const open = defineModel<boolean>('open', {
    default: false,
});


const props = defineProps<{
    shopping?: Shopping | null;
}>();


const emit = defineEmits<{
    saved: [];
}>();


const loading = ref(false);


const months = [
    {
        label: 'Janeiro',
        value: 1,
    },
    {
        label: 'Fevereiro',
        value: 2,
    },
    {
        label: 'Março',
        value: 3,
    },
    {
        label: 'Abril',
        value: 4,
    },
    {
        label: 'Maio',
        value: 5,
    },
    {
        label: 'Junho',
        value: 6,
    },
    {
        label: 'Julho',
        value: 7,
    },
    {
        label: 'Agosto',
        value: 8,
    },
    {
        label: 'Setembro',
        value: 9,
    },
    {
        label: 'Outubro',
        value: 10,
    },
    {
        label: 'Novembro',
        value: 11,
    },
    {
        label: 'Dezembro',
        value: 12,
    },
];


const now = new Date();


const form = reactive({
    day: now.getDate(),
    month: now.getMonth() + 1,
    year: now.getFullYear(),
});


async function submit() {

    try {

        loading.value = true;


        if (props.shopping) {

            await updateShopping(
                props.shopping.id,
                {
                    day: form.day,
                    month: form.month,
                    year: form.year,
                },
            );

        } else {

            await createShopping({
                day: form.day,
                month: form.month,
                year: form.year,
            });

        }


        emit('saved');

        open.value = false;

    } catch (error) {

        console.error(error);

    } finally {

        loading.value = false;

    }

}


watch(
    () => props.shopping,

    (shopping) => {

        if (shopping) {

            form.day = shopping.day ?? now.getDate();
            form.month = shopping.month;
            form.year = shopping.year;

            return;

        }


        form.day = now.getDate();
        form.month = now.getMonth() + 1;
        form.year = now.getFullYear();

    },

    {
        immediate: true,
    },
);

</script>


<template>

    <UModal v-model:open="open">

        <template #content>

            <UCard>

                <template #header>

                    <h3 class="font-semibold">
                        {{ shopping ? 'Editar mercado semanal' : 'Novo mercado semanal' }}
                    </h3>

                </template>


                <UForm
                    :state="form"
                    class="space-y-4"
                    @submit="submit"
                >

                    <UFormField label="Dia">

                        <UInput
                            v-model.number="form.day"
                            type="number"
                            min="1"
                            max="31"
                            class="w-full"
                        />

                    </UFormField>


                    <UFormField label="Mês">

                        <USelect
                            v-model="form.month"
                            :items="months"
                            value-key="value"
                            label-key="label"
                            class="w-full"
                        />

                    </UFormField>


                    <UFormField label="Ano">

                        <UInput
                            v-model.number="form.year"
                            type="number"
                            class="w-full"
                        />

                    </UFormField>


                    <div class="flex justify-end gap-2">

                        <UButton
                            color="neutral"
                            variant="outline"
                            type="button"
                            @click="open = false"
                        >
                            Cancelar
                        </UButton>


                        <UButton
                            type="submit"
                            :loading="loading"
                        >
                            {{ shopping ? 'Salvar' : 'Criar' }}
                        </UButton>

                    </div>

                </UForm>

            </UCard>

        </template>

    </UModal>

</template>