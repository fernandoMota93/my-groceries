<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { h } from 'vue';
import { UButton } from '#components';
import { getItems } from '~/services/items';
import { seedItems } from '~/utils/seedItems';
import type { Item } from '~/types/item';
import type { TableColumn } from '@nuxt/ui';
import ItemFormModal from './components/ItemFormModal.vue';
import ConfirmDeleteModal from './components/ConfirmDeleteModal.vue';
import { doc, writeBatch } from 'firebase/firestore';
import { db } from '~/services/firebase';
import { useDraggable } from '@vueuse/core';

const loading = ref(false);
const items = ref<Item[]>([]);
const itemSelected = ref<Item | null>(null);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);

const search = ref('');
const categoryFilter = ref('');

const categories = [
    'Alimentos',
    'Pets',
    'Condimentos',
    'Temperos',
    'Carnes e Frios',
    'Limpeza',
    'Higiene',
];

const filteredItems = computed(() => {
    return items.value
        .filter((item) => {
            const matchesSearch = item.name
                .toLowerCase()
                .includes(search.value.toLowerCase());

            const matchesCategory = categoryFilter.value
                && categoryFilter.value !== 'Todas'
                ? item.category === categoryFilter.value
                : true;

            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => a.order - b.order);
});

// Estado para drag and drop
const draggedIndex = ref<number | null>(null);
const dragOverIndex = ref<number | null>(null);

// Funções de drag and drop
function onDragStart(event: DragEvent, index: number) {
    draggedIndex.value = index;
    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('text/plain', String(index));

    // Adiciona classe ao elemento arrastado
    const target = event.target as HTMLElement;
    target.closest('.draggable-row')?.classList.add('dragging');
}

function onDragEnd(event: DragEvent) {
    draggedIndex.value = null;
    dragOverIndex.value = null;

    // Remove classes
    document.querySelectorAll('.draggable-row').forEach(el => {
        el.classList.remove('dragging', 'drag-over');
    });
}

function onDragOver(event: DragEvent, index: number) {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';

    if (draggedIndex.value !== null && draggedIndex.value !== index) {
        dragOverIndex.value = index;
    }
}

function onDragLeave(event: DragEvent) {
    // Remove classe drag-over
    const target = event.target as HTMLElement;
    target.closest('.draggable-row')?.classList.remove('drag-over');
}

async function onDrop(event: DragEvent, targetIndex: number) {
    event.preventDefault();

    const sourceIndex = parseInt(event.dataTransfer?.getData('text/plain') || '-1');

    if (sourceIndex === -1 || sourceIndex === targetIndex) {
        onDragEnd(event);
        return;
    }

    // Reordena os itens
    const currentItems = [...filteredItems.value];
    const [movedItem] = currentItems.splice(sourceIndex, 1);
    currentItems.splice(targetIndex, 0, movedItem);

    // Atualiza a ordem
    const updatedItems = currentItems.map((item, index) => ({
        ...item,
        order: index + 1
    }));

    // Atualiza o estado local
    const allItemIds = new Set(updatedItems.map(item => item.id));
    const otherItems = items.value.filter(item => !allItemIds.has(item.id));
    items.value = [...updatedItems, ...otherItems];

    // Salva no Firebase
    try {
        const batch = writeBatch(db);
        updatedItems.forEach((item) => {
            const docRef = doc(db, 'items', item.id);
            batch.update(docRef, { order: item.order });
        });
        await batch.commit();
    } catch (error) {
        console.error('Erro ao reordenar itens:', error);
        await loadItems(); // Recarrega em caso de erro
    }

    onDragEnd(event);
}

const columns: TableColumn<Item>[] = [
    {
        accessorKey: 'order',
        header: '#',
    },
    {
        accessorKey: 'name',
        header: 'Nome',
    },
    {
        accessorKey: 'category',
        header: 'Categoria',
    },
    {
        accessorKey: 'amount',
        header: 'Manter',
    },
    {
        id: 'actions',
        header: 'Ações',
        cell: ({ row }) => {
            return h('div', {
                class: 'flex gap-2',
            }, [
                h(UButton, {
                    size: 'xs',
                    color: 'primary',
                    onClick: () => editItem(row.original),
                }, () => 'Editar'),

                h(UButton, {
                    size: 'xs',
                    color: 'error',
                    variant: 'outline',
                    onClick: () => confirmDelete(row.original),
                }, () => 'Excluir'),
            ]);
        },
    },
];

async function reloadItems() {
    await loadItems();
}

function createItemModal() {
    itemSelected.value = null;
    showCreateModal.value = true;
}

function editItem(item: Item) {
    itemSelected.value = item;
    showEditModal.value = true;
}

function confirmDelete(item: Item) {
    itemSelected.value = item;
    showDeleteModal.value = true;
}

async function loadItems() {
    loading.value = true;

    try {
        items.value = await getItems();
    } finally {
        loading.value = false;
    }
}

async function handleSeed() {
    try {
        const total = await seedItems();
        await loadItems();
        alert(`${total} itens importados.`);
    } catch (error) {
        console.error(error);
    }
}

onMounted(loadItems);

definePageMeta({
    layout: 'default',
    middleware: ['auth'],
});
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold">
                Items
            </h1>

            <div class="flex gap-2">
                <UButton color="neutral" :loading="loading" @click="handleSeed" v-if="items.length < 1">
                    Popular itens
                </UButton>

                <UButton color="primary" @click="createItemModal">
                    Novo Item
                </UButton>
            </div>
        </div>

        <UCard style="height: 80vh; overflow: auto;">
            <template #header>
                <div class="flex items-center justify-between">
                    <span>Itens cadastrados</span>
                    <UBadge>{{ items.length }}</UBadge>
                </div>
            </template>

            <div class="flex gap-3 mb-4">
                <UInput v-model="search" placeholder="Buscar item..." class="flex-1" />
                <USelect v-model="categoryFilter" :items="['Todas', ...categories]" placeholder="Categoria" />
                <UButton color="neutral" variant="outline" @click="search = ''; categoryFilter = '';">
                    Limpar
                </UButton>
            </div>

            <!-- Lista com drag and drop nativo -->
            <div class="space-y-1" style="overflow: auto;">
                <div v-for="(item, index) in filteredItems" :key="item.id" class="
                        draggable-row
                        grid 
                        grid-cols-12 
                        gap-2 
                        items-center 
                        py-2 
                        px-3 
                        border 
                        border-gray-200 
                        rounded-lg
                        hover:bg-gray-50 
                        transition-all
                        cursor-move
                        select-none
                    " :class="{
                        'bg-gray-100 border-blue-300': dragOverIndex === index,
                        'opacity-50': draggedIndex === index,
                    }" draggable="true" @dragstart="onDragStart($event, index)" @dragend="onDragEnd"
                    @dragover="onDragOver($event, index)" @dragleave="onDragLeave" @drop="onDrop($event, index)">
                    <!-- Handle de arrasto -->
                    <div class="col-span-1 text-center text-gray-400 hover:text-gray-600">
                        <span class="text-xl">⠿</span>
                    </div>
                    <!-- Nome -->
                    <div class="col-span-4 font-small truncate">
                        <small>{{ item.name }}</small>
                    </div>

                    <!-- Categoria -->
                    <div class="col-span-2">
                        <UBadge color="neutral" variant="soft">
                            <small>{{ item.category }}</small>
                        </UBadge>
                    </div>

                    <!-- Quantidade -->
                    <div class="col-span-2 text-center">
                        <small>{{ item.amount }}</small>
                    </div>

                    <!-- Ações -->
                    <div class="col-span-3 flex justify-end gap-2">
                        <div class="col-span-3 flex justify-end gap-2">
                            <UButton size="xs" color="primary" variant="soft" @click="editItem(item)"
                                icon="i-lucide-pencil" />

                            <UButton size="xs" color="error" variant="soft" @click="confirmDelete(item)"
                                icon="i-lucide-trash-2" />
                        </div>
                    </div>
                </div>

                <!-- Mensagem quando não há itens -->
                <div v-if="filteredItems.length === 0" class="text-center py-8 text-gray-500">
                    Nenhum item encontrado
                </div>
            </div>
        </UCard>

        <ItemFormModal v-model:open="showCreateModal" :itemLength="items.length" @saved="reloadItems" />
        <ItemFormModal v-model:open="showEditModal" :item="itemSelected" @saved="reloadItems" />
        <ConfirmDeleteModal v-model:open="showDeleteModal" :item="itemSelected" @deleted="loadItems" />
    </div>
</template>

<style scoped>
.draggable-row {
    transition: all 0.2s ease;
    user-select: none;
}

.draggable-row:hover {
    transform: translateY(-1px);
    background-color: #4e4e4e;
    color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.draggable-row.dragging {
    opacity: 0.4;
    transform: scale(0.98);

}

.draggable-row.drag-over {
    border-color: #3b82f6;
    background-color: #4e4e4e !important;

    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}
</style>