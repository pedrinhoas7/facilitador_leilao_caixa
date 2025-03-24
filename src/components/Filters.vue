<template>
    <div class="flex flex-col p-4 bg-gray-50 rounded-md " >
        <h3 class="text-xl font-semibold p-1">Filtros</h3>

        <label for="searchBairros" class="block text-sm font-medium mb-2">Forma de Pagamento</label>
        <div class="mb-4 flex items-center">     
            <input type="checkbox" v-model="financiamentoFiltro" class="mr-2" />
            <label class="text-sm">Aceita financiamento</label>
        </div>
        <div class="mb-4 flex items-center">   
            <input type="checkbox" v-model="FgtsFiltro" class="mr-2" />
            <label class="text-sm">Aceita FGTS</label>
        </div>

        <!-- Search input to filter bairros -->
        <div class="mb-4 ">
            <label for="searchBairros" class="block text-sm font-medium mb-2">Pesquisar por bairro:</label>
            <input
                id="searchBairros"
                v-model="bairroSearch"
                type="text"
                placeholder="Filtrar bairros..."
                class="w-full p-2 border rounded-md shadow-sm bg-white"
            />
        </div>

        <div class="mb-4 overflow-y-scroll" style="height: 20vw;">
            <div v-for="bairro in filteredBairros" :key="bairro" class="flex items-center mb-2 " >
                <input type="checkbox" :value="bairro" v-model="bairrosFiltro" class="mr-2" />
                <label class="text-sm ">{{ bairro }}</label>
            </div>
        </div>


        <div class="mb-4">
            <label for="ordenacao" class="block text-sm font-medium mb-2">Ordenar por:</label>
            <select id="ordenacao" v-model="ordenacao" class="w-full p-2 border rounded-md shadow-sm bg-white">
                <option value="default">Padrão</option>
                <option value="valorMaior">Maior valor</option>
                <option value="valorMenor">Menor valor</option>
                <option value="avaliacaoMaior">Maior avaliação</option>
                <option value="avaliacaoMenor">Menor avaliação</option>
            </select>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useImoveisStore } from '@/store/imoveisModule';
import { ref, computed } from 'vue';

const showFilters = ref(false);
const showBairros = ref(false);
const bairroSearch = ref('');

const store = useImoveisStore();

const bairrosUnicos = computed(() => store.bairrosUnicos);
const bairrosFiltro = computed({
    get: () => store.bairrosFiltro,
    set: (value) => store.setBairrosFiltro(value),
});

const ordenacao = computed({
    get: () => store.ordenacao,
    set: (value) => store.setOrdenacao(value),
});

const financiamentoFiltro = computed({
    get: () => store.financiamentoFiltro,
    set: (value) => store.setFinanciamentoFiltro(value),
});

const FgtsFiltro = computed({
    get: () => store.fgtsFiltro,
    set: (value) => store.setFgtsFiltro(value),
});

// Filtered bairros based on the search input
const filteredBairros = computed(() => {
    if (!bairroSearch.value) {
        return bairrosUnicos.value;
    }
    return bairrosUnicos.value.filter(bairro =>
        bairro.toLowerCase().includes(bairroSearch.value.toLowerCase())
    );
});

const toggleBairros = () => {
    showBairros.value = !showBairros.value;
};

const searchImoveis = () => {
    // Implement your search logic here
    store.searchImoveis({
        bairrosFiltro: bairrosFiltro.value,
        ordenacao: ordenacao.value,
        financiamentoFiltro: financiamentoFiltro.value
    });
};
</script>
