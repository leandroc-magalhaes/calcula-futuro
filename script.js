function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function formatarPercentual(valor) {
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + '%';
}

function calcularJuros() {
  const valorInicial = parseFloat(document.getElementById('valorInicial').value) || 0;
  const aporteMensal = parseFloat(document.getElementById('aporteMensal').value) || 0;
  const taxaInformada = parseFloat(document.getElementById('taxa').value) || 0;
  const tipoTaxa = document.getElementById('tipoTaxa').value;
  const periodoInformado = parseInt(document.getElementById('periodo').value) || 0;
  const tipoPeriodo = document.getElementById('tipoPeriodo').value;

  if (valorInicial === 0 && aporteMensal === 0) {
    alert('Informe um valor inicial ou um aporte mensal.');
    return;
  }

  if (taxaInformada < 0) {
    alert('A taxa de rendimento não pode ser negativa.');
    return;
  }

  if (periodoInformado <= 0) {
    alert('Informe um período válido.');
    return;
  }

  let meses = periodoInformado;

  if (tipoPeriodo === 'anos') {
    meses = periodoInformado * 12;
  }

  let taxaMensal = taxaInformada / 100;

  if (tipoTaxa === 'anual') {
    taxaMensal = Math.pow(1 + taxaInformada / 100, 1 / 12) - 1;
  }

  let saldo = valorInicial;
  let totalInvestido = valorInicial;
  let linhasTabela = '';

  for (let mes = 1; mes <= meses; mes++) {
    saldo = saldo * (1 + taxaMensal);
    saldo = saldo + aporteMensal;
    totalInvestido = totalInvestido + aporteMensal;

    if (mes % 12 === 0 || mes === meses) {
      const ano = Math.ceil(mes / 12);

      linhasTabela += `
        <tr>
          <td>${mes}</td>
          <td>${ano}</td>
          <td>${formatarMoeda(totalInvestido)}</td>
          <td>${formatarMoeda(saldo)}</td>
        </tr>
      `;
    }
  }

  const jurosGanhos = saldo - totalInvestido;
  const percentualJuros = totalInvestido > 0 ? (jurosGanhos / totalInvestido) * 100 : 0;

  const resultado = document.getElementById('resultado');
  resultado.style.display = 'block';

  resultado.innerHTML = `
    <h2>Resultado da simulação</h2>

    <p><strong>Valor final estimado:</strong> ${formatarMoeda(saldo)}</p>
    <p><strong>Total investido:</strong> ${formatarMoeda(totalInvestido)}</p>
    <p><strong>Juros acumulados:</strong> ${formatarMoeda(jurosGanhos)}</p>
    <p><strong>Taxa mensal equivalente:</strong> ${formatarPercentual(taxaMensal * 100)}</p>

    <p>
      Começando com ${formatarMoeda(valorInicial)} e investindo ${formatarMoeda(aporteMensal)}
      por mês durante ${meses} meses, com taxa mensal equivalente de
      ${formatarPercentual(taxaMensal * 100)}, você teria aproximadamente
      <strong>${formatarMoeda(saldo)}</strong>.
    </p>

    <p>
      Nesse cenário, o valor total aplicado por você seria de
      <strong>${formatarMoeda(totalInvestido)}</strong> e os juros estimados seriam de
      <strong>${formatarMoeda(jurosGanhos)}</strong>, equivalentes a aproximadamente
      <strong>${formatarPercentual(percentualJuros)}</strong> sobre o total investido.
    </p>
  `;

  document.getElementById('tabela').innerHTML = `
    <h2>Evolução da simulação</h2>
    <p>A tabela abaixo mostra a evolução do saldo ao final de cada ano, ou no último mês da simulação.</p>

    <table>
      <thead>
        <tr>
          <th>Mês</th>
          <th>Ano</th>
          <th>Total investido</th>
          <th>Saldo acumulado</th>
        </tr>
      </thead>
      <tbody>
        ${linhasTabela}
      </tbody>
    </table>
  `;
}/