<template>
    <div >
    <div class="flex items-center justify-between">
        <h3 class="text-xl font-semibold p-1">Filtros</h3>
        <button 
    @click="showFilters = !showFilters" 
    class="p-2 rounded-full border border-white relative md:hidden">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke-width="1.5" 
      stroke="currentColor" 
      class="w-6 h-6">
      <!-- Seta para baixo (expandir) -->
      <path v-if="!showFilters" stroke-linecap="round" stroke-linejoin="round" d="M19.5 9l-7.5 7.5L4.5 9" />
      <!-- Seta para cima (recolher) -->
      <path v-if="showFilters" stroke-linecap="round" stroke-linejoin="round" d="M19.5 15l-7.5-7.5L4.5 15" />
    </svg>
  </button>
    </div>
     <div v-if="showFilters" class="flex flex-col p-4 bg-gray-50 rounded-md" >
         <!-- Filtro de forma de pagamento -->
      <label for="searchBairros" class="block text-sm font-medium mb-2">Forma de Pagamento</label>
      <div class="mb-4 flex items-center">
        <input type="checkbox" v-model="financiamentoFiltro" class="mr-2" />
        <label class="text-sm">Aceita financiamento</label>
      </div>
      <div class="mb-4 flex items-center">
        <input type="checkbox" v-model="FgtsFiltro" class="mr-2" />
        <label class="text-sm">Aceita FGTS</label>
      </div>
  
      <!-- Filtro de bairro -->
      <div class="mb-4">
        <label for="searchBairros" class="block text-sm font-medium mb-2">Pesquisar por bairro:</label>
        <input
          id="searchBairros"
          v-model="bairroSearch"
          type="text"
          placeholder="Filtrar bairros..."
          class="w-full p-2 border rounded-md shadow-sm bg-white"
        />
      </div>
  
      <div class="mb-4 overflow-y-scroll h-[20vh]">
        <div v-for="bairro in filteredBairros" :key="bairro" class="flex items-center mb-2">
          <input type="checkbox" :value="bairro" v-model="bairrosFiltro" class="mr-2" />
          <label class="text-sm">{{ bairro }}</label>
        </div>
      </div>
  
      <!-- Filtro de cidade -->
      <div class="mb-4">
        <label for="searchCidade" class="block text-sm font-medium mb-2">Pesquisar por cidade:</label>
        <input
          id="searchCidade"
          v-model="cidadeSearch"
          type="text"
          placeholder="Filtrar cidades..."
          class="w-full p-2 border rounded-md shadow-sm bg-white"
        />
      </div>
  
      <div class="mb-4 overflow-y-scroll h-[20vh]">
        <div v-for="cidade in filteredCidades" :key="cidade" class="flex items-center mb-2">
          <input type="checkbox" :value="cidade" v-model="cidadesFiltro" class="mr-2" />
          <label class="text-sm">{{ cidade }}</label>
        </div>
      </div>
  
      <!-- Ordenação -->
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
    </div>
  </template>
  

<script setup lang="ts">
import { useImoveisStore } from '@/store/imoveisModule';
import { ref, computed } from 'vue';

const showFilters = ref(true);
const showBairros = ref(false);
const showCidades = ref(false);
const bairroSearch = ref('');
const cidadeSearch = ref('');

const store = useImoveisStore();

const bairrosUnicos = computed(() => store.bairrosUnicos);
const cidadesUnicas = computed(() => store.cidadesUnicas);
const bairrosFiltro = computed({
    get: () => store.bairrosFiltro,
    set: (value) => store.setBairrosFiltro(value),
});

const cidadesFiltro = computed({
    get: () => store.cidadesFiltro,
    set: (value) => store.setCidadesFiltro(value),
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

// Filtra bairros com base na pesquisa
const filteredBairros = computed(() => {
    if (!bairroSearch.value) {
        return bairrosUnicos.value;
    }
    return bairrosUnicos.value.filter(bairro =>
        bairro.toLowerCase().includes(bairroSearch.value.toLowerCase())
    );
});

// Filtra cidades com base na pesquisa
const filteredCidades = computed(() => {
    if (!cidadeSearch.value) {
        return cidadesUnicas.value;
    }
    return cidadesUnicas.value.filter(cidade =>
        cidade.toLowerCase().includes(cidadeSearch.value.toLowerCase())
    );
});

const toggleBairros = () => {
    showBairros.value = !showBairros.value;
};

const toggleCidades = () => {
    showCidades.value = !showCidades.value;
};

const searchImoveis = () => {
    // Implementa a lógica de pesquisa
    store.searchImoveis({
        bairrosFiltro: bairrosFiltro.value,
        cidadesFiltro: cidadesFiltro.value,
        ordenacao: ordenacao.value,
        financiamentoFiltro: financiamentoFiltro.value,
        fgtsFiltro: FgtsFiltro.value,
    });
};
</script>

