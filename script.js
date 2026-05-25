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
}

function calcularReserva() {
  const gastoMensal = parseFloat(document.getElementById('gastoMensal').value) || 0;
  const mesesReserva = parseInt(document.getElementById('mesesReserva').value) || 0;
  const valorGuardado = parseFloat(document.getElementById('valorGuardado').value) || 0;
  const aporteReserva = parseFloat(document.getElementById('aporteReserva').value) || 0;

  if (gastoMensal <= 0) {
    alert('Informe um gasto mensal válido.');
    return;
  }

  if (mesesReserva <= 0) {
    alert('Informe a quantidade de meses desejada para sua reserva.');
    return;
  }

  if (valorGuardado < 0) {
    alert('O valor já guardado não pode ser negativo.');
    return;
  }

  if (aporteReserva < 0) {
    alert('O aporte mensal não pode ser negativo.');
    return;
  }

  const reservaIdeal = gastoMensal * mesesReserva;
  const faltaGuardar = reservaIdeal - valorGuardado;
  const percentualAtual = reservaIdeal > 0 ? (valorGuardado / reservaIdeal) * 100 : 0;

  let mensagemTempo = '';

  if (faltaGuardar <= 0) {
    mensagemTempo = `
      <p>
        Parabéns! Com o valor informado, você já atingiu ou ultrapassou a reserva de emergência estimada.
      </p>
    `;
  } else if (aporteReserva > 0) {
    const mesesParaCompletar = Math.ceil(faltaGuardar / aporteReserva);
    const anosParaCompletar = Math.floor(mesesParaCompletar / 12);
    const mesesRestantes = mesesParaCompletar % 12;

    let textoTempo = '';

    if (anosParaCompletar > 0 && mesesRestantes > 0) {
      textoTempo = `${anosParaCompletar} ano(s) e ${mesesRestantes} mês(es)`;
    } else if (anosParaCompletar > 0) {
      textoTempo = `${anosParaCompletar} ano(s)`;
    } else {
      textoTempo = `${mesesParaCompletar} mês(es)`;
    }

    mensagemTempo = `
      <p>
        Guardando ${formatarMoeda(aporteReserva)} por mês, você levaria aproximadamente
        <strong>${textoTempo}</strong> para completar sua reserva.
      </p>
    `;
  } else {
    mensagemTempo = `
      <p>
        Para estimar o tempo necessário para completar sua reserva, informe quanto pretende guardar por mês.
      </p>
    `;
  }

  let classificacao = '';

  if (percentualAtual >= 100) {
    classificacao = 'Reserva completa';
  } else if (percentualAtual >= 75) {
    classificacao = 'Quase completa';
  } else if (percentualAtual >= 50) {
    classificacao = 'Em bom andamento';
  } else if (percentualAtual >= 25) {
    classificacao = 'Em construção';
  } else {
    classificacao = 'Início da construção';
  }

  const resultadoReserva = document.getElementById('resultadoReserva');
  resultadoReserva.style.display = 'block';

  resultadoReserva.innerHTML = `
    <h2>Resultado da reserva de emergência</h2>

    <p><strong>Reserva ideal:</strong> ${formatarMoeda(reservaIdeal)}</p>
    <p><strong>Valor já guardado:</strong> ${formatarMoeda(valorGuardado)}</p>
    <p><strong>Quanto falta guardar:</strong> ${formatarMoeda(Math.max(faltaGuardar, 0))}</p>
    <p><strong>Progresso atual:</strong> ${formatarPercentual(Math.min(percentualAtual, 100))}</p>
    <p><strong>Situação:</strong> ${classificacao}</p>

    <p>
      Considerando um gasto mensal de ${formatarMoeda(gastoMensal)} e uma proteção desejada de
      ${mesesReserva} mês(es), sua reserva de emergência ideal seria de aproximadamente
      <strong>${formatarMoeda(reservaIdeal)}</strong>.
    </p>

    ${mensagemTempo}
  `;
}

function calcularViverRenda() {
  const rendaDesejada = parseFloat(document.getElementById('rendaDesejada').value) || 0;
  const taxaRenda = parseFloat(document.getElementById('taxaRenda').value) || 0;
  const valorInvestidoRenda = parseFloat(document.getElementById('valorInvestidoRenda').value) || 0;
  const aporteMensalRenda = parseFloat(document.getElementById('aporteMensalRenda').value) || 0;

  if (rendaDesejada <= 0) {
    alert('Informe uma renda mensal desejada válida.');
    return;
  }

  if (taxaRenda <= 0) {
    alert('Informe uma taxa de rendimento mensal maior que zero.');
    return;
  }

  if (valorInvestidoRenda < 0) {
    alert('O valor já investido não pode ser negativo.');
    return;
  }

  if (aporteMensalRenda < 0) {
    alert('O aporte mensal não pode ser negativo.');
    return;
  }

  const taxaDecimal = taxaRenda / 100;
  const patrimonioNecessario = rendaDesejada / taxaDecimal;
  const faltaAcumular = patrimonioNecessario - valorInvestidoRenda;
  const rendaAtualEstimada = valorInvestidoRenda * taxaDecimal;
  const percentualMeta = patrimonioNecessario > 0 ? (valorInvestidoRenda / patrimonioNecessario) * 100 : 0;

  let mensagemTempo = '';

  if (faltaAcumular <= 0) {
    mensagemTempo = `
      <p>
        Parabéns! Com os valores informados, você já teria patrimônio suficiente para gerar
        a renda mensal desejada, considerando a taxa estimada.
      </p>
    `;
  } else if (aporteMensalRenda > 0) {
    let saldo = valorInvestidoRenda;
    let meses = 0;
    const limiteMeses = 1200;

    while (saldo < patrimonioNecessario && meses < limiteMeses) {
      saldo = saldo * (1 + taxaDecimal);
      saldo = saldo + aporteMensalRenda;
      meses++;
    }

    if (meses >= limiteMeses) {
      mensagemTempo = `
        <p>
          Com o aporte informado, o tempo estimado ficou muito longo. Considere aumentar o aporte mensal,
          reduzir a renda desejada ou revisar a taxa de rendimento utilizada.
        </p>
      `;
    } else {
      const anos = Math.floor(meses / 12);
      const mesesRestantes = meses % 12;

      let textoTempo = '';

      if (anos > 0 && mesesRestantes > 0) {
        textoTempo = `${anos} ano(s) e ${mesesRestantes} mês(es)`;
      } else if (anos > 0) {
        textoTempo = `${anos} ano(s)`;
      } else {
        textoTempo = `${meses} mês(es)`;
      }

      mensagemTempo = `
        <p>
          Investindo ${formatarMoeda(aporteMensalRenda)} por mês, o tempo aproximado para atingir
          esse patrimônio seria de <strong>${textoTempo}</strong>, considerando a taxa informada.
        </p>
      `;
    }
  } else {
    mensagemTempo = `
      <p>
        Para estimar o tempo necessário para alcançar esse patrimônio, informe quanto pretende investir por mês.
      </p>
    `;
  }

  let classificacao = '';

  if (percentualMeta >= 100) {
    classificacao = 'Meta alcançada';
  } else if (percentualMeta >= 75) {
    classificacao = 'Muito próximo da meta';
  } else if (percentualMeta >= 50) {
    classificacao = 'Mais da metade do caminho';
  } else if (percentualMeta >= 25) {
    classificacao = 'Meta em construção';
  } else {
    classificacao = 'Início da jornada';
  }

  const resultadoViverRenda = document.getElementById('resultadoViverRenda');
  resultadoViverRenda.style.display = 'block';

  resultadoViverRenda.innerHTML = `
    <h2>Resultado da simulação</h2>

    <p><strong>Patrimônio necessário:</strong> ${formatarMoeda(patrimonioNecessario)}</p>
    <p><strong>Valor já investido:</strong> ${formatarMoeda(valorInvestidoRenda)}</p>
    <p><strong>Quanto falta acumular:</strong> ${formatarMoeda(Math.max(faltaAcumular, 0))}</p>
    <p><strong>Renda atual estimada:</strong> ${formatarMoeda(rendaAtualEstimada)} por mês</p>
    <p><strong>Progresso da meta:</strong> ${formatarPercentual(Math.min(percentualMeta, 100))}</p>
    <p><strong>Situação:</strong> ${classificacao}</p>

    <p>
      Para gerar uma renda mensal estimada de ${formatarMoeda(rendaDesejada)}, considerando uma taxa
      de rendimento mensal de ${formatarPercentual(taxaRenda)}, seria necessário acumular aproximadamente
      <strong>${formatarMoeda(patrimonioNecessario)}</strong>.
    </p>

    ${mensagemTempo}
  `;
}