const { ErroDeRegra, MENSAGENS_DE_REGRA } = require('../src/erros');

describe('ErroDeRegra', () => {
  test('é um Error com nome e mensagem próprios', () => {
    const erro = new ErroDeRegra('jogada proibida');

    expect(erro).toBeInstanceOf(Error);
    expect(erro).toBeInstanceOf(ErroDeRegra);
    expect(erro.name).toBe('ErroDeRegra');
    expect(erro.message).toBe('jogada proibida');
  });

  test('não se confunde com TypeError nem com RangeError', () => {
    const erro = new ErroDeRegra('jogada proibida');

    expect(erro).not.toBeInstanceOf(TypeError);
    expect(erro).not.toBeInstanceOf(RangeError);
  });
});

describe('MENSAGENS_DE_REGRA', () => {
  test('é congelada', () => {
    expect(Object.isFrozen(MENSAGENS_DE_REGRA)).toBe(true);
  });

  test('a mensagem de excesso usa a quantidade permitida por linha', () => {
    expect(MENSAGENS_DE_REGRA.EXCESSO_DE_UM_VALOR).toBe(
      'Uma linha ou coluna não pode ter mais de 3 valores iguais.',
    );
  });

  test('todas as mensagens são distintas', () => {
    const mensagens = Object.values(MENSAGENS_DE_REGRA);

    expect(new Set(mensagens).size).toBe(mensagens.length);
  });
});
