export class Casilla {
  constructor(data) {
    // Atributos básicos del backend
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;

    // Propiedades de propiedad
    this.color = data.color || null;
    this.price = data.price || null;
    this.mortgage = data.mortgage || null;
    this.rent = data.rent || null;

    // Propiedades de acción (chance, comunidad, impuestos)
    this.action = data.action || null;
    // Atributos básicos de estado del juego
    this.dueno = null;           // Referencia al objeto Jugador propietario
  }

  // Métodos de identificación de tipo
  esPropiedad() {
    return this.type === "property";
  }

  esFerrocarril() {
    return this.type === "railroad";
  }

  esServicio() {
    return this.type === "utility";
  }

  esImpuesto() {
    return this.type === "tax";
  }

  esEspecial() {
    return this.type === "special";
  }

  esSorpresa() {
    return this.type === "chance";
  }

  esComunidad() {
    return this.type === "community_chest";
  }

  // Métodos básicos de estado
  estaDisponible() {
    return (this.esPropiedad() || this.esFerrocarril()) && this.dueno === null;
  }

  puedeComprar() {
    return this.estaDisponible() && this.price !== null;
  }

  // Método básico para asignar dueño
  asignarDueno(jugador) {
    if (this.puedeComprar()) {
      this.dueno = jugador;
      return true;
    }
    return false;
  }

  // Cálculo básico de renta
  calcularRenta() {
    if (!this.rent) return 0;
    return this.rent.base || 0;
  }

  // Información básica
  getInfo() {
    return {
      id: this.id,
      nombre: this.name,
      tipo: this.type,
      precio: this.price,
      dueno: this.dueno ? this.dueno.nombre : null,
      disponible: this.estaDisponible()
    };
  }

  // ToString básico
  toString() {
    let info = `${this.id} - ${this.name} (${this.type})`;
    if (this.price) info += ` - ${this.price}`;
    if (this.dueno) info += ` - Dueño: ${this.dueno.nombre}`;
    return info;
  }
}

