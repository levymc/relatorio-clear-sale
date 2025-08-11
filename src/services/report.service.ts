import { Injectable } from '@nestjs/common';
import { CreditScoreData, ReportResponse } from '../interfaces/clear-sale.interfaces';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ReportService {
  
  generateHtml(data: CreditScoreData[]): string {
    const formatCPF = (cpf: string) => {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.***.***-$4');
    };

    const getScoreClass = (value: string | null, isConsumption = false) => {
      if (!value) return '';
      const num = parseInt(value);
      if (isConsumption) {
        if (num >= 70) return 'score-high';
        if (num >= 40) return 'score-medium';
        return 'score-low';
      } else {
        if (num >= 500) return 'score-high';
        if (num >= 200) return 'score-medium';
        return 'score-low';
      }
    };

    const tableRows = data.map(row => `
      <tr>
        <td><div class="document-id">${row.id.substring(0, 8)}...</div></td>
        <td><div class="cpf">${formatCPF(row.document)}</div></td>
        <td class="${getScoreClass(row.scoreV3)}">${row.scoreV3}</td>
        <td>${row.personaBancarizada || '-'}</td>
        <td>${row.personaPresencaDigital || '-'}</td>
        <td>${row.personaBanco || '-'}</td>
        <td>${row.personaCategoriaCartao || '-'}</td>
        <td>${row.flagVAVR || '-'}</td>
        <td class="${row.consumoGeral ? getScoreClass(row.consumoGeral, true) : ''}">${row.consumoGeral || '-'}</td>
        <td class="${row.magazine ? getScoreClass(row.magazine, true) : ''}">${row.magazine || '-'}</td>
        <td class="${row.delivery ? getScoreClass(row.delivery, true) : ''}">${row.delivery || '-'}</td>
        <td class="${row.vestuario ? getScoreClass(row.vestuario, true) : ''}">${row.vestuario || '-'}</td>
        <td class="${row.esportes ? getScoreClass(row.esportes, true) : ''}">${row.esportes || '-'}</td>
        <td class="${row.farmacia ? getScoreClass(row.farmacia, true) : ''}">${row.farmacia || '-'}</td>
        <td class="${row.casa ? getScoreClass(row.casa, true) : ''}">${row.casa || '-'}</td>
        <td class="${row.cosmeticos ? getScoreClass(row.cosmeticos, true) : ''}">${row.cosmeticos || '-'}</td>
        <td class="${row.eletronicos ? getScoreClass(row.eletronicos, true) : ''}">${row.eletronicos || '-'}</td>
        <td class="${row.mercados ? getScoreClass(row.mercados, true) : ''}">${row.mercados || '-'}</td>
        <td class="${row.pets ? getScoreClass(row.pets, true) : ''}">${row.pets || '-'}</td>
        <td class="${row.lazer ? getScoreClass(row.lazer, true) : ''}">${row.lazer || '-'}</td>
      </tr>
    `).join('');

    const dataJson = JSON.stringify(data, null, 12);

    return `<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Análise dos Scores por Documento</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }

        .container {
            max-width: 100%;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 2.5rem;
            font-weight: 300;
        }

        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 1.1rem;
        }

        .stats {
            display: flex;
            justify-content: space-around;
            background: #f8f9fa;
            padding: 20px;
            border-bottom: 1px solid #e9ecef;
        }

        .stat {
            text-align: center;
        }

        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #667eea;
            display: block;
        }

        .stat-label {
            color: #6c757d;
            font-size: 0.9rem;
            margin-top: 5px;
        }

        .controls {
            padding: 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            gap: 20px;
            align-items: center;
            flex-wrap: wrap;
        }

        .search-box {
            flex: 1;
            min-width: 300px;
            padding: 12px;
            border: 2px solid #e9ecef;
            border-radius: 6px;
            font-size: 16px;
            transition: border-color 0.3s;
        }

        .search-box:focus {
            outline: none;
            border-color: #667eea;
        }

        .download-btn {
            background: #28a745;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            transition: all 0.3s;
        }

        .download-btn:hover {
            background: #218838;
            transform: translateY(-2px);
        }

        .table-container {
            overflow-x: auto;
            max-height: 600px;
            overflow-y: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
        }

        th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 12px;
            text-align: left;
            font-weight: 600;
            position: sticky;
            top: 0;
            z-index: 10;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        th.id-col {
            min-width: 80px;
        }

        th.document-col {
            min-width: 120px;
        }

        th.score-col {
            min-width: 80px;
        }

        th.persona-col {
            min-width: 100px;
        }

        th.consumption-col {
            min-width: 120px;
        }

        td {
            padding: 12px;
            border-bottom: 1px solid #e9ecef;
            transition: background-color 0.2s;
        }

        tr:hover {
            background-color: #f8f9fa;
        }

        .score-high {
            background: linear-gradient(135deg, #d4edda, #c3e6cb);
            color: #155724;
            font-weight: bold;
        }

        .score-medium {
            background: linear-gradient(135deg, #fff3cd, #ffeaa7);
            color: #856404;
            font-weight: bold;
        }

        .score-low {
            background: linear-gradient(135deg, #f8d7da, #f5c6cb);
            color: #721c24;
            font-weight: bold;
        }

        .document-id {
            font-family: 'Courier New', monospace;
            background: #f8f9fa;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.9rem;
        }

        .cpf {
            font-family: 'Courier New', monospace;
            font-weight: bold;
            color: #495057;
        }

        .timestamp {
            font-size: 0.8rem;
            color: #6c757d;
        }

        .no-results {
            text-align: center;
            padding: 50px;
            color: #6c757d;
            font-size: 1.2rem;
        }

        @media (max-width: 768px) {
            .controls {
                flex-direction: column;
                gap: 10px;
            }

            .search-box {
                min-width: auto;
                width: 100%;
            }

            .stats {
                flex-direction: column;
                gap: 20px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>📊 Análise Credit Pro</h1>
            <p>Scores e Potenciais de Consumo por Cliente - Gerado em ${new Date().toLocaleString('pt-BR')}</p>
        </div>

        <div class="stats">
            <div class="stat">
                <span class="stat-number" id="total-records">${data.length}</span>
                <div class="stat-label">Total de Registros</div>
            </div>
            <div class="stat">
                <span class="stat-number" id="visible-records">${data.length}</span>
                <div class="stat-label">Registros Visíveis</div>
            </div>
            <div class="stat">
                <span class="stat-number">20</span>
                <div class="stat-label">Campos por Registro</div>
            </div>
        </div>

        <div class="controls">
            <input type="text" class="search-box" id="searchBox"
                placeholder="🔍 Pesquisar por ID, CPF ou qualquer valor...">
            <button class="download-btn" onclick="downloadCSV()">📥 Baixar CSV</button>
        </div>

        <div class="table-container">
            <table id="dataTable">
                <thead>
                    <tr>
                        <th class="id-col">ID</th>
                        <th class="document-col">CPF</th>
                        <th class="score-col">Score v3</th>
                        <th class="persona-col">Persona Bancarizada</th>
                        <th class="persona-col">Presença Digital</th>
                        <th class="persona-col">Banco</th>
                        <th class="persona-col">Cat. Cartão</th>
                        <th class="score-col">VA/VR</th>
                        <th class="consumption-col">Consumo Geral</th>
                        <th class="consumption-col">Magazine</th>
                        <th class="consumption-col">Delivery</th>
                        <th class="consumption-col">Vestuário</th>
                        <th class="consumption-col">Esportes</th>
                        <th class="consumption-col">Farmácia</th>
                        <th class="consumption-col">Casa</th>
                        <th class="consumption-col">Cosméticos</th>
                        <th class="consumption-col">Eletrônicos</th>
                        <th class="consumption-col">Mercados</th>
                        <th class="consumption-col">Pets</th>
                        <th class="consumption-col">Lazer</th>
                    </tr>
                </thead>
                <tbody id="tableBody">
                    ${tableRows}
                </tbody>
            </table>
        </div>
    </div>

    <script>
        const data = ${dataJson};

        let filteredData = [...data];

        function formatCPF(cpf) {
            return cpf.replace(/(\\d{3})(\\d{3})(\\d{3})(\\d{2})/, '$1.***.***-$4');
        }

        function getScoreClass(value, isConsumption = false) {
            const num = parseInt(value);
            if (isConsumption) {
                if (num >= 70) return 'score-high';
                if (num >= 40) return 'score-medium';
                return 'score-low';
            } else {
                if (num >= 500) return 'score-high';
                if (num >= 200) return 'score-medium';
                return 'score-low';
            }
        }

        function renderTable() {
            const tbody = document.getElementById('tableBody');
            tbody.innerHTML = '';

            if (filteredData.length === 0) {
                tbody.innerHTML = '<tr><td colspan="20" class="no-results">🔍 Nenhum resultado encontrado</td></tr>';
                return;
            }

            filteredData.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = \`
        <td><div class="document-id">\${row.id.substring(0, 8)}...</div></td>
        <td><div class="cpf">\${formatCPF(row.document)}</div></td>
        <td class="\${getScoreClass(row.scoreV3)}">\${row.scoreV3}</td>
        <td>\${row.personaBancarizada || '-'}</td>
        <td>\${row.personaPresencaDigital || '-'}</td>
        <td>\${row.personaBanco || '-'}</td>
        <td>\${row.personaCategoriaCartao || '-'}</td>
        <td>\${row.flagVAVR || '-'}</td>
        <td class="\${row.consumoGeral ? getScoreClass(row.consumoGeral, true) : ''}">\${row.consumoGeral || '-'}</td>
        <td class="\${row.magazine ? getScoreClass(row.magazine, true) : ''}">\${row.magazine || '-'}</td>
        <td class="\${row.delivery ? getScoreClass(row.delivery, true) : ''}">\${row.delivery || '-'}</td>
        <td class="\${row.vestuario ? getScoreClass(row.vestuario, true) : ''}">\${row.vestuario || '-'}</td>
        <td class="\${row.esportes ? getScoreClass(row.esportes, true) : ''}">\${row.esportes || '-'}</td>
        <td class="\${row.farmacia ? getScoreClass(row.farmacia, true) : ''}">\${row.farmacia || '-'}</td>
        <td class="\${row.casa ? getScoreClass(row.casa, true) : ''}">\${row.casa || '-'}</td>
        <td class="\${row.cosmeticos ? getScoreClass(row.cosmeticos, true) : ''}">\${row.cosmeticos || '-'}</td>
        <td class="\${row.eletronicos ? getScoreClass(row.eletronicos, true) : ''}">\${row.eletronicos || '-'}</td>
        <td class="\${row.mercados ? getScoreClass(row.mercados, true) : ''}">\${row.mercados || '-'}</td>
        <td class="\${row.pets ? getScoreClass(row.pets, true) : ''}">\${row.pets || '-'}</td>
        <td class="\${row.lazer ? getScoreClass(row.lazer, true) : ''}">\${row.lazer || '-'}</td>
    \`;
                tbody.appendChild(tr);
            });

            document.getElementById('visible-records').textContent = filteredData.length;
        }

        function filterData() {
            const searchTerm = document.getElementById('searchBox').value.toLowerCase();

            if (!searchTerm) {
                filteredData = [...data];
            } else {
                filteredData = data.filter(row => {
                    return Object.values(row).some(value =>
                        value && value.toString().toLowerCase().includes(searchTerm)
                    );
                });
            }

            renderTable();
        }

        function downloadCSV() {
            try {
                const headers = [
                    'id', 'document', 'scoreV3', 'personaBancarizada', 'personaPresencaDigital',
                    'personaBanco', 'personaCategoriaCartao', 'flagVAVR', 'consumoGeral',
                    'magazine', 'delivery', 'vestuario', 'esportes', 'farmacia', 'casa',
                    'cosmeticos', 'eletronicos', 'mercados', 'pets', 'lazer'
                ];

                let csvContent = headers.join(',') + '\\n';

                data.forEach(row => {
                    const rowData = [
                        row.id,
                        row.document,
                        row.scoreV3,
                        row.personaBancarizada,
                        row.personaPresencaDigital,
                        \`"\${row.personaBanco}"\`,
                        row.personaCategoriaCartao,
                        row.flagVAVR,
                        row.consumoGeral,
                        row.magazine,
                        row.delivery,
                        row.vestuario,
                        row.esportes,
                        row.farmacia,
                        row.casa,
                        row.cosmeticos,
                        row.eletronicos,
                        row.mercados,
                        row.pets,
                        row.lazer
                    ];
                    csvContent += rowData.join(',') + '\\n';
                });

                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');

                link.href = url;
                link.download = \`credit_pro_scores_\${new Date().toISOString().split('T')[0]}.csv\`;
                link.click();

                window.URL.revokeObjectURL(url);

                const btn = document.querySelector('.download-btn');
                const originalText = btn.textContent;
                btn.textContent = '✅ Download Iniciado!';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 2000);

            } catch (error) {
                console.error('Erro ao baixar CSV:', error);
                alert('Erro ao gerar o arquivo CSV. Tente novamente.');
            }
        }

        document.getElementById('searchBox').addEventListener('input', filterData);
        renderTable();
    </script>
</body>

</html>`;
  }

  async saveHtmlReport(html: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `relatorio-credit-pro-${timestamp}.html`;
    const filepath = path.join(process.cwd(), 'reports', filename);

    if (!fs.existsSync(path.dirname(filepath))) {
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
    }

    fs.writeFileSync(filepath, html, 'utf8');
    
    return filename;
  }

  async generateReport(cpfData: CreditScoreData[]): Promise<ReportResponse> {
    const html = this.generateHtml(cpfData);
    const filename = await this.saveHtmlReport(html);
    
    return {
      html,
      filename,
      cpfsProcessed: cpfData.length,
      cpfsWithData: cpfData.length
    };
  }
}