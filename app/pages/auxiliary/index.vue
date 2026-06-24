<script setup lang="ts">
import { computed, ref } from 'vue';
import {
    getMeatFractioning,
    updateMeatFractioning,
    type MeatFractioning,
} from '~/services/meat-fractioning';

definePageMeta({
    layout: 'default',
    middleware: ['auth'],
});

const weeks = ref(5);
const items = ref<MeatFractioning[]>([]);

async function loadItems() {
    items.value = await getMeatFractioning();
}

onMounted(loadItems);

async function saveField(
    item: MeatFractioning,
    field: keyof MeatFractioning,
) {
    await updateMeatFractioning(item.id, {
        [field]: item[field],
    });
}

const calculatedItems = computed(() => {
    const mappedItems = items.value.map(item => {
        const totalGrams = item.gramsPerWeek * weeks.value;
        const totalPacks = item.packsPerWeek * weeks.value;

        return {
            ...item,
            totalGrams,
            totalPacks,
            buyGrams: Math.max(totalGrams - item.stockGrams, 0),
            buyPacks: Math.max(totalPacks - item.stockPacks, 0),
        };
    });

    return mappedItems.sort((a, b) =>
        a.name.localeCompare(b.name, 'pt-BR')
    );
});
</script>

<template>
    <div class="space-y-4 sm:space-y-5">
        <h3 class="text-lg sm:text-xl font-bold">
            Fracionamento de Carnes
        </h3>

        <!-- Configuração de Semanas -->
        <UCard>
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label for="weeks" class="font-medium text-sm sm:text-base">
                    Semanas para planejamento:
                </label>
                <UInput 
                    id="weeks"
                    v-model.number="weeks" 
                    type="number" 
                    min="1"
                    class="w-full sm:w-32"
                />
            </div>
        </UCard>

        <!-- Versão Mobile: Cards -->
        <div class="block md:hidden space-y-4">
            <UCard 
                v-for="item in calculatedItems" 
                :key="item.name"
                class="space-y-3"
            >
                <!-- Nome do Item -->
                <div class="text-lg font-bold text-primary border-b pb-2">
                    {{ item.name }}
                </div>

                <!-- Grid de campos -->
                <div class="grid grid-cols-2 gap-3">
                    <!-- Semana g -->
                    <div>
                        <label class="text-xs text-gray-500 block">Semana (g)</label>
                        <UInput 
                            v-model.number="item.gramsPerWeek" 
                            type="number" 
                            size="sm"
                            @blur="saveField(item, 'gramsPerWeek')"
                        />
                    </div>

                    <!-- Semana pct -->
                    <div>
                        <label class="text-xs text-gray-500 block">Semana (pct)</label>
                        <UInput 
                            v-model.number="item.packsPerWeek" 
                            type="number" 
                            size="sm"
                            @blur="saveField(item, 'packsPerWeek')"
                        />
                    </div>

                    <!-- Total g -->
                    <div>
                        <label class="text-xs text-gray-500 block">Total (g)</label>
                        <div class="text-sm font-medium py-1.5">
                            {{ item.totalGrams }}
                        </div>
                    </div>

                    <!-- Total pct -->
                    <div>
                        <label class="text-xs text-gray-500 block">Total (pct)</label>
                        <div class="text-sm font-medium py-1.5">
                            {{ item.totalPacks }}
                        </div>
                    </div>

                    <!-- Estoque g -->
                    <div>
                        <label class="text-xs text-gray-500 block">Estoque (g)</label>
                        <UInput 
                            v-model.number="item.stockGrams" 
                            type="number" 
                            size="sm"
                            @blur="saveField(item, 'stockGrams')"
                        />
                    </div>

                    <!-- Estoque pct -->
                    <div>
                        <label class="text-xs text-gray-500 block">Estoque (pct)</label>
                        <UInput 
                            v-model.number="item.stockPacks" 
                            type="number" 
                            size="sm"
                            @blur="saveField(item, 'stockPacks')"
                        />
                    </div>
                </div>

                <!-- Compras (destacado) -->
                <div class="grid grid-cols-2 gap-3 pt-2 border-t">
                    <div>
                        <label class="text-xs text-gray-500 block">Comprar (g)</label>
                        <div class="text-sm font-bold text-green-600 py-1.5">
                            {{ item.buyGrams }}
                        </div>
                    </div>
                    <div>
                        <label class="text-xs text-gray-500 block">Comprar (pct)</label>
                        <div class="text-sm font-bold text-green-600 py-1.5">
                            {{ item.buyPacks }}
                        </div>
                    </div>
                </div>
            </UCard>
        </div>

        <!-- Versão Desktop: Tabela -->
        <div class="hidden md:block">
            <UCard style="overflow: auto;">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-gray-50 dark:bg-gray-800">
                            <th class="px-3 py-2 text-left">Item</th>
                            <th class="px-3 py-2 text-center">Semana g</th>
                            <th class="px-3 py-2 text-center">Semana pct</th>
                            <th class="px-3 py-2 text-center">Total g</th>
                            <th class="px-3 py-2 text-center">Total pct</th>
                            <th class="px-3 py-2 text-center">Estoque g</th>
                            <th class="px-3 py-2 text-center">Estoque pct</th>
                            <th class="px-3 py-2 text-center">Comprar g</th>
                            <th class="px-3 py-2 text-center">Comprar pct</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in calculatedItems" :key="item.name" class="border-t">
                            <td class="px-3 py-2 font-medium">
                                {{ item.name }}
                            </td>
                            <td class="px-3 py-2">
                                <UInput 
                                    v-model.number="item.gramsPerWeek" 
                                    type="number" 
                                    size="xs"
                                    @blur="saveField(item, 'gramsPerWeek')"
                                />
                            </td>
                            <td class="px-3 py-2">
                                <UInput 
                                    v-model.number="item.packsPerWeek" 
                                    type="number" 
                                    size="xs"
                                    @blur="saveField(item, 'packsPerWeek')"
                                />
                            </td>
                            <td class="px-3 py-2 text-center">
                                {{ item.totalGrams }}
                            </td>
                            <td class="px-3 py-2 text-center">
                                {{ item.totalPacks }}
                            </td>
                            <td class="px-3 py-2">
                                <UInput 
                                    v-model.number="item.stockGrams" 
                                    type="number" 
                                    size="xs"
                                    @blur="saveField(item, 'stockGrams')"
                                />
                            </td>
                            <td class="px-3 py-2">
                                <UInput 
                                    v-model.number="item.stockPacks" 
                                    type="number" 
                                    size="xs"
                                    @blur="saveField(item, 'stockPacks')"
                                />
                            </td>
                            <td class="px-3 py-2 text-center font-bold text-green-600">
                                {{ item.buyGrams }}
                            </td>
                            <td class="px-3 py-2 text-center font-bold text-green-600">
                                {{ item.buyPacks }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </UCard>
        </div>
    </div>
</template>