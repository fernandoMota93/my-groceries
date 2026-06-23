<script setup lang="ts">
import type { Item } from '~/types/item';
import { createItem, updateItem } from '~/services/items';
import { z } from 'zod';

const schema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    category: z.string().min(1, 'Categoria é obrigatória'),
    amount: z.number({
        required_error: 'Quantidade é obrigatória',
    }).min(0.1, 'Quantidade deve ser maior que zero'),
});

const open = defineModel<boolean>('open', {
    default: false,
});

const props = defineProps<{
    item?: Item | null;
}>();

const emit = defineEmits<{
    saved: [];
}>();

const form = reactive({
    name: '',
    category: '',
    amount: 1,
});

const categories = [
    'Alimentos',
    'Pets',
    'Condimentos',
    'Temperos',
    'Carnes e Frios',
    'Limpeza',
    'Higiene',
];

watch(
    () => props.item,
    (item) => {
        if (item) {
            form.name = item.name;
            form.category = item.category;
            form.amount = item.amount;
            return;
        }

        form.name = '';
        form.category = '';
        form.amount = 1;
    },
    {
        immediate: true,
    },
);

async function submit() {
    try {
        if (props.item) {
            await updateItem(props.item.id, {
                name: form.name,
                category: form.category,
                amount: form.amount,
            });
        } else {
            await createItem({
                name: form.name,
                category: form.category,
                amount: form.amount,
            });
        }

        emit('saved');
        open.value = false;
    } catch (error) {
        console.error(error);
    }
}
</script>

<template>
    <UModal v-model:open="open">
        <template #content>
            <UCard>
                <template #header>
                    <h3 class="font-semibold">
                        {{ item ? 'Editar item' : 'Novo item' }}
                    </h3>
                </template>

                <UForm id="item-form" :schema="schema" :state="form" class="space-y-4" @submit="submit">
                    <UFormField label="Nome" name="name">
                        <UInput v-model="form.name" class="w-full" />
                    </UFormField>
                    <UFormField label="Categoria" name="category">
                        <USelect v-model="form.category" :items="categories" class="w-full" />
                    </UFormField>

                    <UFormField label="Quantidade" name="amount">
                        <UInput v-model.number="form.amount" type="number" min="0.1" step="0.1" class="w-full" />
                    </UFormField>
                </UForm>

                <template #footer>
                    <div class="flex justify-end gap-2">
                        <UButton color="neutral" variant="outline" @click="open = false">
                            Cancelar
                        </UButton>

                        <UButton type="submit" form="item-form">
                            Salvar
                        </UButton>
                    </div>
                </template>
            </UCard>
        </template>
    </UModal>
</template>