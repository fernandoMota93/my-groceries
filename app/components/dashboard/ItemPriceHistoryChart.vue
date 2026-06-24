<script setup lang="ts">
import { LineChart, LegendPosition } from 'vue-chrts';
import {
    getAvailableItemNames,
    getItemPriceHistory,
} from '~/services/dashboard';
import type { ItemPriceHistory } from '~/types/dashboard';

const loadingNames = ref(false);
const loadingHistory = ref(false);

const itemNames = ref<string[]>([]);
const selectedItem = ref<string | null>(null);
const history = ref<ItemPriceHistory | null>(null);

const currency = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

const categories = {
    unitPrice: {
        name: 'Preço unitário',
        color: '#3b82f6',
    },
};

// centavos -> reais, só na hora de plotar
const chartData = computed(() => {
    if (!history.value) return [];

    return history.value.points.map((point) => ({
        label: point.label,
        unitPrice: point.unitPrice / 100,
    }));
});

const priceVariation = computed(() => {
    if (!history.value || history.value.points.length < 2) return null;

    const first = history.value.points[0].unitPrice;
    const last = history.value.points[history.value.points.length - 1].unitPrice;

    if (first === 0) return null;

    return ((last - first) / first) * 100;
});

function yFormatter(tick: number | Date) {
    return currency.format(Number(tick));
}

async function loadNames() {
    loadingNames.value = true;

    try {
        itemNames.value = await getAvailableItemNames(12);

        if (itemNames.value.length > 0) {
            selectedItem.value = itemNames.value[0];
        }
    } finally {
        loadingNames.value = false;
    }
}

async function loadHistory(name: string | null) {
    if (!name) {
        history.value = null;
        return;
    }

    loadingHistory.value = true;

    try {
        history.value = await getItemPriceHistory(name, 12);
    } finally {
        loadingHistory.value = false;
    }
}

watch(selectedItem, (name) => loadHistory(name));

onMounted(loadNames);
</script>

<template>
    <UCard>
        <template #header>
            <div class="
                    flex
                    flex-col
                    gap-3
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">
                <div>
                    <h2 class="text-lg font-bold">
                        Histórico de preço por item
                    </h2>

                    <p class="text-sm text-gray-500">
                        Variação do valor unitário, últimos 12 meses
                    </p>
                </div>

                <USelectMenu
                    v-model="selectedItem"
                    :items="itemNames"
                    :loading="loadingNames"
                    searchable
                    placeholder="Selecione um item"
                    class="w-full sm:w-56"
                />
            </div>
        </template>

        <div v-if="loadingHistory" class="
                flex
                items-center
                justify-center
                h-64
            ">
            <UIcon name="i-lucide-loader-circle" class="
                    animate-spin
                    size-6
                    text-gray-400
                " />
        </div>

        <div v-else-if="!history" class="
                flex
                items-center
                justify-center
                h-64
                text-sm
                text-gray-500
            ">
            Nenhum histórico de preço encontrado para este item.
        </div>

        <template v-else>
            <div class="flex gap-2 flex-wrap mb-4">
                <UBadge color="neutral" variant="soft">
                    {{ history.category }}
                </UBadge>

                <UBadge
                    v-if="priceVariation !== null"
                    :color="priceVariation > 0 ? 'error' : 'success'"
                    variant="soft"
                >
                    <UIcon
                        :name="priceVariation > 0
                            ? 'i-lucide-trending-up'
                            : 'i-lucide-trending-down'"
                        class="size-4 mr-1"
                    />
                    {{ priceVariation > 0 ? '+' : '' }}{{ priceVariation.toFixed(1) }}%
                    no período
                </UBadge>
            </div>

            <LineChart
                :data="chartData"
                :categories="categories"
                x-axis="label"
                :height="280"
                :curve-type="'monotoneX'"
                :line-width="2"
                :y-formatter="yFormatter"
                :legend-position="LegendPosition.Bottom"
                y-grid-line
                hide-legend
            />
        </template>
    </UCard>
</template>