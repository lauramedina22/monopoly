export class Dado {
  static dados = [0, 0];

  // Aqui se definirán metodos relacionados con los dados
  // Lanzar, verificacion de dobles y sumar

  static lanzar() {
    this.dados[0] = Math.floor(Math.random() * 6) + 1; // Genera un número aleatorio entre 1 y 6
    this.dados[1] = Math.floor(Math.random() * 6) + 1;
    return this;
  }

  static verificarDobles() {
    // Si esto es verdad se concede otro turno al jugador
    return this.dados[0] === this.dados[1];
  }

  static sumarDados() {
    return this.dados[0] + this.dados[1];
  }
}
