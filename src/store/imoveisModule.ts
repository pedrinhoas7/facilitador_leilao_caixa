// src/store/imoveisModule.ts
import { defineStore } from 'pinia';
import axios from 'axios';

export const useImoveisStore = defineStore('imoveis', {
  state: () => ({
    imoveis: [],
    financiamentoFiltro: null,
    fgtsFiltro: null,
    bairrosFiltro: [],
    cidadesFiltro: [], // Novo filtro por cidade
    ordenacao: 'default',
  }),

  actions: {
    async carregarCSV() {
      const response = await fetch('/imoveis.csv');
      const data = await response.text();
  
      const linhas = data.split('\n');
  
      const imoveisArray = linhas
          .map(linha => linha.split(';').map(coluna => coluna.trim()))
          .filter(colunas => colunas.length >= 11)
          .map(colunas => {
              const id = colunas[0];
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
                  financiamento: colunas[11] == "Erro"? null : colunas[11] ?? null,
                  fgts: colunas[12] == "Erro"? null : colunas[12] ?? null
              };
          });
  
      const batchSize = 100;
      for (let i = 0; i < imoveisArray.length; i += batchSize) {
          const batch = imoveisArray.slice(i, i + batchSize);
  
          // IDs que precisam de verificação de financiamento
          const idsParaVerificar = batch.filter(imovel => imovel.financiamento === null).map(imovel => imovel.id);
  
          if (idsParaVerificar.length > 0) {
              const resultados = await Promise.all(idsParaVerificar.map(id => this.verificarFinanciamento(id)));
  
              batch.forEach((imovel, index) => {
                  if (imovel.financiamento === null) {
                      imovel.financiamento = resultados[index]?.financiamento ?? 'Não informado';
                      imovel.fgts = resultados[index]?.fgts ?? 'Não informado';
                  }
              });
          }
      }
  
      this.imoveis = imoveisArray;
  },
  

    async verificarFinanciamento(id: string) {
      try {
        const url = `http://localhost:8001/proxy/imovel/${id}`;


        const res = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
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

    setCidadesFiltro(cidades: string[]) {
      this.cidadesFiltro = cidades;
    },

    setFinanciamentoFiltro(financiamento: boolean | null) {
      this.financiamentoFiltro = financiamento;
    },
    setFgtsFiltro(fgts: boolean | null) {
      this.fgtsFiltro = fgts;
    },
  },

  getters: {
    imoveisFiltrados: (state) => {
      return state.imoveis.filter(imovel => {
        const bairroFiltro = state.bairrosFiltro.length === 0 || state.bairrosFiltro.includes(imovel.bairro);
        const cidadesFiltro = state.cidadesFiltro.length === 0 || state.cidadesFiltro.includes(imovel.cidade);
        const financiamento = !state.financiamentoFiltro || imovel.financiamento === 'Sim';
        const fgts = !state.fgtsFiltro || imovel.fgts === 'Sim';
        return bairroFiltro && financiamento && fgts && cidadesFiltro;
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
    cidadesUnicas: (state) => {
      return [...new Set(state.imoveis.map(imovel => imovel.cidade))];
    },
  },
});
