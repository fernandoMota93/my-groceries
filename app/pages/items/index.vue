<script setup lang="ts">
import { h } from 'vue';
import { UButton } from '#components';
import { getItems } from '~/services/items';
import { seedItems } from '~/utils/seedItems';
import type { Item } from '~/types/item';
import type { TableColumn } from '@nuxt/ui';
import ItemFormModal from './components/ItemFormModal.vue';
import ConfirmDeleteModal from './components/ConfirmDeleteModal.vue';

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
        .sort((a, b) =>
            a.name.localeCompare(b.name, 'pt-BR')
        );
});

const columns: TableColumn<Item>[] = [
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

                    <UBadge>
                        {{ items.length }}
                    </UBadge>
                </div>
            </template>
            <div class="flex gap-3 mb-4">

                <UInput v-model="search" placeholder="Buscar item..." class="flex-1" />

                <USelect v-model="categoryFilter" :items="[
                    'Todas',
                    ...categories
                ]" placeholder="Categoria" />

                <UButton color="neutral" variant="outline" @click="
                    search = '';
                categoryFilter = '';
                ">
                    Limpar
                </UButton>

            </div>

            <UTable :data="filteredItems" :columns="columns" :loading="loading" />
        </UCard>
        <ItemFormModal v-model:open="showCreateModal" @saved="reloadItems" />

        <ItemFormModal v-model:open="showEditModal" :item="itemSelected" @saved="reloadItems" />

        <ConfirmDeleteModal v-model:open="showDeleteModal" :item="itemSelected" @deleted="loadItems" />
    </div>
</template>