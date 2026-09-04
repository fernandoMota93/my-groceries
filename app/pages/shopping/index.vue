<script setup lang="ts">

import {
    getShopping,
} from '~/services/shopping';

import { getShoppingWeekly } from '~/services/shopping-weekly.js';

import ShoppingFormModal from './components/ShoppingFormModal.vue';
import ShoppingFormModalWeekly from './components/ShoppingFormModalWeekly.vue';
import ConfirmDeleteShoppingModal from './components/ConfirmDeleteShoppingModal.vue';
import HandlerModal from './components/HandlerModal.vue';

import { h } from 'vue';
import { UButton } from '#components';

import type { Shopping } from '~/types/shopping';


const loading = ref(false);
const loadingWeekly = ref(false);

const showCreateModal = ref(false);
const showCreateWeeklyModal = ref(false);

const showEditModal = ref(false);
const showEditWeeklyModal = ref(false);

const showDeleteModal = ref(false);
const showDeleteWeeklyModal = ref(false);

const showHandlerModal = ref(false);


const shopping = ref<Shopping[]>([]);
const shoppingWeekly = ref<Shopping[]>([]);


const shoppingSelected = ref<Shopping | null>(null);
const shoppingWeeklySelected = ref<Shopping | null>(null);


async function loadShopping() {

    loading.value = true;

    try {

        shopping.value = await getShopping();

    } finally {

        loading.value = false;

    }
}


async function loadShoppingWeekly() {

    loadingWeekly.value = true;

    try {

        shoppingWeekly.value = await getShoppingWeekly();

    } finally {

        loadingWeekly.value = false;

    }
}


async function loadAllShopping() {

    await Promise.all([
        loadShopping(),
        loadShoppingWeekly(),
    ]);

}


function handlerType(val: string) {

    if (val === 'mensal') {

        showHandlerModal.value = false;

        showCreateModal.value = true;

    }

    if (val === 'semanal') {

        showHandlerModal.value = false;

        showCreateWeeklyModal.value = true;

    }

}


function openShoppingWeekly(shopping: Shopping) {
    navigateTo(`/shopping/${shopping.id}?weekly=true`);
}

function openShopping(shopping: Shopping) {

    navigateTo(
        `/shopping/${shopping.id}`,
    );

}


function editShopping(shopping: Shopping) {

    shoppingSelected.value = shopping;

    showEditModal.value = true;

}


function editShoppingWeekly(shopping: Shopping) {

    shoppingWeeklySelected.value = shopping;

    showEditWeeklyModal.value = true;

}


function confirmDelete(shopping: Shopping) {

    shoppingSelected.value = shopping;

    showDeleteModal.value = true;

}


function confirmDeleteWeekly(shopping: Shopping) {

    shoppingWeeklySelected.value = shopping;

    showDeleteWeeklyModal.value = true;

}


/**
 * Colunas dos mercados mensais
 */
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

            const shopping = row.original;

            return h(
                'div',
                {
                    class: 'flex gap-2',
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
                            variant: 'outline',

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
                            variant: 'outline',

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
    },

];


/**
 * Colunas dos mercados semanais
 */
const columnsWeekly = [

    {
        accessorKey: 'title',
        header: 'Mercado',
    },

    {
        accessorKey: 'day',
        header: 'Dia',
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

            const shopping = row.original;

            return h(
                'div',
                {
                    class: 'flex gap-2',
                },
                [

                    h(
                        UButton,
                        {
                            size: 'xs',
                            color: 'primary',

                            onClick: () =>
                                openShoppingWeekly(
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
                            variant: 'outline',

                            onClick: () =>
                                editShoppingWeekly(
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
                            variant: 'outline',

                            onClick: () =>
                                confirmDeleteWeekly(
                                    shopping,
                                ),
                        },
                        () => 'Excluir',
                    ),

                ],
            );

        },
    },

];


onMounted(loadAllShopping);


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


            <UButton @click="showHandlerModal = true">
                Novo mercado
            </UButton>

        </div>


        <!-- Mercados mensais -->

        <UCard class="mb-6">

            <template #header>

                <h2 class="text-lg font-semibold">
                    Mercados mensais
                </h2>

            </template>


            <UTable :data="shopping" :columns="columns" :loading="loading" />

        </UCard>


        <!-- Mercados semanais -->

        <UCard>

            <template #header>

                <h2 class="text-lg font-semibold">
                    Mercados semanais
                </h2>

            </template>


            <UTable :data="shoppingWeekly" :columns="columnsWeekly" :loading="loadingWeekly" />

        </UCard>


        <!-- Modal para escolher o tipo -->

        <HandlerModal v-model:open="showHandlerModal" @selectedType="handlerType" />


        <!-- Modal mensal -->

        <ShoppingFormModal v-model:open="showCreateModal" @saved="loadAllShopping" />


        <!-- Modal semanal -->

        <ShoppingFormModalWeekly v-model:open="showCreateWeeklyModal" @saved="loadAllShopping" />


        <!-- Edição mensal -->

        <ShoppingFormModal v-model:open="showEditModal" :shopping="shoppingSelected" @saved="loadAllShopping" />


        <!-- Edição semanal -->

        <ShoppingFormModalWeekly v-model:open="showEditWeeklyModal" :shopping="shoppingWeeklySelected"
            @saved="loadAllShopping" />


        <!-- Exclusão mensal -->

        <ConfirmDeleteShoppingModal v-model:open="showDeleteModal" :shopping="shoppingSelected"
            @deleted="loadAllShopping" />


        <!-- Exclusão semanal -->

        <ConfirmDeleteShoppingModal v-model:open="showDeleteWeeklyModal" :shopping="shoppingWeeklySelected" :isWeekly="true"
            @deleted="loadAllShopping" />

    </div>

</template>