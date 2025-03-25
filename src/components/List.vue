<template>
    <div class="" v-if="!loading">
        <div class="h-full overflow-y-scroll">
            <!-- Responsive Grid Layout -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div v-for="imovel in imoveisOrdenados" :key="imovel.id"
                    class="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
                    <img :src="imovel.imagem" alt="Imagem do imóvel" class="w-full h-48 object-cover" />
                    <div class="p-4">
                        <p class="font-semibold text-gray-800">{{ imovel.cidade }}/{{ imovel.uf }}</p>
                        <p class="font-semibold text-gray-800">{{ imovel.bairro }}</p>
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
    </div>
    <div v-else class="flex items-center justify-center h-96">
        <svg class="animate-spin h-12 w-12 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V2.5"></path>
        </svg>
    </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useImoveisStore } from '../store/imoveisModule';

const store = useImoveisStore();
const loading = ref(true);

const imoveisOrdenados = computed(() => store.imoveisOrdenados);

onMounted(async () => {
    await store.carregarCSV();
    loading.value = false;
    //await store.salvarCSV();
});
</script>

<style scoped></style>
