const { CELULA_VAZIA, TAMANHO_DO_TABULEIRO, VALORES } = require('./constantes');

const ULTIMO_INDICE = TAMANHO_DO_TABULEIRO - 1;

function validarIndice(indice, nomeDoIndice) {
  if (!Number.isInteger(indice)) {
    throw new TypeError(`A ${nomeDoIndice} deve ser um número inteiro.`);
  }
  if (indice < 0 || indice > ULTIMO_INDICE) {
    throw new RangeError(`A ${nomeDoIndice} deve estar entre 0 e ${ULTIMO_INDICE}.`);
  }
}

function validarPosicao(linha, coluna) {
  validarIndice(linha, 'linha');
  validarIndice(coluna, 'coluna');
}

function validarValor(valor) {
  if (typeof valor !== 'number') {
    throw new TypeError('O valor deve ser um número.');
  }
  if (!Object.values(VALORES).includes(valor)) {
    throw new RangeError('O valor deve ser 0 ou 1.');
  }
}

function validarListaComTamanhoDoTabuleiro(lista, descricao) {
  if (!Array.isArray(lista)) {
    throw new TypeError(`${descricao} deve ser uma lista.`);
  }
  if (lista.length !== TAMANHO_DO_TABULEIRO) {
    throw new RangeError(`${descricao} deve ter ${TAMANHO_DO_TABULEIRO} posições.`);
  }
}

function validarFormatoDaGrade(grade) {
  validarListaComTamanhoDoTabuleiro(grade, 'A grade');

  grade.forEach((linha) => {
    validarListaComTamanhoDoTabuleiro(linha, 'Cada linha da grade');
    linha.forEach((celula) => {
      if (celula !== CELULA_VAZIA) {
        validarValor(celula);
      }
    });
  });
}

module.exports = { validarPosicao, validarValor, validarFormatoDaGrade };
