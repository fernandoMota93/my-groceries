<script setup lang="ts">
import { BarChart, LegendPosition } from 'vue-chrts';
import { getMonthlyTotals } from '~/services/dashboard';
import type { MonthlyTotalsChartPoint } from '~/types/dashboard';

const loading = ref(false);
const points = ref<MonthlyTotalsChartPoint[]>([]);
const categories = ref<string[]>([]);

const currency = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

// Paleta fixa para manter a mesma cor por categoria entre re-renders.
const palette = [
    '#3b82f6', '#f97316', '#22c55e', '#a855f7',
    '#ef4444', '#06b6d4', '#eab308', '#ec4899',
    '#64748b', '#14b8a6',
];

const chartCategories = computed(() => {
    return categories.value.reduce(
        (acc, category, index) => {
            acc[category] = {
                name: category,
                color: palette[index % palette.length],
            };

            return acc;
        },
        {} as Record<string, { name: string; color: string }>,
    );
});

const grandTotal = computed(() => {
    return points.value.reduce((sum, point) => sum + point.total, 0);
});

const averageMonthly = computed(() => {
    if (points.value.length === 0) return 0;

    return grandTotal.value / points.value.length;
});

// vue-chrts trabalha melhor com números "naturais" no eixo Y;
// convertemos centavos -> reais só na hora de plotar/formatar.
const chartData = computed(() => {
    return points.value.map((point) => {
        const converted: Record<string, string | number> = {
            label: point.label,
        };

        for (const category of categories.value) {
            converted[category] = ((point[category] as number) || 0) / 100;
        }

        return converted;
    });
});

function yFormatter(tick: number | Date) {
    return currency.format(Number(tick));
}

async function load() {
    loading.value = true;

    try {
        const result = await getMonthlyTotals(12);

        points.value = result.points;
        categories.value = result.categories;
    } finally {
        loading.value = false;
    }
}

onMounted(load);
</script>

<template>
    <UCard>
        <template #header>
            <div class="
                    flex
                    flex-col
                    gap-1
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">
                <div>
                    <h2 class="text-lg font-bold">
                        Gastos mensais por categoria
                    </h2>

                    <p class="text-sm text-gray-500">
                        Últimos 12 meses
                    </p>
                </div>

                <div class="flex gap-2 flex-wrap">
                    <UBadge color="primary" variant="soft" size="lg">
                        Total: {{ currency.format(grandTotal / 100) }}
                    </UBadge>

                    <UBadge color="neutral" variant="soft" size="lg">
                        Média/mês: {{ currency.format(averageMonthly / 100) }}
                    </UBadge>
                </div>
            </div>
        </template>

        <div v-if="loading" class="
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

        <div v-else-if="points.length === 0" class="
                flex
                items-center
                justify-center
                h-64
                text-sm
                text-gray-500
            ">
            Nenhuma compra encontrada nos últimos 12 meses.
        </div>

        <BarChart
            v-else
            :data="chartData"
            :categories="chartCategories"
            :y-axis="categories"
            x-axis="label"
            :height="320"
            :stacked="true"
            :radius="4"
            :y-formatter="yFormatter"
            :legend-position="LegendPosition.Bottom"
            y-grid-line
        />
    </UCard>
</template>