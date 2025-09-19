class Dados {

    //atributos
    constructor() {
        this.dados = [0, 0];
    }

    // Aqui se definirán metodos relacionados con los dados
    // Lanzar, verificacion de dobles y sumar 
    lanzar() {
        this.dados[0] = Math.floor(Math.random() * 6) + 1; // Genera un número aleatorio entre 1 y 6
        this.dados[1] = Math.floor(Math.random() * 6) + 1;
        return this.dados;
    }

    verificarDobles() {  // Si esto es verdad se concede otro turno al jugador
        return this.dados[0] === this.dados[1];
    }

    sumarDados() {
        return this.dados[0] + this.dados[1];
    }

}