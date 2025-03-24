<template>
    <header class="bg-blue-950 text-white p-1 w-full flex items-center relative">
        <img src="/logo.png" alt="Logo" class="w-10 h-10 ml-2" />
        <h1 class="text-2xl font-semibold text-blue-50 ml-2 flex-grow relative">João Pessoa Imóveis Caixa</h1>
        <button @click="openModal" class="p-2 rounded-full border border-white relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 6h15M4.5 12h15M4.5 18h15" />
            </svg>
        </button>
    </header>
    
    <div v-if="isModalOpen" class="absolute inset-0  bg-opacity-50 flex justify-center items-center logo w-screen h-screen" placeholder="Informações sobre o projeto">
        <div class="bg-white p-6 rounded-lg max-w-3xl w-full opacity-96">
            <h2 class="text-2xl font-bold mb-4">Termos e Condições</h2>
            <p class="text-gray-700 text-sm mb-2">Este é um projeto <strong>open-source</strong> com o objetivo de melhorar a experiência do usuário na busca por imóveis vendidos pela Caixa.</p>
            <p class="text-gray-700 text-sm mb-2">As informações foram disponibilizadas de forma transparente pela própria Caixa Econômica Federal no seguinte link:</p>
            <a href="https://venda-imoveis.caixa.gov.br/sistema/download-lista.asp" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">Clique aqui para acessar</a>
            <p class="text-gray-700 text-sm mt-4"><strong>Importante:</strong> Não vendemos imóveis e somos apenas um facilitador de busca. Não nos responsabilizamos pela atualização das informações ou por qualquer transação realizada.</p>
            <p class="text-gray-700 text-sm">Ao utilizar o serviço, você concorda que não assumimos responsabilidade por eventuais divergências ou problemas relacionados aos dados exibidos.</p>
            <button @click="closeModal" class="mt-4 px-4 py-2 bg-blue-950 text-white rounded">Fechar</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isModalOpen = ref(true);

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};
</script>
