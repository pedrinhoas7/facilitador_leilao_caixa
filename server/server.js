require('dotenv').config();
const express = require('express');
const puppeteer = require('puppeteer');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

let browser; // Armazena o navegador para uso contínuo

async function startBrowser() {
    if (!browser) {
        browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'] });
        console.log('🎭 Puppeteer iniciado!');
    }
}

async function solveCaptcha(page) {
    console.log('🔍 Verificando CAPTCHA...');
    const captchaFrame = await page.$('iframe[src*="hcaptcha.com"]');
    if (!captchaFrame) {
        console.log('✅ Nenhum CAPTCHA detectado.');
        return;
    }

    console.log('⚠️ CAPTCHA encontrado. Tentando resolver...');
    const captchaUrl = await page.$eval('iframe[src*="hcaptcha.com"]', (el) => el.src);
    const apiKey = process.env.CAPTCHA_API_KEY;

    if (!apiKey) throw new Error('🔑 Chave de API do 2Captcha não encontrada!');

    const { data } = await axios.get(
        `http://2captcha.com/in.php?key=${apiKey}&method=userrecaptcha&googlekey=${captchaUrl}&pageurl=${page.url()}&json=1`
    );

    if (data.status !== 1) throw new Error('❌ Erro ao solicitar CAPTCHA.');

    const requestId = data.request;
    console.log(`🕐 Esperando resolução do CAPTCHA...`);

    let captchaResponse;
    for (let i = 0; i < 30; i++) {
        await new Promise((res) => setTimeout(res, 5000)); // Espera 5s por tentativa
        const { data: result } = await axios.get(`http://2captcha.com/res.php?key=${apiKey}&action=get&id=${requestId}&json=1`);
        if (result.status === 1) {
            captchaResponse = result.request;
            break;
        }
    }

    if (!captchaResponse) throw new Error('⏳ Tempo esgotado para resolver CAPTCHA.');

    console.log('✅ CAPTCHA resolvido. Aplicando resposta...');
    await page.evaluate((token) => {
        document.querySelector('[name="h-captcha-response"]').value = token;
    }, captchaResponse);

    await Promise.all([page.waitForNavigation(), page.click('[type="submit"]')]);
    console.log('✅ CAPTCHA solucionado!');
}


// Função para iniciar o navegador Puppeteer
async function startBrowser() {
    const puppeteer = require('puppeteer');
    browser = await puppeteer.launch({ headless: true });
}

app.get('/proxy/imovel/:cod', async (req, res) => {
    if (!browser) {
        await startBrowser();
    }

    const page = await browser.newPage();
    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    );

    try {
        const url = `https://venda-imoveis.caixa.gov.br/sistema/detalhe-imovel.asp?hdnOrigem=index&hdnimovel=${req.params.cod}`;
        await page.goto(url, { waitUntil: 'networkidle2' }); // Aguardar a página carregar corretamente

        // await solveCaptcha(page); // Se você for resolver captcha, descomente isso

        const content = await page.content(); // Obter o conteúdo da página após o carregamento

        // Enviar a resposta
        res.json({
            financiamento: !content.includes('Imóvel NÃO aceita financiamento habitacional.'),
            fgts: !content.includes('Imóvel NÃO aceita utilização de FGTS.')
        });

    } catch (error) {
        console.error('❌ Erro:', error);
        res.status(500).send({ error: error.message });
    } finally {
        await page.close(); // Fechar a página ao final
    }
});


// Fechar o navegador quando o servidor for encerrado
process.on('SIGINT', async () => {
    console.log('🛑 Fechando navegador...');
    if (browser) await browser.close();
    process.exit();
});

app.listen(8001, async () => {
    await startBrowser(); // Garante que o browser já estará rodando
    console.log('🚀 Servidor rodando na porta 8001');
});
