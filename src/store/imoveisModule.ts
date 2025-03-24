// src/store/imoveisModule.ts
import { defineStore } from 'pinia';
import axios from 'axios';

export const useImoveisStore = defineStore('imoveis', {
  state: () => ({
    imoveis: [],
    financiamentoFiltro: null,
    bairrosFiltro: [],
    ordenacao: 'bairro',
  }),

  actions: {
    async carregarCSV() {
      const response = await fetch('/imoveis.csv');
      const data = await response.text();

      const imoveisArray = data
        .split('\n')
        .map(linha => linha.split(';').map(coluna => coluna.trim()))
        .filter(colunas => colunas.length >= 11)
        .map(async colunas => {
          const id = colunas[0];
          const financiamentoData = colunas[11] == null ? await this.verificarFinanciamento(id) : { financiamento: colunas[11], fgts: colunas[12] };
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
            fgts: financiamentoData?.fgts ?? 'Não informado',
          };
        });

      this.imoveis = await Promise.all(imoveisArray);
    },

    async verificarFinanciamento(id: string) {
      try {
        const url = `http://localhost:3000/proxy/imovel/${id}`;
        const res = await axios.get(url);
        return {
          financiamento: res.data.financiamento ? 'Sim' : 'Não',
          fgts: res.data.fgts ? 'Sim' : 'Não',
        };
      } catch (error) {
        console.error(error);
        return { financiamento: 'Erro', fgts: 'Erro' };
      }
    },

    salvarCSV() {
      let csvContent = 'id;estado;cidade;bairro;endereco;preco;avaliacao;desconto;descricao;modalidade;link;financiamento;FGTS;imagem;pdf\n';
      this.imoveis.forEach(imovel => {
        csvContent += `${imovel.id};${imovel.estado};${imovel.cidade};${imovel.bairro};${imovel.endereco};${imovel.valorString};${imovel.avaliacaoString};${imovel.desconto};${imovel.descricao};${imovel.modalidade};${imovel.link};${imovel.financiamento};${imovel.fgts};${imovel.imagem};${imovel.matricula}\n`;
      });

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'imoveis-atualizado.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },

    setOrdenacao(ordenacao: string) {
      this.ordenacao = ordenacao;
    },

    setBairrosFiltro(bairros: string[]) {
      this.bairrosFiltro = bairros;
    },

    setFinanciamentoFiltro(financiamento: boolean | null) {
      this.financiamentoFiltro = financiamento;
    },
  },

  getters: {
    imoveisFiltrados: (state) => {
      return state.imoveis.filter(imovel => {
        const bairroFiltro = state.bairrosFiltro.length === 0 || state.bairrosFiltro.includes(imovel.bairro);
        const financiamento = !state.financiamentoFiltro || imovel.financiamento === 'Sim';
        return bairroFiltro && financiamento;
      });
    },

    imoveisOrdenados: (state) => {
      let lista = [...state.imoveisFiltrados];
      switch (state.ordenacao) {
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
    },

    bairrosUnicos: (state) => {
      return [...new Set(state.imoveis.map(imovel => imovel.bairro))];
    },
  },
});
