<script setup lang="ts">

import {
    getShopping,
    deleteShopping,
} from '~/services/shopping';
import ShoppingFormModal from './components/ShoppingFormModal.vue';
import { h } from 'vue';
import { UButton } from '#components';
import type { Shopping } from '~/types/shopping';
import ConfirmDeleteShoppingModal
    from './components/ConfirmDeleteShoppingModal.vue';

const loading = ref(false);
const showCreateModal = ref(false);
const shopping = ref<Shopping[]>([]);
const showEditModal = ref(false);
const showDeleteModal = ref(false);

const shoppingSelected = ref<Shopping | null>(
    null,
);

async function reloadShopping() {
    await loadShopping();
}

async function loadShopping() {

    loading.value = true;

    try {

        shopping.value = await getShopping();

    } finally {

        loading.value = false;

    }
}


onMounted(loadShopping);

function openShopping(
    shopping: Shopping,
) {
    navigateTo(
        `/shopping/${shopping.id}`,
    );
}

function editShopping(
    shopping: Shopping,
) {
    shoppingSelected.value =
        shopping;

    showEditModal.value = true;
}

function confirmDelete(
    shopping: Shopping,
) {
    shoppingSelected.value =
        shopping;

    showDeleteModal.value = true;
}
const columns = [
    {
        accessorKey: 'title',
        header: 'Mercado',
    },
    {
        accessorKey: 'month',
        header: 'Mês',
    },
    {
        accessorKey: 'year',
        header: 'Ano',
    },
    {
        id: 'actions',
        header: 'Ações',
        cell: ({ row }) => {

            const shopping =
                row.original;

            return h(
                'div',
                {
                    class:
                        'flex gap-2',
                },
                [

                    h(
                        UButton,
                        {
                            size: 'xs',
                            color: 'primary',
                            onClick: () =>
                                openShopping(
                                    shopping,
                                ),
                        },
                        () => 'Abrir',
                    ),

                    h(
                        UButton,
                        {
                            size: 'xs',
                            color: 'warning',
                            variant:
                                'outline',
                            onClick: () =>
                                editShopping(
                                    shopping,
                                ),
                        },
                        () => 'Editar',
                    ),

                    h(
                        UButton,
                        {
                            size: 'xs',
                            color: 'error',
                            variant:
                                'outline',
                            onClick: () =>
                                confirmDelete(
                                    shopping,
                                ),
                        },
                        () => 'Excluir',
                    ),
                ],
            );
        },
    }
];


definePageMeta({
    layout: 'default',
    middleware: ['auth'],
});

</script>

<template>

    <div>

        <div class="flex justify-between mb-4">

            <h1 class="text-2xl font-bold">
                Compras
            </h1>


            <UButton @click="showCreateModal = true">
                Novo mercado
            </UButton>

        </div>


        <UCard>

            <UTable :data="shopping" :columns="columns" :loading="loading" />

        </UCard>

        <ShoppingFormModal v-model:open="showCreateModal" @saved="loadShopping" />

        <ShoppingFormModal v-model:open="showEditModal" :shopping="shoppingSelected" @saved="loadShopping" />

        <ConfirmDeleteShoppingModal v-model:open="showDeleteModal" :shopping="shoppingSelected"
            @deleted="loadShopping" />
    </div>

</template>