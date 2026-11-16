const { ESTADOS_DA_PARTIDA } = require('./constantes');
const { ErroDeRegra, MENSAGENS_DE_REGRA } = require('./erros');
const { CATALOGO_DE_QUEBRA_CABECAS } = require('./catalogo');
const { sortearQuebraCabeca } = require('./sorteio');
const { Tabuleiro } = require('./tabuleiro');
const { validarPosicao, validarValor } = require('./validacoes');

function sortearDoCatalogo() {
  return sortearQuebraCabeca(CATALOGO_DE_QUEBRA_CABECAS);
}

class Partida {
  #tabuleiro;
  #estado = ESTADOS_DA_PARTIDA.EM_ANDAMENTO;

  constructor(prepararQuebraCabeca = sortearDoCatalogo) {
    if (typeof prepararQuebraCabeca !== 'function') {
      throw new TypeError('prepararQuebraCabeca deve ser uma função.');
    }

    const tabuleiro = new Tabuleiro(prepararQuebraCabeca());
    if (tabuleiro.estaCheio()) {
      throw new RangeError('O quebra-cabeça precisa ter ao menos uma célula vazia.');
    }

    this.#tabuleiro = tabuleiro;
  }

  get estado() {
    return this.#estado;
  }

  get grade() {
    return this.#tabuleiro.grade;
  }

  eCelulaFixa(linha, coluna) {
    return this.#tabuleiro.eCelulaFixa(linha, coluna);
  }

  jogar(linha, coluna, valor) {
    validarPosicao(linha, coluna);
    validarValor(valor);
    this.#garantirQueEstaEmAndamento();

    this.#tabuleiro.preencher(linha, coluna, valor);
    if (this.#tabuleiro.estaCheio()) {
      this.#estado = ESTADOS_DA_PARTIDA.VENCIDA;
    }
  }

  apagar(linha, coluna) {
    validarPosicao(linha, coluna);
    this.#garantirQueEstaEmAndamento();

    this.#tabuleiro.apagar(linha, coluna);
  }

  #garantirQueEstaEmAndamento() {
    if (this.#estado !== ESTADOS_DA_PARTIDA.EM_ANDAMENTO) {
      throw new ErroDeRegra(MENSAGENS_DE_REGRA.PARTIDA_ENCERRADA);
    }
  }
}

module.exports = { Partida };
