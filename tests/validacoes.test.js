const { validarPosicao, validarValor, validarFormatoDaGrade } = require('../src/validacoes');
const { _, GRADE_VAZIA, SOLUCAO_VALIDA } = require('./helpers/grades');

function trocarCelula(grade, linha, coluna, novaCelula) {
  return grade.map((linhaAtual, indiceDaLinha) =>
    linhaAtual.map((celula, indiceDaColuna) =>
      indiceDaLinha === linha && indiceDaColuna === coluna ? novaCelula : celula,
    ),
  );
}

describe('validarPosicao', () => {
  test.each([
    [0, 0],
    [0, 5],
    [5, 0],
    [5, 5],
    [2, 3],
  ])('a posição (%i, %i) é aceita', (linha, coluna) => {
    expect(() => validarPosicao(linha, coluna)).not.toThrow();
  });

  test.each([
    ['texto', '1'],
    ['número fracionário', 1.5],
    ['NaN', NaN],
    ['null', null],
    ['undefined', undefined],
  ])('uma linha do tipo %s é recusada com TypeError', (_descricao, linha) => {
    expect(() => validarPosicao(linha, 0)).toThrow(new TypeError('A linha deve ser um número inteiro.'));
  });

  test.each([
    ['texto', '1'],
    ['número fracionário', 1.5],
  ])('uma coluna do tipo %s é recusada com TypeError', (_descricao, coluna) => {
    expect(() => validarPosicao(0, coluna)).toThrow(new TypeError('A coluna deve ser um número inteiro.'));
  });

  test.each([-1, 6, 100])('a linha %i fora do tabuleiro é recusada com RangeError', (linha) => {
    expect(() => validarPosicao(linha, 0)).toThrow(new RangeError('A linha deve estar entre 0 e 5.'));
  });

  test.each([-1, 6])('a coluna %i fora do tabuleiro é recusada com RangeError', (coluna) => {
    expect(() => validarPosicao(0, coluna)).toThrow(new RangeError('A coluna deve estar entre 0 e 5.'));
  });

  test('a linha é validada antes da coluna', () => {
    expect(() => validarPosicao(-1, 'x')).toThrow(new RangeError('A linha deve estar entre 0 e 5.'));
  });
});

describe('validarValor', () => {
  test.each([0, 1])('o valor %i é aceito', (valor) => {
    expect(() => validarValor(valor)).not.toThrow();
  });

  test.each([
    ['texto', '1'],
    ['null', null],
    ['undefined', undefined],
    ['booleano', true],
  ])('um valor do tipo %s é recusado com TypeError', (_descricao, valor) => {
    expect(() => validarValor(valor)).toThrow(new TypeError('O valor deve ser um número.'));
  });

  test.each([2, -1, 0.5, NaN])('o número %d diferente de 0 e 1 é recusado com RangeError', (valor) => {
    expect(() => validarValor(valor)).toThrow(new RangeError('O valor deve ser 0 ou 1.'));
  });
});

describe('validarFormatoDaGrade', () => {
  test.each([
    ['vazia', GRADE_VAZIA],
    ['completa', SOLUCAO_VALIDA],
  ])('uma grade 6 x 6 %s é aceita', (_descricao, grade) => {
    expect(() => validarFormatoDaGrade(grade)).not.toThrow();
  });

  test.each([
    ['texto', '000000'],
    ['null', null],
    ['objeto', { linhas: 6 }],
  ])('uma grade do tipo %s é recusada com TypeError', (_descricao, grade) => {
    expect(() => validarFormatoDaGrade(grade)).toThrow(new TypeError('A grade deve ser uma lista.'));
  });

  test.each([
    ['sem linhas', []],
    ['com 5 linhas', GRADE_VAZIA.slice(1)],
    ['com 7 linhas', [...GRADE_VAZIA, GRADE_VAZIA[0]]],
  ])('uma grade %s é recusada com RangeError', (_descricao, grade) => {
    expect(() => validarFormatoDaGrade(grade)).toThrow(new RangeError('A grade deve ter 6 posições.'));
  });

  test('uma linha que não é lista é recusada com TypeError', () => {
    const grade = [...GRADE_VAZIA.slice(0, 5), 'linha'];

    expect(() => validarFormatoDaGrade(grade)).toThrow(new TypeError('Cada linha da grade deve ser uma lista.'));
  });

  test.each([
    ['com 5 células', [_, _, _, _, _]],
    ['com 7 células', [_, _, _, _, _, _, _]],
  ])('uma linha %s é recusada com RangeError', (_descricao, linha) => {
    const grade = [linha, ...GRADE_VAZIA.slice(1)];

    expect(() => validarFormatoDaGrade(grade)).toThrow(new RangeError('Cada linha da grade deve ter 6 posições.'));
  });

  test.each([
    ['texto', '1'],
    ['undefined', undefined],
  ])('uma célula do tipo %s é recusada com TypeError', (_descricao, celula) => {
    const grade = trocarCelula(GRADE_VAZIA, 3, 4, celula);

    expect(() => validarFormatoDaGrade(grade)).toThrow(new TypeError('O valor deve ser um número.'));
  });

  test.each([2, -1])('uma célula com o número %i é recusada com RangeError', (celula) => {
    const grade = trocarCelula(SOLUCAO_VALIDA, 5, 5, celula);

    expect(() => validarFormatoDaGrade(grade)).toThrow(new RangeError('O valor deve ser 0 ou 1.'));
  });
});
