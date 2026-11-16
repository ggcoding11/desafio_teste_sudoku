const { CELULA_VAZIA } = require('./constantes');
const { ErroDeRegra, MENSAGENS_DE_REGRA } = require('./erros');
const { encontrarViolacao, estaCompleta } = require('./regras');
const { validarFormatoDaGrade, validarPosicao, validarValor } = require('./validacoes');

function copiarGrade(grade) {
  return grade.map((linha) => [...linha]);
}

class Tabuleiro {
  #celulas;
  #celulasFixas;

  constructor(gradeInicial) {
    validarFormatoDaGrade(gradeInicial);
    const celulas = copiarGrade(gradeInicial);
    const violacao = encontrarViolacao(celulas);
    if (violacao !== null) {
      throw new RangeError(`A grade inicial viola as regras: ${violacao}`);
    }

    this.#celulas = celulas;
    this.#celulasFixas = celulas.map((linha) => linha.map((celula) => celula !== CELULA_VAZIA));
  }

  get grade() {
    return copiarGrade(this.#celulas);
  }

  eCelulaFixa(linha, coluna) {
    validarPosicao(linha, coluna);
    return this.#celulasFixas[linha][coluna];
  }

  estaCheio() {
    return this.#celulas.every(estaCompleta);
  }

  preencher(linha, coluna, valor) {
    validarPosicao(linha, coluna);
    validarValor(valor);
    this.#garantirQueNaoEFixa(linha, coluna);

    const gradeCandidata = copiarGrade(this.#celulas);
    gradeCandidata[linha][coluna] = valor;
    const violacao = encontrarViolacao(gradeCandidata);
    if (violacao !== null) {
      throw new ErroDeRegra(violacao);
    }

    this.#celulas = gradeCandidata;
  }

  apagar(linha, coluna) {
    validarPosicao(linha, coluna);
    this.#garantirQueNaoEFixa(linha, coluna);
    if (this.#celulas[linha][coluna] === CELULA_VAZIA) {
      throw new ErroDeRegra(MENSAGENS_DE_REGRA.CELULA_JA_VAZIA);
    }

    this.#celulas[linha][coluna] = CELULA_VAZIA;
  }

  #garantirQueNaoEFixa(linha, coluna) {
    if (this.#celulasFixas[linha][coluna]) {
      throw new ErroDeRegra(MENSAGENS_DE_REGRA.CELULA_FIXA);
    }
  }
}

module.exports = { Tabuleiro };
