import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Documentation')
@Controller('docs')
export class DocsController {
  
  @Get()
  @ApiOperation({ 
    summary: 'Documentação da API',
    description: 'Página de documentação simples para entender como usar a API'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Página de documentação HTML' 
  })
  getDocs(@Res() res: Response) {
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Relatório Clear Sale - Documentação</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6; 
            color: #333; 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 20px;
            background: #f8f9fa;
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            text-align: center; 
            padding: 60px 20px; 
            border-radius: 12px; 
            margin-bottom: 40px;
        }
        .header h1 { 
            font-size: 3rem; 
            margin-bottom: 15px; 
        }
        .section { 
            background: white; 
            margin-bottom: 30px; 
            border-radius: 12px; 
            padding: 30px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .section h2 { 
            color: #495057; 
            border-bottom: 2px solid #667eea; 
            padding-bottom: 10px;
        }
        .step { 
            background: #f8f9fa; 
            padding: 20px; 
            margin: 20px 0; 
            border-radius: 8px; 
            border-left: 4px solid #667eea;
        }
        .code { 
            background: #2d3748; 
            color: #e2e8f0; 
            padding: 20px; 
            border-radius: 8px; 
            overflow-x: auto;
            margin: 15px 0;
            font-family: monospace;
        }
        .endpoint { 
            display: inline-block; 
            background: #007bff; 
            color: white; 
            padding: 8px 15px; 
            border-radius: 20px; 
            font-weight: bold; 
            margin: 10px 0;
        }
        .success { 
            background: #d4edda; 
            border: 1px solid #c3e6cb; 
            color: #155724; 
            padding: 15px; 
            border-radius: 8px; 
            margin: 15px 0;
        }
        .info { 
            background: #d1ecf1; 
            border: 1px solid #bee5eb; 
            color: #0c5460; 
            padding: 15px; 
            border-radius: 8px; 
            margin: 15px 0;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0;
        }
        th, td { 
            text-align: left; 
            padding: 12px; 
            border-bottom: 1px solid #e9ecef;
        }
        th { 
            background: #f8f9fa; 
            font-weight: 600;
        }
        .quick-links { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            gap: 20px; 
            margin-top: 30px;
        }
        .quick-link { 
            background: white; 
            padding: 25px; 
            border-radius: 12px; 
            text-align: center; 
            text-decoration: none; 
            color: #495057; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .quick-link:hover { 
            transform: translateY(-5px); 
            text-decoration: none; 
        }
        .icon { 
            font-size: 2.5rem; 
            margin-bottom: 15px; 
            display: block;
        }
        .quick-link h3 { 
            color: #667eea; 
            margin-bottom: 10px;
        }
        @media (max-width: 768px) {
            .header h1 { font-size: 2rem; }
            body { padding: 10px; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 API Relatório Clear Sale</h1>
        <p>Documentação completa para gerar relatórios HTML com dados do Clear Sale Credit Pro</p>
    </div>

    <div class="section">
        <h2>🎯 O que esta API faz?</h2>
        <p>Esta API permite que você:</p>
        <ul>
            <li><strong>Envie uma lista de CPFs</strong> (com ou sem pontuação)</li>
            <li><strong>Consulte automaticamente</strong> os dados no Clear Sale</li>
            <li><strong>Receba um relatório HTML</strong> completo e interativo</li>
            <li><strong>Salve o arquivo</strong> automaticamente no servidor</li>
            <li><strong>Visualize scores, personas e potenciais</strong> de consumo</li>
        </ul>
    </div>

    <div class="section">
        <h2>🚀 Como usar em 3 passos</h2>
        
        <div class="step">
            <h3>1. Prepare sua lista de CPFs</h3>
            <p>Organize os CPFs que você quer consultar. Pode ser com ou sem pontuação.</p>
            <div class="info">
                <strong>Exemplos válidos:</strong><br>
                "11111111111" (sem pontuação)<br>
                "222.222.222-22" (com pontuação)<br>
                "33333333333" (misturado)
            </div>
        </div>

        <div class="step">
            <h3>2. Faça a requisição para a API</h3>
            <p>Envie uma requisição POST para o endpoint principal:</p>
            <div class="endpoint">POST /reports/generate</div>
            <div class="code">curl -X POST http://localhost:3000/reports/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "cpfs": [
      "11111111111",
      "222.222.222-22",
      "33333333333"
    ]
  }'</div>
        </div>

        <div class="step">
            <h3>3. Receba o relatório HTML</h3>
            <p>A API retornará:</p>
            <ul>
                <li><strong>HTML completo</strong> do relatório</li>
                <li><strong>Nome do arquivo</strong> salvo no servidor</li>
                <li><strong>Estatísticas</strong> dos CPFs processados</li>
            </ul>
            <div class="success">
                <strong>💡 Dica:</strong> O HTML já vem pronto para salvar como arquivo .html e abrir no navegador!
            </div>
        </div>
    </div>

    <div class="section">
        <h2>📋 Detalhes da Requisição</h2>
        <h3>Endpoint:</h3>
        <div class="endpoint">POST /reports/generate</div>

        <h3>Parâmetros do Body (JSON):</h3>
        <table>
            <thead>
                <tr>
                    <th>Campo</th>
                    <th>Tipo</th>
                    <th>Obrigatório</th>
                    <th>Descrição</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>cpfs</td>
                    <td>Array de strings</td>
                    <td>Sim</td>
                    <td>Lista de CPFs para consultar (com ou sem pontuação)</td>
                </tr>
            </tbody>
        </table>

        <h3>Exemplo de Requisição:</h3>
        <div class="code">{
  "cpfs": [
    "12345678901",
    "987.654.321-00",
    "11111111111"
  ]
}</div>
    </div>

    <div class="section">
        <h2>📤 Resposta da API</h2>
        <h3>Em caso de sucesso (200):</h3>
        <div class="code">{
  "html": "&lt;!DOCTYPE html&gt;...&lt;/html&gt;",
  "filename": "relatorio-credit-pro-2025-08-11T15-30-45.html",
  "jsonFilename": "relatorio-credit-pro-2025-08-11T15-30-45.json",
  "cpfsProcessed": 3,
  "cpfsWithData": 2,
  "processingTime": 45,
  "successRate": 67,
  "timestamp": "2025-08-11T15:30:45.123Z"
}</div>

        <table>
            <thead>
                <tr>
                    <th>Campo</th>
                    <th>Descrição</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>html</td>
                    <td>Código HTML completo do relatório gerado</td>
                </tr>
                <tr>
                    <td>filename</td>
                    <td>Nome do arquivo HTML salvo na pasta 'reports/' do servidor</td>
                </tr>
                <tr>
                    <td>jsonFilename</td>
                    <td>Nome do arquivo JSON com todas as respostas da Clear Sale</td>
                </tr>
                <tr>
                    <td>cpfsProcessed</td>
                    <td>Número total de CPFs enviados na requisição</td>
                </tr>
                <tr>
                    <td>cpfsWithData</td>
                    <td>Número de CPFs que retornaram dados válidos</td>
                </tr>
                <tr>
                    <td>processingTime</td>
                    <td>Tempo total de processamento em segundos</td>
                </tr>
                <tr>
                    <td>successRate</td>
                    <td>Taxa de sucesso em porcentagem</td>
                </tr>
                <tr>
                    <td>timestamp</td>
                    <td>Data e hora de geração do relatório</td>
                </tr>
            </tbody>
        </table>

        <h3>Possíveis erros:</h3>
        <ul>
            <li><strong>400:</strong> Lista de CPFs inválida ou vazia</li>
            <li><strong>404:</strong> Nenhum dado encontrado para os CPFs</li>
            <li><strong>502:</strong> Erro na comunicação com Clear Sale</li>
            <li><strong>500:</strong> Erro interno do servidor</li>
        </ul>
    </div>

    <div class="section">
        <h2>💻 Exemplos Práticos</h2>
        
        <h3>JavaScript (Fetch API):</h3>
        <div class="code">const response = await fetch('http://localhost:3000/reports/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cpfs: ['11111111111', '222.222.222-22']
  })
});

const result = await response.json();
console.log('Arquivo gerado:', result.filename);</div>

        <h3>Python (Requests):</h3>
        <div class="code">import requests

response = requests.post(
    'http://localhost:3000/reports/generate', 
    json={'cpfs': ['11111111111', '222.222.222-22']}
)

if response.status_code == 200:
    data = response.json()
    with open(data['filename'], 'w', encoding='utf-8') as f:
        f.write(data['html'])
    print(f"Relatório salvo: {data['filename']}")
else:
    print(f"Erro: {response.status_code}")</div>
    </div>

    <div class="section">
        <h2>📊 O que tem no relatório gerado?</h2>
        
        <div class="info">
            <strong>🎨 Interface Visual:</strong><br>
            • Design moderno e responsivo<br>
            • Cores destacando scores altos/baixos<br>
            • Busca em tempo real<br>
            • Download CSV integrado<br>
            • <strong>Paginação inteligente:</strong> 10 registros por página<br>
            • Navegação otimizada para grandes volumes
        </div>

        <div class="info">
            <strong>📋 Dados por CPF:</strong><br>
            • <strong>Score v3:</strong> Pontuação de crédito<br>
            • <strong>Personas:</strong> Bancarizada, Presença Digital<br>
            • <strong>Perfil:</strong> Banco, Categoria do Cartão<br>
            • <strong>VA/VR:</strong> Flag de Vale Alimentação/Refeição<br>
            • <strong>Consumo:</strong> Potencial em 11 categorias diferentes
        </div>

        <div class="info">
            <strong>📁 Arquivos Gerados:</strong><br>
            • <strong>HTML:</strong> Relatório visual interativo com paginação<br>
            • <strong>JSON:</strong> Todas as respostas completas da Clear Sale<br>
            • Ambos salvos na pasta 'reports/' com mesmo nome<br>
            • Ideal para análise posterior e integração
        </div>
    </div>

    <div class="quick-links">
        <a href="/api" class="quick-link">
            <span class="icon">📚</span>
            <h3>Swagger API</h3>
            <p>Documentação interativa completa com teste de endpoints</p>
        </a>
        
        <div class="quick-link">
            <span class="icon">🚀</span>
            <h3>Endpoint Principal</h3>
            <p>POST /reports/generate - Gerar relatórios HTML</p>
        </div>
        
        <a href="https://github.com" class="quick-link">
            <span class="icon">💻</span>
            <h3>Exemplos de Código</h3>
            <p>Repositório com exemplos em várias linguagens</p>
        </a>
    </div>

    <div class="section">
        <h2>❓ Perguntas Frequentes</h2>
        
        <h3>🤔 Posso enviar CPFs com pontuação?</h3>
        <p><strong>Sim!</strong> A API aceita CPFs tanto com quanto sem pontuação.</p>

        <h3>📊 Quantos CPFs posso enviar por vez?</h3>
        <p>Não há limite definido, mas recomendamos <strong>até 50 CPFs</strong> por requisição para melhor performance.</p>

        <h3>⏱️ Quanto tempo demora para gerar o relatório?</h3>
        <p>Depende da quantidade de CPFs, mas geralmente <strong>1-3 segundos por CPF</strong>.</p>

        <h3>💾 Onde ficam salvos os arquivos?</h3>
        <p>Os arquivos HTML são salvos na pasta <code>reports/</code> do servidor com timestamp único.</p>

        <h3>🔒 Os dados são seguros?</h3>
        <p><strong>Sim!</strong> A API usa conexão segura com Clear Sale e não armazena dados pessoais permanentemente.</p>

        <h3>📱 Funciona em mobile?</h3>
        <p><strong>Perfeitamente!</strong> O HTML gerado é totalmente responsivo e funciona em qualquer dispositivo.</p>
    </div>

</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  }
}