class Casilla {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;

    // Opcional: color de propiedad
    this.color = data.color || null;

    // Si es propiedad, almacena precio, hipoteca y renta
    this.price = data.price || null;
    this.mortgage = data.mortgage || null;
    this.rent = data.rent || null;

    // Si es casilla de acción (chance, comunidad, impuestos, etc.)
    this.action = data.action || null;

    // Descripción en chance o comunidad
    this.description = data.description || null;
  }

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

  toString() {
    return `${this.id} - ${this.name} (${this.type})` + 
           (this.price ? ` - $${this.price}` : "");
  }
}

export default Casilla;
