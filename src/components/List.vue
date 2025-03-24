<template>
    <div class="flex overflow-hidden ">
        <div v-if="imoveisOrdenados.length" class="h-full overflow-y-scroll">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div v-for="imovel in imoveisOrdenados" :key="imovel.id"
                    class="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
                    <img :src="imovel.imagem" alt="Imagem do imóvel" class="w-full h-48 object-cover" />
                    <div class="p-4">
                        <p class=" font-semibold text-gray-800">{{ imovel.bairro }}</p>
                        <p class="text-sm text-gray-600">{{ imovel.modalidade }}</p>
                        <p class="text-sm text-red-500 font-bold">Avaliação: {{ imovel.avaliacaoString }}</p>
                        <p class="text-sm text-green-700 font-bold">Preço: {{ imovel.valor }}</p>
                        <p class="text-sm text-gray-600 font-bold">Financiamento: {{ imovel.financiamento }}</p>
                        <p class="text-sm text-gray-600 font-bold">FGTS: {{ imovel.fgts }}</p>
                        <div class="mt-4 space-x-4">
                            <a :href="imovel.matricula" target="_blank"
                                class="text-blue-600 hover:underline text-sm">Matrícula</a>
                            <a :href="imovel.link" target="_blank" class="text-blue-600 hover:underline text-sm">Ver
                                detalhes</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <p v-else class="text-center text-lg text-gray-600">Ops! Não encontramos imóveis que correspondam ao seu filtro.</p>
    </div>
</template>

<script setup lang="ts">
import { useImoveisStore } from '../store/imoveisModule';
import { computed } from 'vue';
const store = useImoveisStore();

const imoveisOrdenados = computed(() => store.imoveisOrdenados);

store.carregarCSV();
</script>

<style scoped>

</style>