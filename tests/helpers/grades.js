const _ = null;

function congelarGrade(grade) {
  return Object.freeze(grade.map((linha) => Object.freeze([...linha])));
}

function transpor(grade) {
  return congelarGrade(grade[0].map((_celula, indiceDaColuna) => grade.map((linha) => linha[indiceDaColuna])));
}

const GRADE_VAZIA = congelarGrade([
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
]);

const SOLUCAO_VALIDA = congelarGrade([
  [0, 0, 1, 0, 1, 1],
  [0, 0, 1, 1, 0, 1],
  [1, 1, 0, 0, 1, 0],
  [0, 1, 0, 0, 1, 1],
  [1, 0, 1, 1, 0, 0],
  [1, 1, 0, 1, 0, 0],
]);

const SOLUCAO_VALIDA_SEM_O_CANTO_INFERIOR_DIREITO = congelarGrade([
  [0, 0, 1, 0, 1, 1],
  [0, 0, 1, 1, 0, 1],
  [1, 1, 0, 0, 1, 0],
  [0, 1, 0, 0, 1, 1],
  [1, 0, 1, 1, 0, 0],
  [1, 1, 0, 1, 0, _],
]);

const LINHA_COM_TRES_UNS_SEGUIDOS_NO_INICIO = congelarGrade([
  [1, 1, 1, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
]);

const LINHA_COM_TRES_ZEROS_SEGUIDOS_NO_FIM = congelarGrade([
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, 0, 0, 0],
]);

const LINHA_COM_QUATRO_UNS_SEM_TRIO = congelarGrade([
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [1, 1, 0, 1, 1, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
]);

const LINHA_COM_QUATRO_ZEROS_SEM_TRIO = congelarGrade([
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [0, _, 0, 1, 0, 0],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
]);

const LINHAS_COMPLETAS_IGUAIS_E_VIZINHAS = congelarGrade([
  [0, 0, 1, 0, 1, 1],
  [0, 0, 1, 0, 1, 1],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
]);

const LINHAS_COMPLETAS_IGUAIS_E_DISTANTES = congelarGrade([
  [0, 1, 0, 1, 0, 1],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [0, 1, 0, 1, 0, 1],
]);

const LINHAS_INCOMPLETAS_COM_O_MESMO_COMECO = congelarGrade([
  [0, 0, 1, 0, 1, _],
  [0, 0, 1, 0, 1, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
]);

const DOIS_VALORES_IGUAIS_SEGUIDOS_EM_LINHA_E_COLUNA = congelarGrade([
  [1, 1, 0, 0, 1, 0],
  [1, _, _, _, _, _],
  [0, _, _, _, _, _],
  [1, _, _, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
]);

module.exports = {
  _,
  congelarGrade,
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
};
