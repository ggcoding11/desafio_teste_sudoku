const { Partida } = require('../src/partida');
const { ESTADOS_DA_PARTIDA } = require('../src/constantes');
const { ErroDeRegra, MENSAGENS_DE_REGRA } = require('../src/erros');
const { CATALOGO_DE_QUEBRA_CABECAS } = require('../src/catalogo');
const {
  GRADE_VAZIA,
  SOLUCAO_VALIDA,
  SOLUCAO_VALIDA_SEM_O_CANTO_INFERIOR_DIREITO,
  LINHA_COM_TRES_UNS_SEGUIDOS_NO_INICIO,
} = require('./helpers/grades');
const { SOLUCOES_DO_CATALOGO, listarJogadasQueCompletam } = require('./helpers/solucoesDoCatalogo');

const prepararAUmaJogadaDaVitoria = () => SOLUCAO_VALIDA_SEM_O_CANTO_INFERIOR_DIREITO;
const prepararTabuleiroVazio = () => GRADE_VAZIA;

function criarPartidaVencida() {
  const partida = new Partida(prepararAUmaJogadaDaVitoria);
  partida.jogar(5, 5, 0);
  return partida;
}

describe('Partida: criação', () => {
  test('começa em andamento com o quebra-cabeça preparado', () => {
    const partida = new Partida(prepararAUmaJogadaDaVitoria);

    expect(partida.estado).toBe(ESTADOS_DA_PARTIDA.EM_ANDAMENTO);
    expect(partida.grade).toEqual(SOLUCAO_VALIDA_SEM_O_CANTO_INFERIOR_DIREITO);
  });

  test('a função de preparo é chamada uma única vez, na criação', () => {
    const prepararQuebraCabeca = jest.fn(prepararTabuleiroVazio);

    const partida = new Partida(prepararQuebraCabeca);
    expect(prepararQuebraCabeca).toHaveBeenCalledTimes(1);

    partida.jogar(0, 0, 1);
    partida.apagar(0, 0);
    expect(prepararQuebraCabeca).toHaveBeenCalledTimes(1);
  });

  test.each([
    ['texto', 'catálogo'],
    ['null', null],
    ['uma grade em vez de função', GRADE_VAZIA],
  ])('uma função de preparo do tipo %s é recusada com TypeError', (_descricao, prepararQuebraCabeca) => {
    expect(() => new Partida(prepararQuebraCabeca)).toThrow(
      new TypeError('prepararQuebraCabeca deve ser uma função.'),
    );
  });

  test.each([
    ['algo que não é lista', () => 'grade', new TypeError('A grade deve ser uma lista.')],
    ['uma grade 5 x 6', () => GRADE_VAZIA.slice(1), new RangeError('A grade deve ter 6 posições.')],
    [
      'uma grade que já viola as regras',
      () => LINHA_COM_TRES_UNS_SEGUIDOS_NO_INICIO,
      new RangeError(`A grade inicial viola as regras: ${MENSAGENS_DE_REGRA.VALORES_IGUAIS_SEGUIDOS}`),
    ],
    [
      'uma grade sem células vazias',
      () => SOLUCAO_VALIDA,
      new RangeError('O quebra-cabeça precisa ter ao menos uma célula vazia.'),
    ],
  ])('uma função de preparo que devolve %s é recusada', (_descricao, prepararQuebraCabeca, erroEsperado) => {
    expect(() => new Partida(prepararQuebraCabeca)).toThrow(erroEsperado);
  });
});

describe('Partida: sem injeção (sorteio do catálogo com Math.random)', () => {
  test('começa em andamento com um quebra-cabeça do catálogo', () => {
    const partida = new Partida();

    expect(partida.estado).toBe(ESTADOS_DA_PARTIDA.EM_ANDAMENTO);
    expect(CATALOGO_DE_QUEBRA_CABECAS).toContainEqual(partida.grade);
  });
});

describe('Partida: jogar', () => {
  test('uma jogada válida preenche a célula e mantém a partida em andamento', () => {
    const partida = new Partida(prepararTabuleiroVazio);

    partida.jogar(2, 3, 0);

    expect(partida.grade[2][3]).toBe(0);
    expect(partida.estado).toBe(ESTADOS_DA_PARTIDA.EM_ANDAMENTO);
  });

  test('preencher a última célula vazia vence a partida', () => {
    const partida = new Partida(prepararAUmaJogadaDaVitoria);

    partida.jogar(5, 5, 0);

    expect(partida.estado).toBe(ESTADOS_DA_PARTIDA.VENCIDA);
    expect(partida.grade).toEqual(SOLUCAO_VALIDA);
  });

  test('uma jogada que viola as regras é recusada e não muda nada', () => {
    const partida = new Partida(prepararAUmaJogadaDaVitoria);

    expect(() => partida.jogar(5, 5, 1)).toThrow(new ErroDeRegra(MENSAGENS_DE_REGRA.EXCESSO_DE_UM_VALOR));
    expect(partida.estado).toBe(ESTADOS_DA_PARTIDA.EM_ANDAMENTO);
    expect(partida.grade).toEqual(SOLUCAO_VALIDA_SEM_O_CANTO_INFERIOR_DIREITO);
  });

  test('jogar numa célula inicial é proibido e não muda nada', () => {
    const partida = new Partida(prepararAUmaJogadaDaVitoria);

    expect(() => partida.jogar(0, 0, 1)).toThrow(new ErroDeRegra(MENSAGENS_DE_REGRA.CELULA_FIXA));
    expect(partida.grade).toEqual(SOLUCAO_VALIDA_SEM_O_CANTO_INFERIOR_DIREITO);
  });

  test.each([
    ['linha inválida', [6, 0, 1], new RangeError('A linha deve estar entre 0 e 5.')],
    ['coluna inválida', [0, 2.5, 1], new TypeError('A coluna deve ser um número inteiro.')],
    ['valor inválido', [0, 0, 3], new RangeError('O valor deve ser 0 ou 1.')],
  ])('jogar com %s é recusado e não muda nada', (_descricao, argumentos, erroEsperado) => {
    const partida = new Partida(prepararTabuleiroVazio);

    expect(() => partida.jogar(...argumentos)).toThrow(erroEsperado);
    expect(partida.grade).toEqual(GRADE_VAZIA);
  });

  test.each(CATALOGO_DE_QUEBRA_CABECAS.map((quebraCabeca, indice) => [indice, quebraCabeca]))(
    'jogar a solução do quebra-cabeça %i do catálogo vence só na última jogada',
    (indice, quebraCabeca) => {
      const partida = new Partida(() => quebraCabeca);
      const jogadas = listarJogadasQueCompletam(quebraCabeca, SOLUCOES_DO_CATALOGO[indice]);
      const ultimaJogada = jogadas.pop();

      jogadas.forEach(([linha, coluna, valor]) => partida.jogar(linha, coluna, valor));
      expect(partida.estado).toBe(ESTADOS_DA_PARTIDA.EM_ANDAMENTO);

      partida.jogar(...ultimaJogada);
      expect(partida.estado).toBe(ESTADOS_DA_PARTIDA.VENCIDA);
    },
  );
});

describe('Partida: apagar', () => {
  test('apagar uma jogada do jogador deixa a célula vazia', () => {
    const partida = new Partida(prepararTabuleiroVazio);
    partida.jogar(4, 4, 1);

    partida.apagar(4, 4);

    expect(partida.grade).toEqual(GRADE_VAZIA);
  });

  test('apagar uma célula inicial é proibido e não muda nada', () => {
    const partida = new Partida(prepararAUmaJogadaDaVitoria);

    expect(() => partida.apagar(0, 0)).toThrow(new ErroDeRegra(MENSAGENS_DE_REGRA.CELULA_FIXA));
    expect(partida.grade).toEqual(SOLUCAO_VALIDA_SEM_O_CANTO_INFERIOR_DIREITO);
  });

  test('apagar uma célula vazia é proibido', () => {
    const partida = new Partida(prepararTabuleiroVazio);

    expect(() => partida.apagar(4, 4)).toThrow(new ErroDeRegra(MENSAGENS_DE_REGRA.CELULA_JA_VAZIA));
  });

  test('apagar uma posição inválida é recusado', () => {
    const partida = new Partida(prepararTabuleiroVazio);

    expect(() => partida.apagar('0', 0)).toThrow(new TypeError('A linha deve ser um número inteiro.'));
  });
});

describe('Partida: depois da vitória', () => {
  test('jogar depois da vitória é proibido e não muda nada', () => {
    const partida = criarPartidaVencida();

    expect(() => partida.jogar(5, 5, 1)).toThrow(new ErroDeRegra(MENSAGENS_DE_REGRA.PARTIDA_ENCERRADA));
    expect(partida.grade).toEqual(SOLUCAO_VALIDA);
    expect(partida.estado).toBe(ESTADOS_DA_PARTIDA.VENCIDA);
  });

  test('apagar depois da vitória é proibido e não muda nada', () => {
    const partida = criarPartidaVencida();

    expect(() => partida.apagar(5, 5)).toThrow(new ErroDeRegra(MENSAGENS_DE_REGRA.PARTIDA_ENCERRADA));
    expect(partida.grade).toEqual(SOLUCAO_VALIDA);
  });

  test('argumentos inválidos são recusados antes da regra de partida encerrada', () => {
    const partida = criarPartidaVencida();

    expect(() => partida.jogar(0, 0, 'x')).toThrow(new TypeError('O valor deve ser um número.'));
    expect(() => partida.apagar(-1, 0)).toThrow(new RangeError('A linha deve estar entre 0 e 5.'));
  });
});

describe('Partida: consultas e encapsulamento', () => {
  test('informa quais células são do quebra-cabeça original', () => {
    const partida = new Partida(prepararAUmaJogadaDaVitoria);

    expect(partida.eCelulaFixa(0, 0)).toBe(true);
    expect(partida.eCelulaFixa(5, 5)).toBe(false);
  });

  test('alterar a grade devolvida pela função de preparo não afeta a partida', () => {
    const gradePreparada = GRADE_VAZIA.map((linha) => [...linha]);
    const partida = new Partida(() => gradePreparada);

    gradePreparada[0][0] = 1;

    expect(partida.grade).toEqual(GRADE_VAZIA);
  });

  test('alterar a grade devolvida pelo getter não afeta a partida', () => {
    const partida = new Partida(prepararTabuleiroVazio);

    partida.grade[0][0] = 1;

    expect(partida.grade).toEqual(GRADE_VAZIA);
  });

  test('atribuir ao estado por fora não muda a partida', () => {
    const partida = new Partida(prepararTabuleiroVazio);

    partida.estado = ESTADOS_DA_PARTIDA.VENCIDA;

    expect(partida.estado).toBe(ESTADOS_DA_PARTIDA.EM_ANDAMENTO);
  });

  test('o estado interno não fica exposto como propriedade', () => {
    expect(Object.keys(new Partida(prepararTabuleiroVazio))).toEqual([]);
  });
});
