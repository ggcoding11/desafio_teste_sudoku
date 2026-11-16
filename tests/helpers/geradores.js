const GERADOR_QUE_SEMPRE_ESCOLHE_O_PRIMEIRO = () => 0;

const GERADOR_QUE_SEMPRE_ESCOLHE_O_ULTIMO = () => 1 - Number.EPSILON;

function criarGeradorQueRepeteASequencia(numerosAleatorios) {
  let proximaPosicao = 0;

  return () => {
    const numeroAleatorio = numerosAleatorios[proximaPosicao];
    proximaPosicao = (proximaPosicao + 1) % numerosAleatorios.length;
    return numeroAleatorio;
  };
}

module.exports = {
  GERADOR_QUE_SEMPRE_ESCOLHE_O_PRIMEIRO,
  GERADOR_QUE_SEMPRE_ESCOLHE_O_ULTIMO,
  criarGeradorQueRepeteASequencia,
};
