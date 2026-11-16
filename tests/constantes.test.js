const {
  TAMANHO_DO_TABULEIRO,
  QUANTIDADE_DE_CADA_VALOR_POR_LINHA,
  MAXIMO_DE_VALORES_IGUAIS_SEGUIDOS,
  CELULA_VAZIA,
  VALORES,
  ESTADOS_DA_PARTIDA,
} = require('../src/constantes');

describe('constantes do Sudoku binário', () => {
  test('o tabuleiro é 6 x 6', () => {
    expect(TAMANHO_DO_TABULEIRO).toBe(6);
  });

  test('cada linha e coluna leva metade de zeros e metade de uns', () => {
    expect(QUANTIDADE_DE_CADA_VALOR_POR_LINHA).toBe(3);
  });

  test('no máximo dois valores iguais podem ficar seguidos', () => {
    expect(MAXIMO_DE_VALORES_IGUAIS_SEGUIDOS).toBe(2);
  });

  test('a célula vazia é representada por null', () => {
    expect(CELULA_VAZIA).toBeNull();
  });

  test('os únicos valores do jogo são 0 e 1', () => {
    expect(Object.values(VALORES)).toEqual([0, 1]);
  });

  test('a partida só pode estar em andamento ou vencida', () => {
    expect(Object.values(ESTADOS_DA_PARTIDA)).toEqual(['EM_ANDAMENTO', 'VENCIDA']);
  });

  test.each([
    ['VALORES', VALORES],
    ['ESTADOS_DA_PARTIDA', ESTADOS_DA_PARTIDA],
  ])('a enumeração %s é congelada', (_nome, enumeracao) => {
    expect(Object.isFrozen(enumeracao)).toBe(true);
  });
});
