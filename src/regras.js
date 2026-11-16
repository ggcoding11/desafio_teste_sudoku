const {
  CELULA_VAZIA,
  MAXIMO_DE_VALORES_IGUAIS_SEGUIDOS,
  QUANTIDADE_DE_CADA_VALOR_POR_LINHA,
  VALORES,
} = require('./constantes');
const { MENSAGENS_DE_REGRA } = require('./erros');

function extrairColunas(grade) {
  return grade[0].map((_celula, indiceDaColuna) => grade.map((linha) => linha[indiceDaColuna]));
}

function possuiValoresIguaisDemaisSeguidos(sequencia) {
  const tamanhoDoTrechoProibido = MAXIMO_DE_VALORES_IGUAIS_SEGUIDOS + 1;

  for (let inicio = 0; inicio + tamanhoDoTrechoProibido <= sequencia.length; inicio++) {
    const trecho = sequencia.slice(inicio, inicio + tamanhoDoTrechoProibido);
    const primeiroValor = trecho[0];

    if (primeiroValor !== CELULA_VAZIA && trecho.every((celula) => celula === primeiroValor)) {
      return true;
    }
  }

  return false;
}

function excedeQuantidadeDeAlgumValor(sequencia) {
  return Object.values(VALORES).some(
    (valor) => sequencia.filter((celula) => celula === valor).length > QUANTIDADE_DE_CADA_VALOR_POR_LINHA,
  );
}

function estaCompleta(sequencia) {
  return !sequencia.includes(CELULA_VAZIA);
}

function possuiSequenciasCompletasRepetidas(sequencias) {
  const sequenciasCompletas = sequencias.filter(estaCompleta).map((sequencia) => sequencia.join(''));

  return new Set(sequenciasCompletas).size !== sequenciasCompletas.length;
}

function encontrarViolacao(grade) {
  const linhas = grade;
  const colunas = extrairColunas(grade);
  const linhasEColunas = [...linhas, ...colunas];

  if (linhasEColunas.some(possuiValoresIguaisDemaisSeguidos)) {
    return MENSAGENS_DE_REGRA.VALORES_IGUAIS_SEGUIDOS;
  }
  if (linhasEColunas.some(excedeQuantidadeDeAlgumValor)) {
    return MENSAGENS_DE_REGRA.EXCESSO_DE_UM_VALOR;
  }
  if (possuiSequenciasCompletasRepetidas(linhas)) {
    return MENSAGENS_DE_REGRA.LINHAS_REPETIDAS;
  }
  if (possuiSequenciasCompletasRepetidas(colunas)) {
    return MENSAGENS_DE_REGRA.COLUNAS_REPETIDAS;
  }
  return null;
}

module.exports = { encontrarViolacao, estaCompleta };
