export class Propiedad {
    constructor(data) {
        this.id = data.id;
        this.nombre = data.name;
        this.color = data.color;
        this.precio = data.price;
        this.hipoteca = data.mortgage;

        // Renta
        this.rentaBase = data.rent.base;
        this.rentasCasas = data.rent.withHouse; // array [1 casa, 2 casas, 3 casas, 4 casas]
        this.rentaHotel = data.rent.withHotel;

        // Estado de la propiedad
        this.casas = 0;
        this.hotel = false;
        this.dueno = null;
    }

    // Comprar la propiedad (Verificar q no tenga dueñ@)
    comprarPropiedad(jugador) {
        if (this.dueno) {
            console.log(`${this.nombre} ya tiene dueño.`);
            return false;
        }

        if (jugador.dinero < this.precio) {
            console.log(`${jugador.nombre} no tiene suficiente dinero para comprar ${this.nombre}`);
            return false;
        }

        jugador.dinero -= this.precio;
        jugador.propiedades.push(this);
        this.dueno = jugador;

        console.log(`${jugador.nombre} compró la propiedad ${this.nombre}`);
        return true;
    }

    // Obtener la renta actual según casas/hotel 
    getRenta() {
        if (this.hotel) {
            return this.rentaHotel;
        } else if (this.casas > 0) {
            return this.rentasCasas[this.casas - 1];
        } else {
            return this.rentaBase;
        }
    }

    // Comprar una casa 
    comprarCasa(jugador) {
        if (!this.puedeComprarCasa(jugador)) {
            console.log(`${jugador.nombre} no puede comprar casa en ${this.nombre}`);
            return false;
        }

        jugador.dinero -= 100;
        this.casas++;
        console.log(`${jugador.nombre} compró una casa en ${this.nombre} (total casas: ${this.casas})`);
        return true;
    }

    // Verificar si puede comprar casa
    puedeComprarCasa(jugador) {
        if (this.dueno !== jugador) return false; // solo el dueño puede construiirr

        // Debe tener todas las propiedades de este color
        let todasDelColor = true;
        for (let i = 0; i < jugador.propiedades.length; i++) {
            let p = jugador.propiedades[i];
            if (p.color === this.color && p.dueno !== jugador) {
                todasDelColor = false;
            }
        }

        if (this.hotel) return false; // ya tiene hotel
        if (this.casas >= 4) return false; // máximo 4 casas
        if (jugador.dinero < 100) return false; // dinero suficiente

        return todasDelColor;
    }

    // Comprar un hotel
    comprarHotel(jugador) {
        if (!this.puedeComprarHotel(jugador)) {
            console.log(`${jugador.nombre} no puede comprar hotel en ${this.nombre}`);
            return false;
        }

        jugador.dinero -= 250;
        this.casas = 0; // Se reemplazan las 4 casas
        this.hotel = true;
        console.log(`${jugador.nombre} compró un hotel en ${this.nombre}`);
        return true;
    }

    // Verificar si puede comprar hotel
    puedeComprarHotel(jugador) {
        if (this.dueno !== jugador) return false; // Solo el dueño puede construir
        if (this.hotel) return false;
        if (this.casas < 4) return false;
        if (jugador.dinero < 250) return false;
        return true;
    }
    // Propiedad.js
    toString() {
        let duenoNombre = this.dueno ? this.dueno.nombre : "Nadie";
        return `Propiedad ${this.nombre} (${this.color}) | Precio: $${this.precio} | Dueño: ${duenoNombre}`;
    }

}
