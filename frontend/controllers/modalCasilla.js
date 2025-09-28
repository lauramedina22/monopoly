import { mostrarToast } from "../controllers/toast.js";
import { Propiedad } from "../models/Propiedad.js";
import { Ferrocarril } from "../models/Ferrocarril.js";

function mostrarModalCasilla(casilla, jugador, turnoActual = false) {
    // Actualizar datos del modal
    document.getElementById("casillaNombre").textContent = casilla.name;
    document.getElementById("casillaPrecio").textContent = casilla.price || "-";
    document.getElementById("casillaPropietario").textContent = casilla.dueno ? casilla.dueno.nombre : "Libre";
    document.getElementById("casillaCasas").textContent = casilla.casas || 0;
    document.getElementById("casillaHotel").textContent = casilla.hotel ? "Sí" : "No";

    // Referencias a botones
    const btnComprarPropiedad = document.getElementById("btnComprarPropiedad");
    const btnComprarCasa = document.getElementById("btnComprarCasa");
    const btnComprarHotel = document.getElementById("btnComprarHotel");
    const btnHipotecar = document.getElementById("btnHipotecar");
    const btnPagarRenta = document.getElementById("btnPagarRenta");

    // Ocultar todos los botones por defecto
    btnComprarPropiedad.style.display = "none";
    btnComprarCasa.style.display = "none";
    btnComprarHotel.style.display = "none";
    btnHipotecar.style.display = "none";
    btnPagarRenta.style.display = "none";

    if (!casilla.dueno) {
        // Casilla libre → mostrar comprar propiedad
        btnComprarPropiedad.style.display = "inline-block";
        btnComprarPropiedad.onclick = () => {
            if (casilla.comprarPropiedad(jugador)) {
                mostrarToast(`${jugador.nombre} compró ${casilla.name}`);
                const modalInstance = bootstrap.Modal.getInstance(document.getElementById("modalInfoCasilla"));
                if (modalInstance) modalInstance.hide();
            } else {
                mostrarToast(`${jugador.nombre} no puede comprar ${casilla.name}`);
            }
        };
    } else if (casilla.dueno === jugador) {
        // Propiedad del jugador
        if (!turnoActual) {
            // Mostrar botones de casas y hoteles solo si no está hipotecada
            if (!casilla.hipotecada) {
                if (casilla.puedeComprarCasa(jugador)) {
                    btnComprarCasa.style.display = "inline-block";
                    btnComprarCasa.onclick = () => {
                        if (casilla.comprarCasa(jugador)) {
                            mostrarToast(`${jugador.nombre} compró una casa en ${casilla.name}`);
                        } else {
                            mostrarToast(`${jugador.nombre} no puede comprar casa en ${casilla.name}`);
                        }
                        mostrarModalCasilla(casilla, jugador);
                    };
                }

                if (casilla.puedeComprarHotel(jugador)) {
                    btnComprarHotel.style.display = "inline-block";
                    btnComprarHotel.onclick = () => {
                        if (casilla.comprarHotel(jugador)) {
                            mostrarToast(`${jugador.nombre} compró un hotel en ${casilla.name}`);
                        } else {
                            mostrarToast(`${jugador.nombre} no puede comprar hotel en ${casilla.name}`);
                        }
                        mostrarModalCasilla(casilla, jugador);
                    };
                }
            }

            // Hipotecar/deshipotecar siempre visible
            btnHipotecar.style.display = "inline-block";
            btnHipotecar.textContent = casilla.hipotecada ? "Deshipotecar" : "Hipotecar";
            btnHipotecar.onclick = () => {
                if (casilla.hipotecada) {
                    casilla.deshipotecar(jugador);
                } else {
                    casilla.hipotecar(jugador);
                }
                mostrarModalCasilla(casilla, jugador);
            };
        }
    } else {

        mostrarToast("No ocurre nada especial");


    }

    // Mostrar modal sin crear backdrops extra
    const modalElement = document.getElementById("modalInfoCasilla");
    let modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (!modalInstance) modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();

}
export { mostrarModalCasilla };
