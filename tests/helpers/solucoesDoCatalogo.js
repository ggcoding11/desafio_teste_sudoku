const { congelarGrade, SOLUCAO_VALIDA } = require('./grades');

const SOLUCOES_DO_CATALOGO = Object.freeze([
  SOLUCAO_VALIDA,
  congelarGrade([
    [0, 0, 1, 0, 1, 1],
    [0, 1, 0, 1, 1, 0],
    [1, 0, 1, 0, 0, 1],
    [0, 1, 0, 0, 1, 1],
    [1, 1, 0, 1, 0, 0],
    [1, 0, 1, 1, 0, 0],
  ]),
  congelarGrade([
    [0, 0, 1, 0, 1, 1],
    [1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1],
    [0, 1, 1, 0, 0, 1],
    [1, 0, 0, 1, 1, 0],
    [1, 1, 0, 1, 0, 0],
  ]),
]);

function listarJogadasQueCompletam(quebraCabeca, solucao) {
  const jogadas = [];
  quebraCabeca.forEach((linha, indiceDaLinha) => {
    linha.forEach((celula, indiceDaColuna) => {
      if (celula === null) {
        jogadas.push([indiceDaLinha, indiceDaColuna, solucao[indiceDaLinha][indiceDaColuna]]);
      }
    });
  });
  return jogadas;
}

module.exports = { SOLUCOES_DO_CATALOGO, listarJogadasQueCompletam };
