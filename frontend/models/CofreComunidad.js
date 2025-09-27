export class CofreComunidad {
  constructor(data) {
    this.id = data.id;
    this.description = data.description;
    this.action = data.action;
  }

  aplicar(jugador) {
    if (this.action && this.action.money) {
      const monto = this.action.money;
      jugador.modificarDinero(monto);
      
      console.log(`${jugador.nombre} - ${this.description}`);
      
      return monto;
    }
    
    return 0;
  }

  toString() {
    return `Caja de Comunidad: ${this.description}`;
  }
}