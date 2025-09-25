export class RailRoad { 
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

}