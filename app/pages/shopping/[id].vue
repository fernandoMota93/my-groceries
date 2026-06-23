<script setup lang="ts">
import { getShoppingItems, updateShoppingItem } from '~/services/shopping-items';
import type { ShoppingItem } from '~/types/shopping-item';
import type { TableColumn } from '@nuxt/ui';
import { useMoneyMaskConfig } from '~/composables/useMoneyMask';

const route = useRoute();

const shoppingId = route.params.id as string;

const loading = ref(false);
const search = ref('');

const items = ref<ShoppingItem[]>([]);

const currency = new Intl.NumberFormat(
    'pt-BR',
    {
        style: 'currency',
        currency: 'BRL',
    },
);

const quantityMask = useMoneyMaskConfig('quantity');
const currencyMask = useMoneyMaskConfig('currency');

async function loadItems() {
    loading.value = true;

    try {
        items.value = await getShoppingItems(
            shoppingId,
        );
    } finally {
        loading.value = false;
    }
}

const filteredItems = computed(() => {
    if (!search.value) {
        return items.value;
    }

    return items.value.filter((item) =>
        item.name
            .toLowerCase()
            .includes(
                search.value.toLowerCase(),
            ),
    );
});

const groupedItems = computed(() => {
    const sorted = [...filteredItems.value].sort(
        (a, b) =>
            a.name.localeCompare(
                b.name,
                'pt-BR',
            ),
    );

     return sorted.reduce(
        (groups, item) => {
            if (!groups[item.category]) {
                groups[item.category] = [];
            }

            groups[item.category].push(item);

            return groups;
        },
        {} as Record<
            string,
            ShoppingItem[]
        >,
    );
});

const grandTotal = computed(() => {
    return items.value.reduce(
        (total, item) =>
            total + (item.total_price || 0),
        0,
    );
});

const pendingItems = computed(() => {
    return items.value.filter(
        (item) => item.buy > 0,
    ).length;
});

const completedItems = computed(() => {
    return items.value.filter(
        (item) => item.buy === 0,
    ).length;
});

function recalculate(
    item: ShoppingItem,
) {
    item.buy = Math.max(
        item.maintain -
        (item.stock || 0),
        0,
    );

    item.total_price =
        item.buy *
        (item.unit_price || 0);
}

async function saveItem(
    item: ShoppingItem,
) {
    await updateShoppingItem(
        shoppingId,
        item.id,
        {
            stock: item.stock,
            buy: item.buy,
            unit_price:
                item.unit_price,
            total_price:
                item.total_price,
        },
    );
}

async function updateItem(
    item: ShoppingItem,
) {
    recalculate(item);

    await saveItem(item);
}

// v-money3 (diretiva) entrega uma string mascarada via v-model.lazy,
// ex: "1,5" ou "R$ 12,90". Convertemos para Number antes de recalcular/salvar.
function parseMasked(value: unknown, decimal = ','): number {
    if (typeof value === 'number') {
        return value;
    }

    if (!value) {
        return 0;
    }

    const cleaned = String(value)
        .replace(/[^\d,.-]/g, '')
        .replace('.', '')
        .replace(decimal, '.');

    return Number(cleaned) || 0;
}

function onStockBlur(item: ShoppingItem) {
    item.stock = parseMasked(item.stock);
    updateItem(item);
}

function onUnitPriceBlur(item: ShoppingItem) {
    item.unit_price = parseMasked(item.unit_price);
    updateItem(item);
}

const columns: TableColumn<ShoppingItem>[] = [
    {
        accessorKey: 'name',
        header: 'Item',
    },
    {
        accessorKey: 'maintain',
        header: 'Manter',
        meta: {
            class: {
                th: 'text-center',
                td: 'text-center',
            },
        },
    },
    {
        accessorKey: 'stock',
        header: 'Estoque',
        meta: {
            class: {
                td: 'w-28',
            },
        },
    },
    {
        accessorKey: 'buy',
        header: 'Comprar',
        meta: {
            class: {
                th: 'text-center',
                td: 'text-center font-semibold',
            },
        },
    },
    {
        accessorKey: 'unit_price',
        header: 'Custo',
        meta: {
            class: {
                td: 'w-32',
            },
        },
    },
    {
        accessorKey: 'total_price',
        header: 'Total',
        meta: {
            class: {
                th: 'text-right',
                td: 'text-right font-semibold',
            },
        },
    },
];

onMounted(loadItems);

definePageMeta({
    layout: 'default',
    middleware: ['auth'],
});
</script>

<template>
    <div class="space-y-6">
        <div class="
                flex
                flex-col
                gap-4
                md:flex-row
                md:items-center
                md:justify-between
            ">
            <div>
                <h1 class="text-2xl font-bold">
                    Compra
                </h1>

                <p class="text-sm text-gray-500">
                    Controle de reposição de estoque
                </p>
            </div>

            <div class="flex gap-2 flex-wrap">
                <UBadge color="warning" variant="soft" size="lg">
                    Pendentes:
                    {{ pendingItems }}
                </UBadge>

                <UBadge color="success" variant="soft" size="lg">
                    Completos:
                    {{ completedItems }}
                </UBadge>

                <UBadge color="primary" size="lg">
                    {{ currency.format(grandTotal) }}
                </UBadge>
            </div>
        </div>

        <UCard>
            <UInput v-model="search" placeholder="Buscar item..." icon="i-lucide-search" />
        </UCard>

        <div v-for="(categoryItems, category) in groupedItems" :key="category" class="space-y-2">
            <div class="
                    flex
                    items-center
                    justify-between
                ">
                <h2 class="
                        text-lg
                        font-bold
                    ">
                    {{ category }}
                </h2>

                <UBadge color="neutral" variant="soft">
                    {{ categoryItems.length }}
                    itens
                </UBadge>
            </div>

            <UCard>
                <UTable
                    :data="categoryItems"
                    :columns="columns"
                    :loading="loading"
                >
                    <template #name-cell="{ row }">
                        <div class="
                                flex
                                items-center
                                gap-2
                            ">
                            <span>
                                {{ row.original.name }}
                            </span>

                            <UBadge v-if="
                                row.original.buy > 0
                            " color="warning" variant="soft">
                                Comprar
                            </UBadge>

                            <UBadge v-else color="success" variant="soft">
                                OK
                            </UBadge>
                        </div>
                    </template>

                    <template #maintain-cell="{ row }">
                        {{ row.original.maintain }}
                    </template>

                    <template #stock-cell="{ row }">
                        <UInput
                            v-model.lazy="row.original.stock"
                           
                            @blur="onStockBlur(row.original)"
                        />
                    </template>

                    <template #buy-cell="{ row }">
                        {{ row.original.buy }}
                    </template>

                    <template #unit_price-cell="{ row }">
                        <UInput
                            v-model.lazy="row.original.unit_price"
                            v-money3="currencyMask"
                            @blur="onUnitPriceBlur(row.original)"
                        />
                    </template>

                    <template #total_price-cell="{ row }">
                        {{  
                            currency.format(
                                row.original.total_price || 0,
                            )
                        }}
                    </template>
                </UTable>
            </UCard>
        </div>
    </div>
</template>