const { CELULA_VAZIA: _ } = require('./constantes');

function congelarGrade(grade) {
  return Object.freeze(grade.map((linha) => Object.freeze(linha)));
}

const CATALOGO_DE_QUEBRA_CABECAS = Object.freeze([
  congelarGrade([
    [_, _, 1, _, 1, _],
    [_, _, 1, _, _, _],
    [1, _, _, _, 1, _],
    [_, _, _, 0, _, _],
    [_, _, _, _, _, 0],
    [_, _, _, _, _, 0],
  ]),
  congelarGrade([
    [_, _, _, _, _, _],
    [_, _, _, _, 1, _],
    [_, _, _, 0, _, _],
    [_, _, 0, _, _, 1],
    [_, _, 0, _, 0, _],
    [1, _, _, _, 0, _],
  ]),
  congelarGrade([
    [_, 0, _, _, _, _],
    [_, _, 1, _, _, _],
    [_, _, _, _, _, _],
    [_, 1, 1, _, _, _],
    [_, _, _, _, _, 0],
    [_, _, _, _, 0, 0],
  ]),
]);

module.exports = { CATALOGO_DE_QUEBRA_CABECAS };
