function validarCatalogo(catalogo) {
  if (!Array.isArray(catalogo)) {
    throw new TypeError('O catálogo deve ser uma lista.');
  }
  if (catalogo.length === 0) {
    throw new RangeError('O catálogo não pode estar vazio.');
  }
}

function validarNumeroAleatorio(numeroAleatorio) {
  if (typeof numeroAleatorio !== 'number') {
    throw new TypeError('O gerador de números aleatórios deve devolver um número.');
  }
  if (!(numeroAleatorio >= 0 && numeroAleatorio < 1)) {
    throw new RangeError('O gerador de números aleatórios deve devolver um número em [0, 1).');
  }
}

function sortearQuebraCabeca(catalogo, gerarNumeroAleatorio = Math.random) {
  validarCatalogo(catalogo);
  if (typeof gerarNumeroAleatorio !== 'function') {
    throw new TypeError('gerarNumeroAleatorio deve ser uma função.');
  }

  const numeroAleatorio = gerarNumeroAleatorio();
  validarNumeroAleatorio(numeroAleatorio);

  return catalogo[Math.floor(numeroAleatorio * catalogo.length)];
}

module.exports = { sortearQuebraCabeca };
