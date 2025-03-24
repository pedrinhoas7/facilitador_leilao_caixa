<template>
    <div v-if="imoveisOrdenados.length">
        <div class="grid">
            <div v-for="imovel in imoveisOrdenados" :key="imovel.id" class="imovel">
                <img :src="imovel.imagem" alt="Imagem do imóvel" width="200" />
                <p>{{ imovel.bairro }} - R$ <span class="fonte">{{ imovel.valorString }}</span></p>
                <p>Avaliação: {{ imovel.avaliacaoString }}</p>
                <p>{{ imovel.endereco }}</p>
                <p>{{ imovel.cidade }} - {{ imovel.estado }}</p>
                <p>Área: {{ imovel.metros }} m²</p>
                <p>Financiamento: {{ imovel.financiamento }}</p>
                <p>FGTS: {{ imovel.fgts }}</p>
                <a :href="imovel.matricula" target="_blank">Matrícula</a>
                <br>
                <a :href="imovel.link" target="_blank">Ver detalhes</a>
            </div>
        </div>
    </div>
    <p v-else>Carregando imóveis...</p>
</template>

<script setup lang="ts">
import { useImoveisStore } from '../store/imoveisModule';
import { computed } from 'vue';
const store = useImoveisStore();

const imoveisOrdenados = computed(() => store.imoveisOrdenados);

store.carregarCSV();
</script>

<style scoped>
.grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
}

.imovel {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
}

a {
    color: #04986D;
    text-decoration: none;
}

.fonte {
    font-size: 20px;
    font-weight: bold;
}
</style>