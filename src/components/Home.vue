<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios';

const financiamentoFiltro = ref<boolean | null>(null); // Filtro de financiamento

const imoveis = ref<{ 
    id: string; estado: string; cidade: string; bairro: string; endereco: string; 
    valor: number; avaliacao: number; valorString: string; avaliacaoString: string;
    metros: string; link: string; imagem: string; matricula: string;
    financiamento: string | null; fgts: string | null 
}[]>([]);

const bairrosFiltro = ref<string[]>([]);
const ordenacao = ref<string>('bairro');

const carregarCSV = async () => {
    const response = await fetch('/src/csv/imoveis.csv');
    const data = await response.text();

    const imoveisArray = data
        .split('\n')
        .map(linha => linha.split(';').map(coluna => coluna.trim()))
        .filter(colunas => colunas.length >= 11)
        .map(async colunas => {
            const id = colunas[0];
            const financiamentoData = colunas[11] == null ? await verificarFinanciamento(id) : { financiamento: colunas[11], fgts: colunas[12] };
            return {
                id,
                estado: colunas[1],
                cidade: colunas[2],
                bairro: colunas[3],
                endereco: colunas[4],
                valor: parseFloat(colunas[5].replace(',', '.').trim()) || 0,
                avaliacao: parseFloat(colunas[6].replace(',', '.').trim()) || 0,
                valorString: colunas[5],
                avaliacaoString: colunas[6],
                desconto: colunas[7] || '',
                descricao: colunas[8] || '',
                modalidade: colunas[9] || '',
                link: colunas[10] || '',
                imagem: `https://venda-imoveis.caixa.gov.br/fotos/F${id}21.jpg`,
                matricula: `https://venda-imoveis.caixa.gov.br/editais/matricula/PB/${id}.pdf`,
                financiamento: financiamentoData?.financiamento ?? 'Não informado',
                fgts: financiamentoData?.fgts ?? 'Não informado'
            };
        });

    imoveis.value = await Promise.all(imoveisArray);
};

// Função para salvar o CSV reorganizado
// Função para salvar o CSV reorganizado, incluindo links das imagens e do PDF
const salvarCSV = () => {
    let csvContent = 'id;estado;cidade;bairro;endereco;preco;avaliacao;desconto;descricao;modalidade;link;financiamento;FGTS;imagem;pdf\n';

    imoveis.value.forEach(imovel => {
        csvContent += `${imovel.id};${imovel.estado};${imovel.cidade};${imovel.bairro};${imovel.endereco};${imovel.valorString};${imovel.avaliacaoString};${imovel.desconto};${imovel.descricao};${imovel.modalidade};${imovel.link};${imovel.financiamento};${imovel.fgts};${imovel.imagem};${imovel.matricula}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'imoveis-atualizado.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};





// Verificar financiamento para um imóvel
const verificarFinanciamento = async (id: string) => {
    try {
        console.log('Verificando financiamento para o imóvel', id);
        const url = `http://localhost:3000/proxy/imovel/${id}`;
        const res = await axios.get(url);
        return {
            financiamento: res.data.financiamento ? 'Sim' : 'Não',
            fgts: res.data.fgts ? 'Sim' : 'Não'
        };
    } catch (error) {
        console.error(error);
        return { financiamento: 'Erro', fgts: 'Erro' };
    }
};

// Filtra os imóveis pelos bairros selecionados
const imoveisFiltrados = computed(() => {
    return imoveis.value.filter(imovel => {
        const bairroFiltro = bairrosFiltro.value.length === 0 || bairrosFiltro.value.includes(imovel.bairro);
        const financiamento = !financiamentoFiltro.value || imovel.financiamento === 'Sim';
        return bairroFiltro && financiamento;
    });
});

// Ordena os imóveis com base na opção selecionada
const imoveisOrdenados = computed(() => {
    let lista = [...imoveisFiltrados.value];
    switch (ordenacao.value) {
        case 'bairro':
            return lista.sort((a, b) => a.bairro.localeCompare(b.bairro));
        case 'valorMaior':
            return lista.sort((a, b) => b.valor - a.valor);
        case 'valorMenor':
            return lista.sort((a, b) => a.valor - b.valor);
        case 'avaliacaoMaior':
            return lista.sort((a, b) => b.avaliacao - a.avaliacao);
        case 'avaliacaoMenor':
            return lista.sort((a, b) => a.avaliacao - b.avaliacao);
        default:
            return lista;
    }
});



// Carregar os dados ao montar o componente
onMounted(carregarCSV);

// Obtém bairros únicos para o filtro
const bairrosUnicos = computed(() => {
    return [...new Set(imoveis.value.map(imovel => imovel.bairro))];
});
</script>

<template>
    <div>
        <!-- Filtro por bairros (checkbox) -->
        <div class="filters">
            <label>Filtrar por bairros:</label>
            <div v-for="bairro in bairrosUnicos" :key="bairro">
                <input type="checkbox" :value="bairro" v-model="bairrosFiltro" />
                <label>{{ bairro }}</label>
            </div>
        </div>
        

        <!-- Ordenação -->
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

        <!-- Pagamento -->
        <div>
            <label>Filtrar por financiamento:</label>
            <input type="checkbox" v-model="financiamentoFiltro" /> Aceita financiamento
        </div>

        <button @click="salvarCSV">Salvar CSV</button>

        <!-- Exibição dos imóveis -->
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
    </div>
</template>

<style scoped>
h1 {
    color: #04986D;
}

div {
    margin-bottom: 10px;
}

select,
button {
    margin-left: 5px;
    padding: 5px;
    font-size: 14px;
}

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

.filters {
    display: flex;
    flex-wrap: wrap;
}
</style>
