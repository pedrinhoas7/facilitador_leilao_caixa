const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Middleware para habilitar CORS
app.use(cors());

// Rota para servir como proxy
app.get('/proxy/imovel/:cod', async (req, res) => {
    try {
        const response = await axios.get(
            `https://venda-imoveis.caixa.gov.br/sistema/detalhe-imovel.asp?hdnOrigem=index&hdnimovel=${req.params.cod}`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Referer': 'https://venda-imoveis.caixa.gov.br/',
                    'Accept-Language': 'pt-BR,pt;q=0.9',
                    'Accept': 'application/json, text/plain, */*',
                }
            }
        );

        res.json({
            financiamento: !response.data.includes('Imóvel NÃO aceita financiamento habitacional'),
            fgts: !response.data.includes('Imóvel NÃO aceita utilização de FGTS')
        });  // Envia os dados para o frontend
    } catch (error) {
        res.status(500).send(error);
    }
});

// Inicia o servidor na porta 3000
app.listen(8001, () => {
    console.log('Servidor rodando na porta 3000');
});
