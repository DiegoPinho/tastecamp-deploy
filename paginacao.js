const resultados = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // resultado que queremos administrar

const pagina = 2; // da pagina que o usuario quer visitar
const limite = 2;
const inicio = (pagina - 1) * limite;

const resultado = resultados.slice(inicio, inicio + limite);
console.log(resultado);