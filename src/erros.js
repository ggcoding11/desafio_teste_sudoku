const { QUANTIDADE_DE_CADA_VALOR_POR_LINHA } = require('./constantes');

class ErroDeRegra extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'ErroDeRegra';
  }
}

const MENSAGENS_DE_REGRA = Object.freeze({
  VALORES_IGUAIS_SEGUIDOS: 'Não pode haver três valores iguais seguidos na mesma linha ou coluna.',
  EXCESSO_DE_UM_VALOR: `Uma linha ou coluna não pode ter mais de ${QUANTIDADE_DE_CADA_VALOR_POR_LINHA} valores iguais.`,
  LINHAS_REPETIDAS: 'Não pode haver duas linhas completas iguais.',
  COLUNAS_REPETIDAS: 'Não pode haver duas colunas completas iguais.',
  CELULA_FIXA: 'As células iniciais do quebra-cabeça não podem ser alteradas.',
  CELULA_JA_VAZIA: 'A célula já está vazia.',
  PARTIDA_ENCERRADA: 'A partida já terminou.',
});

module.exports = { ErroDeRegra, MENSAGENS_DE_REGRA };
