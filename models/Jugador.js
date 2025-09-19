// =============================
// Clase Jugador
// =============================
class Jugador {
  constructor(nombre, paisNombre, paisCodigo, colorFicha, dineroInicial = 1500, score = 0) {
    this.nombre = nombre;              // Nombre del jugador
    this.paisNombre = paisNombre;      // Nombre del país (ej: Colombia)
    this.paisCodigo = paisCodigo;      // Código del país (ej: CO)
    this.colorFicha = colorFicha;      // Color de la ficha
    this.dinero = dineroInicial;       // Dinero disponible
    this.score = score;                 // Puntuación del jugador
    this.propiedades = []; // lista de propiedades adquiridas
    this.hipotecas = [];   // propiedades hipotecadas
    this.prestamos = [];   // préstamos activos
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
      score: this.score,
      propiedades: this.propiedades.map(p => p.nombre),
      hipotecas: this.hipotecas.map(p => p.nombre),
      prestamos: this.prestamos
    };
  }

  // Comprar propiedad
  comprarPropiedad(propiedad) {
    if (this.dinero >= propiedad.precio && !this.propiedades.includes(propiedad)) {
      this.dinero -= propiedad.precio;
      this.propiedades.push(propiedad);
      propiedad.dueno = this;
      return true;
    }
    return false;
  }

  // Verificar si posee todas las propiedades de un mismo color
  poseeColorCompleto(color) {
    const propiedadesColor = this.propiedades.filter(p => p.color === color);
    return propiedadesColor.length === propiedadesColor[0]?.grupoTotal;
  }

  // Comprar casa u hotel
  comprarCasa(propiedad) {
    if (!this.poseeColorCompleto(propiedad.color)) {
      console.log("No puedes construir, no tienes todas las propiedades de este color.");
      return false;
    }

    if (propiedad.casas < 4 && propiedad.hotel === 0) {
      if (this.dinero >= 100) {
        this.dinero -= 100;
        propiedad.casas += 1;
        return true;
      }
    } else if (propiedad.casas === 4 && propiedad.hotel === 0) {
      if (this.dinero >= 250) {
        this.dinero -= 250;
        propiedad.casas = 0;
        propiedad.hotel = 1;
        return true;
      }
    }
    return false;
  }

  // Modificar dinero
  modificarDinero(monto) {
    this.dinero += monto;
  }

  toJSON() {
    return {
      nombre: this.nombre,
      paisNombre: this.paisNombre,
      paisCodigo: this.paisCodigo,
      colorFicha: this.colorFicha,
      dinero: this.dinero,
      score: this.score,
      propiedades: this.propiedades,
      hipotecas: this.hipotecas,
      prestamos: this.prestamos
    };
  }
}
window.Jugador = Jugador; // Hacer la clase global para otros módulos
