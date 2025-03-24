const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Middleware para habilitar CORS
app.use(cors());

// Rota para servir como proxy
app.get('/proxy/imovel/:cod', async (req, res) => {  
    try {
        const response = await axios.get(`https://venda-imoveis.caixa.gov.br/sistema/detalhe-imovel.asp?hdnOrigem=index&hdnimovel=${req.params.cod}`);
        res.json({
          financiamento: !response.data.includes('Imóvel NÃO aceita financiamento habitacional'),
          fgts: !response.data.includes('Imóvel NÃO aceita utilização de FGTS')
        });  // Envia os dados para o frontend
    } catch (error) {
        res.status(500).send('Erro ao acessar o servidor externo');
    }
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
