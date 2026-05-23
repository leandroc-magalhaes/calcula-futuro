function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function calcularJuros() {
  const valorInicial = parseFloat(document.getElementById('valorInicial').value) || 0;
  const aporteMensal = parseFloat(document.getElementById('aporteMensal').value) || 0;
  const taxa = parseFloat(document.getElementById('taxa').value) || 0;
  const periodo = parseInt(document.getElementById('periodo').value) || 0;

  if (periodo <= 0) {
    alert('Informe um período válido em meses.');
    return;
  }

  const taxaDecimal = taxa / 100;
  let saldo = valorInicial;
  let totalInvestido = valorInicial;
  let linhasTabela = '';

  for (let mes = 1; mes <= periodo; mes++) {
    saldo = saldo * (1 + taxaDecimal);
    saldo = saldo + aporteMensal;
    totalInvestido = totalInvestido + aporteMensal;

    linhasTabela += `
      <tr>
        <td>${mes}</td>
        <td>${formatarMoeda(totalInvestido)}</td>
        <td>${formatarMoeda(saldo)}</td>
      </tr>
    `;
  }

  const jurosGanhos = saldo - totalInvestido;

  const resultado = document.getElementById('resultado');
  resultado.style.display = 'block';

  resultado.innerHTML = `
    <h2>Resultado da simulação</h2>
    <p><strong>Valor final:</strong> ${formatarMoeda(saldo)}</p>
    <p><strong>Total investido:</strong> ${formatarMoeda(totalInvestido)}</p>
    <p><strong>Juros acumulados:</strong> ${formatarMoeda(jurosGanhos)}</p>
    <p>
      Investindo ${formatarMoeda(aporteMensal)} por mês durante ${periodo} meses,
      com taxa mensal de ${taxa}%, você teria aproximadamente
      <strong>${formatarMoeda(saldo)}</strong>.
    </p>
  `;

  document.getElementById('tabela').innerHTML = `
    <h2>Evolução mês a mês</h2>
    <table>
      <thead>
        <tr>
          <th>Mês</th>
          <th>Total investido</th>
          <th>Saldo acumulado</th>
        </tr>
      </thead>
      <tbody>
        ${linhasTabela}
      </tbody>
    </table>
  `;
}