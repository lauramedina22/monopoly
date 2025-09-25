export class Jugador {
  constructor(nombre, paisNombre, paisCodigo, colorFicha, dineroInicial = 1500, puntaje = 0) {
    this.nombre = nombre;              // Nombre del jugador
    this.paisNombre = paisNombre;      // Nombre del país (ej: Colombia)
    this.paisCodigo = paisCodigo;      // Código del país (ej: CO)
    this.colorFicha = colorFicha;      // Color de la ficha
    this.dinero = dineroInicial;       // Dinero disponible
    this.puntaje = puntaje;                 // Puntuación del jugador
    this.propiedades = []; // lista de propiedades adquiridas
    this.hipotecas = [];   // propiedades hipotecadas
    this.prestamos = [];   // préstamos activos
    this.posicion = 0;    // posición en el tablero
  }

  // ---- Panel de jugador ----
  mostrarPanel() {
    return {
      nombre: this.nombre,
      pais: {
        nombre: this.paisNombre,
        codigo: this.paisCodigo
      },
      colorFicha: this.colorFicha,
      dinero: this.dinero,
      puntaje: this.puntaje,
      propiedades: this.propiedades.map(p => p.name),
      hipotecas: this.hipotecas.map(p => p.name),
      prestamos: this.prestamos,
      posicion: this.posicion
    };
  }


  toJSON() {
    return {
      nombre: this.nombre,
      paisNombre: this.paisNombre,
      paisCodigo: this.paisCodigo,
      colorFicha: this.colorFicha,
      dinero: this.dinero,
      puntaje: this.puntaje,
      propiedades: this.propiedades,
      hipotecas: this.hipotecas,
      prestamos: this.prestamos
    };
  }
  
  toString() {
    let props = this.propiedades.map(p => p.name).join(", ") || "Ninguna";
    return `Jugador ${this.nombre} (${this.colorFicha}) | Dinero: $${this.dinero} | Propiedades: ${props}`;
  }

}

