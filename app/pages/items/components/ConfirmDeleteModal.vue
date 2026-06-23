<script setup lang="ts">
import type { Item } from '~/types/item';
import { deleteItem } from '~/services/items';

const open = defineModel<boolean>('open', {
  default: false,
});

const props = defineProps<{
  item?: Item | null;
}>();

const emit = defineEmits<{
  deleted: [];
}>();

const loading = ref(false);

async function confirmDelete() {
  if (!props.item) return;

  try {
    loading.value = true;

    await deleteItem(props.item.id);

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
            Excluir item
          </h3>
        </template>

        <div class="space-y-3">
          <p>
            Deseja remover este item?
          </p>

          <div
            v-if="item"
            class="p-3 rounded bg-gray-100 dark:bg-gray-800"
          >
            <strong>{{ item.name }}</strong>

            <div class="text-sm">
              {{ item.category }}
              -
              {{ item.amount }}
            </div>
          </div>

          <p class="text-sm text-gray-500">
            O item será apenas desativado e poderá ser recuperado futuramente.
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