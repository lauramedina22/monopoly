// Casilla.js
export class Casilla {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type; // "property", "railroad", "tax", "chance", "community_chest", "special"

    // Estado común
    this.dueno = null; // Por defecto, ninguna casilla tiene dueño
  }

  toString() {
    let info = `${this.id} - ${this.name} (${this.type})`;
    if (this.dueno) info += ` - Dueño: ${this.dueno.nombre}`;
    return info;
  }
}
        