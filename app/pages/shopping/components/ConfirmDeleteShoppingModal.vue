<script setup lang="ts">
import type { Shopping } from '~/types/shopping';
import { deleteShopping } from '~/services/shopping';

const open = defineModel<boolean>('open', {
    default: false,
});

const props = defineProps<{
    shopping?: Shopping | null;
}>();

const emit = defineEmits<{
    deleted: [];
}>();

const loading = ref(false);

async function confirmDelete() {
    if (!props.shopping) {
        return;
    }

    try {
        loading.value = true;

        await deleteShopping(props.shopping.id);

        emit('deleted');

        open.value = false;
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <UModal v-model:open="open">
        <template #content>
            <UCard>
                <template #header>
                    <h3 class="font-semibold">
                        Excluir mercado
                    </h3>
                </template>

                <div class="space-y-4">
                    <p>
                        Deseja excluir este mercado?
                    </p>

                    <div
                        v-if="shopping"
                        class="p-3 rounded border"
                    >
                        <strong>
                            {{ shopping.title }}
                        </strong>

                        <div class="text-sm text-gray-500">
                            {{ shopping.month }}/{{ shopping.year }}
                        </div>
                    </div>

                    <p class="text-sm text-gray-500">
                        O mercado será apenas marcado como excluído.
                    </p>
                </div>

                <template #footer>
                    <div class="flex justify-end gap-2">
                        <UButton
                            color="neutral"
                            variant="outline"
                            @click="open = false"
                        >
                            Cancelar
                        </UButton>

                        <UButton
                            color="error"
                            :loading="loading"
                            @click="confirmDelete"
                        >
                            Excluir
                        </UButton>
                    </div>
                </template>
            </UCard>
        </template>
    </UModal>
</template>