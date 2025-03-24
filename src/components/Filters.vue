<template>
    <div class="filters">
        <label>Filtrar por bairros:</label>
        <div v-for="bairro in bairrosUnicos" :key="bairro">
            <input type="checkbox" :value="bairro" v-model="bairrosFiltro" />
            <label>{{ bairro }}</label>
        </div>

        <div>
            <label for="ordenacao">Ordenar por:</label>
            <select id="ordenacao" v-model="ordenacao">
                <option value="bairro">Bairro (Alfabética)</option>
                <option value="valorMaior">Maior valor</option>
                <option value="valorMenor">Menor valor</option>
                <option value="avaliacaoMaior">Maior avaliação</option>
                <option value="avaliacaoMenor">Menor avaliação</option>
            </select>
        </div>

        <div>
            <label>Filtrar por financiamento:</label>
            <input type="checkbox" v-model="financiamentoFiltro" /> Aceita financiamento
        </div>

        <button @click="salvarCSV">Salvar CSV</button>
    </div>
</template>

<script setup lang="ts">
import { useImoveisStore } from '@/store/imoveisModule';
import { computed } from 'vue';
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

const salvarCSV = () => store.salvarCSV();
</script>

<style scoped>
.filters {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 20px;
}

select,
button {
    margin-left: 5px;
    padding: 5px;
}
</style>