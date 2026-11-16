const { Tabuleiro } = require('../src/tabuleiro');
const { ErroDeRegra, MENSAGENS_DE_REGRA } = require('../src/erros');
const {
  transpor,
  GRADE_VAZIA,
  SOLUCAO_VALIDA,
  SOLUCAO_VALIDA_SEM_O_CANTO_INFERIOR_DIREITO,
  LINHA_COM_TRES_UNS_SEGUIDOS_NO_INICIO,
  LINHAS_COMPLETAS_IGUAIS_E_VIZINHAS,
  LINHAS_INCOMPLETAS_COM_O_MESMO_COMECO,
  DOIS_VALORES_IGUAIS_SEGUIDOS_EM_LINHA_E_COLUNA,
} = require('./helpers/grades');

describe('Tabuleiro: criação', () => {
  test('começa com a grade inicial recebida', () => {
    const tabuleiro = new Tabuleiro(SOLUCAO_VALIDA_SEM_O_CANTO_INFERIOR_DIREITO);

    expect(tabuleiro.grade).toEqual(SOLUCAO_VALIDA_SEM_O_CANTO_INFERIOR_DIREITO);
  });

  test('o formato da grade é validado antes das regras', () => {
    expect(() => new Tabuleiro('grade')).toThrow(new TypeError('A grade deve ser uma lista.'));
    expect(() => new Tabuleiro(GRADE_VAZIA.slice(1))).toThrow(new RangeError('A grade deve ter 6 posições.'));
  });

  test.each([
    ['três valores iguais seguidos', LINHA_COM_TRES_UNS_SEGUIDOS_NO_INICIO, MENSAGENS_DE_REGRA.VALORES_IGUAIS_SEGUIDOS],
    ['linhas completas repetidas', LINHAS_COMPLETAS_IGUAIS_E_VIZINHAS, MENSAGENS_DE_REGRA.LINHAS_REPETIDAS],
  ])('uma grade inicial com %s é recusada com RangeError', (_descricao, grade, mensagem) => {
    expect(() => new Tabuleiro(grade)).toThrow(new RangeError(`A grade inicial viola as regras: ${mensagem}`));
  });
});

describe('Tabuleiro: células fixas', () => {
  test('as células preenchidas na grade inicial são fixas e as vazias não', () => {
    const tabuleiro = new Tabuleiro(SOLUCAO_VALIDA_SEM_O_CANTO_INFERIOR_DIREITO);

    expect(tabuleiro.eCelulaFixa(0, 0)).toBe(true);
    expect(tabuleiro.eCelulaFixa(5, 5)).toBe(false);
  });

  test('uma célula preenchida pelo jogador não vira fixa', () => {
    const tabuleiro = new Tabuleiro(GRADE_VAZIA);

    tabuleiro.preencher(2, 2, 1);

    expect(tabuleiro.eCelulaFixa(2, 2)).toBe(false);
  });

  test('consultar uma posição fora do tabuleiro é recusado', () => {
    const tabuleiro = new Tabuleiro(GRADE_VAZIA);

    expect(() => tabuleiro.eCelulaFixa(6, 0)).toThrow(new RangeError('A linha deve estar entre 0 e 5.'));
  });
});

describe('Tabuleiro: estaCheio', () => {
  test.each([
    ['vazio', GRADE_VAZIA, false],
    ['com uma célula vazia', SOLUCAO_VALIDA_SEM_O_CANTO_INFERIOR_DIREITO, false],
    ['completo', SOLUCAO_VALIDA, true],
  ])('um tabuleiro %s está cheio? %s', (_descricao, grade, esperado) => {
    expect(new Tabuleiro(grade).estaCheio()).toBe(esperado);
  });

  test('preencher a última célula vazia deixa o tabuleiro cheio', () => {
    const tabuleiro = new Tabuleiro(SOLUCAO_VALIDA_SEM_O_CANTO_INFERIOR_DIREITO);

    tabuleiro.preencher(5, 5, 0);

    expect(tabuleiro.estaCheio()).toBe(true);
    expect(tabuleiro.grade).toEqual(SOLUCAO_VALIDA);
  });
});

describe('Tabuleiro: preencher', () => {
  test('preencher uma célula vazia coloca o valor nela', () => {
    const tabuleiro = new Tabuleiro(GRADE_VAZIA);

    tabuleiro.preencher(3, 4, 1);

    expect(tabuleiro.grade[3][4]).toBe(1);
  });

  test('preencher uma célula já preenchida pelo jogador substitui o valor', () => {
    const tabuleiro = new Tabuleiro(GRADE_VAZIA);
    tabuleiro.preencher(3, 4, 1);

    tabuleiro.preencher(3, 4, 0);

    expect(tabuleiro.grade[3][4]).toBe(0);
  });

  test('alterar uma célula fixa é proibido e não muda nada', () => {
    const tabuleiro = new Tabuleiro(SOLUCAO_VALIDA_SEM_O_CANTO_INFERIOR_DIREITO);

    expect(() => tabuleiro.preencher(0, 0, 1)).toThrow(new ErroDeRegra(MENSAGENS_DE_REGRA.CELULA_FIXA));
    expect(tabuleiro.grade).toEqual(SOLUCAO_VALIDA_SEM_O_CANTO_INFERIOR_DIREITO);
  });

  test('formar três valores iguais seguidos é proibido e não muda nada', () => {
    const tabuleiro = new Tabuleiro(GRADE_VAZIA);
    tabuleiro.preencher(0, 0, 1);
    tabuleiro.preencher(0, 1, 1);
    const gradeAntes = tabuleiro.grade;

    expect(() => tabuleiro.preencher(0, 2, 1)).toThrow(new ErroDeRegra(MENSAGENS_DE_REGRA.VALORES_IGUAIS_SEGUIDOS));
    expect(tabuleiro.grade).toEqual(gradeAntes);
  });

  test('colocar o quarto valor igual numa coluna é proibido e não muda nada', () => {
    const tabuleiro = new Tabuleiro(DOIS_VALORES_IGUAIS_SEGUIDOS_EM_LINHA_E_COLUNA);

    expect(() => tabuleiro.preencher(4, 0, 1)).toThrow(new ErroDeRegra(MENSAGENS_DE_REGRA.EXCESSO_DE_UM_VALOR));
    expect(tabuleiro.grade).toEqual(DOIS_VALORES_IGUAIS_SEGUIDOS_EM_LINHA_E_COLUNA);
  });

  test('o valor errado na última célula é recusado e a célula continua vazia', () => {
    const tabuleiro = new Tabuleiro(SOLUCAO_VALIDA_SEM_O_CANTO_INFERIOR_DIREITO);

    expect(() => tabuleiro.preencher(5, 5, 1)).toThrow(new ErroDeRegra(MENSAGENS_DE_REGRA.EXCESSO_DE_UM_VALOR));
    expect(tabuleiro.estaCheio()).toBe(false);
  });

  test('completar uma linha igual a outra linha completa é proibido e não muda nada', () => {
    const tabuleiro = new Tabuleiro(LINHAS_INCOMPLETAS_COM_O_MESMO_COMECO);
    tabuleiro.preencher(0, 5, 1);
    const gradeAntes = tabuleiro.grade;

    expect(() => tabuleiro.preencher(1, 5, 1)).toThrow(new ErroDeRegra(MENSAGENS_DE_REGRA.LINHAS_REPETIDAS));
    expect(tabuleiro.grade).toEqual(gradeAntes);
  });

  test('completar uma coluna igual a outra coluna completa é proibido e não muda nada', () => {
    const tabuleiro = new Tabuleiro(transpor(LINHAS_INCOMPLETAS_COM_O_MESMO_COMECO));
    tabuleiro.preencher(5, 0, 1);
    const gradeAntes = tabuleiro.grade;

    expect(() => tabuleiro.preencher(5, 1, 1)).toThrow(new ErroDeRegra(MENSAGENS_DE_REGRA.COLUNAS_REPETIDAS));
    expect(tabuleiro.grade).toEqual(gradeAntes);
  });

  test('o argumento é validado antes da regra da célula fixa', () => {
    const tabuleiro = new Tabuleiro(SOLUCAO_VALIDA_SEM_O_CANTO_INFERIOR_DIREITO);

    expect(() => tabuleiro.preencher(0, 0, 2)).toThrow(new RangeError('O valor deve ser 0 ou 1.'));
  });

  test.each([
    ['linha inválida', [-1, 0, 1], new RangeError('A linha deve estar entre 0 e 5.')],
    ['coluna inválida', [0, '0', 1], new TypeError('A coluna deve ser um número inteiro.')],
    ['valor inválido', [0, 0, '1'], new TypeError('O valor deve ser um número.')],
  ])('preencher com %s é recusado e não muda nada', (_descricao, argumentos, erroEsperado) => {
    const tabuleiro = new Tabuleiro(GRADE_VAZIA);

    expect(() => tabuleiro.preencher(...argumentos)).toThrow(erroEsperado);
    expect(tabuleiro.grade).toEqual(GRADE_VAZIA);
  });
});

describe('Tabuleiro: apagar', () => {
  test('apagar uma célula preenchida pelo jogador a deixa vazia', () => {
    const tabuleiro = new Tabuleiro(GRADE_VAZIA);
    tabuleiro.preencher(1, 1, 0);

    tabuleiro.apagar(1, 1);

    expect(tabuleiro.grade).toEqual(GRADE_VAZIA);
  });

  test('apagar uma célula fixa é proibido e não muda nada', () => {
    const tabuleiro = new Tabuleiro(SOLUCAO_VALIDA_SEM_O_CANTO_INFERIOR_DIREITO);

    expect(() => tabuleiro.apagar(0, 2)).toThrow(new ErroDeRegra(MENSAGENS_DE_REGRA.CELULA_FIXA));
    expect(tabuleiro.grade).toEqual(SOLUCAO_VALIDA_SEM_O_CANTO_INFERIOR_DIREITO);
  });

  test('apagar uma célula já vazia é proibido', () => {
    const tabuleiro = new Tabuleiro(GRADE_VAZIA);

    expect(() => tabuleiro.apagar(1, 1)).toThrow(new ErroDeRegra(MENSAGENS_DE_REGRA.CELULA_JA_VAZIA));
  });

  test('apagar uma posição fora do tabuleiro é recusado antes de qualquer regra', () => {
    const tabuleiro = new Tabuleiro(GRADE_VAZIA);

    expect(() => tabuleiro.apagar(0, 6)).toThrow(new RangeError('A coluna deve estar entre 0 e 5.'));
  });
});

describe('Tabuleiro: encapsulamento', () => {
  test('alterar a grade recebida depois da criação não afeta o tabuleiro', () => {
    const gradeExterna = GRADE_VAZIA.map((linha) => [...linha]);
    const tabuleiro = new Tabuleiro(gradeExterna);

    gradeExterna[0][0] = 1;

    expect(tabuleiro.grade).toEqual(GRADE_VAZIA);
    expect(tabuleiro.eCelulaFixa(0, 0)).toBe(false);
  });

  test('alterar a grade devolvida pelo getter não afeta o tabuleiro', () => {
    const tabuleiro = new Tabuleiro(GRADE_VAZIA);

    tabuleiro.grade[0][0] = 1;

    expect(tabuleiro.grade).toEqual(GRADE_VAZIA);
  });

  test('cada leitura da grade devolve um objeto novo', () => {
    const tabuleiro = new Tabuleiro(GRADE_VAZIA);

    expect(tabuleiro.grade).not.toBe(tabuleiro.grade);
    expect(tabuleiro.grade[0]).not.toBe(tabuleiro.grade[0]);
  });

  test('o estado interno não fica exposto como propriedade', () => {
    const tabuleiro = new Tabuleiro(GRADE_VAZIA);

    expect(Object.keys(tabuleiro)).toEqual([]);
  });
});
