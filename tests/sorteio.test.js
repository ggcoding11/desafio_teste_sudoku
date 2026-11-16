const { sortearQuebraCabeca } = require('../src/sorteio');
const { CATALOGO_DE_QUEBRA_CABECAS } = require('../src/catalogo');
const {
  GERADOR_QUE_SEMPRE_ESCOLHE_O_PRIMEIRO,
  GERADOR_QUE_SEMPRE_ESCOLHE_O_ULTIMO,
  criarGeradorQueRepeteASequencia,
} = require('./helpers/geradores');

const CATALOGO_DE_TESTE = Object.freeze(['primeiro', 'segundo', 'terceiro']);
const SEQUENCIA_DE_NUMEROS_ALEATORIOS = Object.freeze([0.5, 0.1, 0.9, 0.4]);

describe('sortearQuebraCabeca com gerador injetado', () => {
  test('um gerador que devolve 0 escolhe o primeiro item', () => {
    expect(sortearQuebraCabeca(CATALOGO_DE_TESTE, GERADOR_QUE_SEMPRE_ESCOLHE_O_PRIMEIRO)).toBe('primeiro');
  });

  test('um gerador que devolve o maior número abaixo de 1 escolhe o último item', () => {
    expect(sortearQuebraCabeca(CATALOGO_DE_TESTE, GERADOR_QUE_SEMPRE_ESCOLHE_O_ULTIMO)).toBe('terceiro');
  });

  test.each([
    [0.33, 'primeiro'],
    [0.34, 'segundo'],
    [0.66, 'segundo'],
    [0.67, 'terceiro'],
  ])('o número %d escolhe o item %s', (numeroAleatorio, itemEsperado) => {
    expect(sortearQuebraCabeca(CATALOGO_DE_TESTE, () => numeroAleatorio)).toBe(itemEsperado);
  });

  test('o gerador é chamado exatamente uma vez por sorteio, sem argumentos', () => {
    const gerador = jest.fn(GERADOR_QUE_SEMPRE_ESCOLHE_O_PRIMEIRO);

    sortearQuebraCabeca(CATALOGO_DE_TESTE, gerador);

    expect(gerador).toHaveBeenCalledTimes(1);
    expect(gerador).toHaveBeenCalledWith();
  });

  test('a mesma sequência de números reproduz os mesmos sorteios', () => {
    const sortearQuatroVezes = (gerador) =>
      SEQUENCIA_DE_NUMEROS_ALEATORIOS.map(() => sortearQuebraCabeca(CATALOGO_DE_TESTE, gerador));

    const primeiraRodada = sortearQuatroVezes(criarGeradorQueRepeteASequencia(SEQUENCIA_DE_NUMEROS_ALEATORIOS));
    const segundaRodada = sortearQuatroVezes(criarGeradorQueRepeteASequencia(SEQUENCIA_DE_NUMEROS_ALEATORIOS));

    expect(primeiraRodada).toEqual(['segundo', 'primeiro', 'terceiro', 'segundo']);
    expect(segundaRodada).toEqual(primeiraRodada);
  });

  test('um catálogo de um item só sempre devolve esse item', () => {
    expect(sortearQuebraCabeca(['único'], GERADOR_QUE_SEMPRE_ESCOLHE_O_ULTIMO)).toBe('único');
  });
});

describe('sortearQuebraCabeca sem injeção (Math.random)', () => {
  test('sempre devolve um quebra-cabeça do catálogo', () => {
    for (let sorteio = 0; sorteio < 50; sorteio++) {
      expect(CATALOGO_DE_QUEBRA_CABECAS).toContain(sortearQuebraCabeca(CATALOGO_DE_QUEBRA_CABECAS));
    }
  });
});

describe('sortearQuebraCabeca com argumentos inválidos', () => {
  test.each([
    ['texto', 'catálogo'],
    ['null', null],
    ['undefined', undefined],
  ])('um catálogo do tipo %s é recusado com TypeError', (_descricao, catalogo) => {
    expect(() => sortearQuebraCabeca(catalogo)).toThrow(new TypeError('O catálogo deve ser uma lista.'));
  });

  test('um catálogo vazio é recusado com RangeError', () => {
    expect(() => sortearQuebraCabeca([])).toThrow(new RangeError('O catálogo não pode estar vazio.'));
  });

  test('um gerador que não é função é recusado com TypeError', () => {
    expect(() => sortearQuebraCabeca(CATALOGO_DE_TESTE, 0.5)).toThrow(
      new TypeError('gerarNumeroAleatorio deve ser uma função.'),
    );
  });

  test.each([
    ['texto', '0.5'],
    ['undefined', undefined],
  ])('um gerador que devolve %s é recusado com TypeError', (_descricao, numeroDevolvido) => {
    expect(() => sortearQuebraCabeca(CATALOGO_DE_TESTE, () => numeroDevolvido)).toThrow(
      new TypeError('O gerador de números aleatórios deve devolver um número.'),
    );
  });

  test.each([1, -0.1, 2, NaN])('um gerador que devolve %d, fora de [0, 1), é recusado com RangeError', (numeroDevolvido) => {
    expect(() => sortearQuebraCabeca(CATALOGO_DE_TESTE, () => numeroDevolvido)).toThrow(
      new RangeError('O gerador de números aleatórios deve devolver um número em [0, 1).'),
    );
  });

  test('o catálogo é validado antes de chamar o gerador', () => {
    const gerador = jest.fn(GERADOR_QUE_SEMPRE_ESCOLHE_O_PRIMEIRO);

    expect(() => sortearQuebraCabeca([], gerador)).toThrow(RangeError);
    expect(gerador).not.toHaveBeenCalled();
  });
});
