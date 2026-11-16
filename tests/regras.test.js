const { encontrarViolacao, estaCompleta } = require('../src/regras');
const { MENSAGENS_DE_REGRA } = require('../src/erros');
const {
  _,
  transpor,
  GRADE_VAZIA,
  SOLUCAO_VALIDA,
  SOLUCAO_VALIDA_SEM_O_CANTO_INFERIOR_DIREITO,
  LINHA_COM_TRES_UNS_SEGUIDOS_NO_INICIO,
  LINHA_COM_TRES_ZEROS_SEGUIDOS_NO_FIM,
  LINHA_COM_QUATRO_UNS_SEM_TRIO,
  LINHA_COM_QUATRO_ZEROS_SEM_TRIO,
  LINHAS_COMPLETAS_IGUAIS_E_VIZINHAS,
  LINHAS_COMPLETAS_IGUAIS_E_DISTANTES,
  LINHAS_INCOMPLETAS_COM_O_MESMO_COMECO,
  DOIS_VALORES_IGUAIS_SEGUIDOS_EM_LINHA_E_COLUNA,
} = require('./helpers/grades');

describe('encontrarViolacao: grades que respeitam as regras', () => {
  test.each([
    ['a grade vazia', GRADE_VAZIA],
    ['uma solução completa e válida', SOLUCAO_VALIDA],
    ['uma solução válida com uma célula vazia', SOLUCAO_VALIDA_SEM_O_CANTO_INFERIOR_DIREITO],
    ['dois valores iguais seguidos em linha e em coluna', DOIS_VALORES_IGUAIS_SEGUIDOS_EM_LINHA_E_COLUNA],
    ['linhas incompletas com o mesmo começo', LINHAS_INCOMPLETAS_COM_O_MESMO_COMECO],
    ['colunas incompletas com o mesmo começo', transpor(LINHAS_INCOMPLETAS_COM_O_MESMO_COMECO)],
  ])('%s não tem violação', (_descricao, grade) => {
    expect(encontrarViolacao(grade)).toBeNull();
  });
});

describe('encontrarViolacao: três valores iguais seguidos', () => {
  test.each([
    ['três uns no início de uma linha', LINHA_COM_TRES_UNS_SEGUIDOS_NO_INICIO],
    ['três zeros no fim de uma linha', LINHA_COM_TRES_ZEROS_SEGUIDOS_NO_FIM],
    ['três uns no topo de uma coluna', transpor(LINHA_COM_TRES_UNS_SEGUIDOS_NO_INICIO)],
    ['três zeros no pé de uma coluna', transpor(LINHA_COM_TRES_ZEROS_SEGUIDOS_NO_FIM)],
  ])('%s é proibido', (_descricao, grade) => {
    expect(encontrarViolacao(grade)).toBe(MENSAGENS_DE_REGRA.VALORES_IGUAIS_SEGUIDOS);
  });

  test('três células vazias seguidas não contam como valores iguais', () => {
    const grade = [[0, _, _, _, 1, 1], ...GRADE_VAZIA.slice(1)];

    expect(encontrarViolacao(grade)).toBeNull();
  });
});

describe('encontrarViolacao: mais de três valores iguais na mesma linha ou coluna', () => {
  test.each([
    ['quatro uns em uma linha', LINHA_COM_QUATRO_UNS_SEM_TRIO],
    ['quatro zeros em uma linha', LINHA_COM_QUATRO_ZEROS_SEM_TRIO],
    ['quatro uns em uma coluna', transpor(LINHA_COM_QUATRO_UNS_SEM_TRIO)],
    ['quatro zeros em uma coluna', transpor(LINHA_COM_QUATRO_ZEROS_SEM_TRIO)],
  ])('%s é proibido, mesmo sem trio', (_descricao, grade) => {
    expect(encontrarViolacao(grade)).toBe(MENSAGENS_DE_REGRA.EXCESSO_DE_UM_VALOR);
  });
});

describe('encontrarViolacao: linhas e colunas completas repetidas', () => {
  test.each([
    ['vizinhas', LINHAS_COMPLETAS_IGUAIS_E_VIZINHAS],
    ['distantes', LINHAS_COMPLETAS_IGUAIS_E_DISTANTES],
  ])('duas linhas completas iguais e %s são proibidas', (_descricao, grade) => {
    expect(encontrarViolacao(grade)).toBe(MENSAGENS_DE_REGRA.LINHAS_REPETIDAS);
  });

  test.each([
    ['vizinhas', transpor(LINHAS_COMPLETAS_IGUAIS_E_VIZINHAS)],
    ['distantes', transpor(LINHAS_COMPLETAS_IGUAIS_E_DISTANTES)],
  ])('duas colunas completas iguais e %s são proibidas', (_descricao, grade) => {
    expect(encontrarViolacao(grade)).toBe(MENSAGENS_DE_REGRA.COLUNAS_REPETIDAS);
  });
});

describe('encontrarViolacao: não altera a grade recebida', () => {
  test('a grade analisada continua igual', () => {
    const grade = SOLUCAO_VALIDA.map((linha) => [...linha]);

    encontrarViolacao(grade);

    expect(grade).toEqual(SOLUCAO_VALIDA);
  });
});

describe('estaCompleta', () => {
  test.each([
    [[0, 1, 0, 1, 0, 1], true],
    [[0, 1, 0, 1, 0, _], false],
    [[_, _, _, _, _, _], false],
  ])('a sequência %j está completa? %s', (sequencia, esperado) => {
    expect(estaCompleta(sequencia)).toBe(esperado);
  });
});
