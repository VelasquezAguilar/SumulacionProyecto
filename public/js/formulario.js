
document.querySelector(".save-button").addEventListener("click", function (event) {
    event.preventDefault(); // Evita que el formulario se envíe por defecto

    // Captura los valores del formulario
    const datosFormulario = {
        fecha: document.getElementById("fecha").value,
        producto: document.getElementById("producto").value,
        precio: document.getElementById("precio").value,
        tipoVenta: document.getElementById("tipoVenta").value,
        publicidad: document.getElementById("publicidad").value,
        garantia: document.getElementById("garantia").value,
        descuento: document.getElementById("descuento").value,
        edadSegmento: document.getElementById("edadSegmento").value,
        generoSegmento: document.getElementById("generoSegmento").value,
        pais: document.getElementById("pais").value,
        puntosVenta: document.getElementById("puntosVenta").value,
        canales: document.getElementById("canales").value
    };

    // Valida si todos los campos están llenos
    if (Object.values(datosFormulario).some(value => !value)) {
        alert("Por favor, completa todos los campos antes de guardar.");
        return;
    }

    // Almacena los datos en Local Storage
    localStorage.setItem("registroFormulario", JSON.stringify(datosFormulario));
    
    procesarDatosFormulario();

    enviarDatosAlBackend();
    
    // Confirmación al usuario
    alert("Los datos han sido guardados exitosamente en Local Storage.");

     
});




//////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////// Procesar los dato de  el formulario para enviarlos a la red neurona //////////////////////
// Función para procesar los datos
function procesarDatosFormulario() {
    // Recuperar los datos del LocalStorage
    const datosFormulario = JSON.parse(localStorage.getItem("registroFormulario"));

    if (!datosFormulario) {
        console.error("No hay datos guardados en el LocalStorage.");
        return;
    }

    // Extraer solo el mes de la fecha (formato: YYYY-MM-DD)
    const fecha = datosFormulario.fecha;
    const mes = new Date(fecha).getMonth() + 1; // `getMonth()` devuelve de 0 a 11

    // Eliminar las comas del precio
    //const precio = datosFormulario.precio.replace(/./g, "");

    // Calcular la media de edad según el rango seleccionado
    const edadSegmento = datosFormulario.edadSegmento;
    const calcularMediaEdad = (rango) => {
        switch (rango) {
            case "18-25":
                return 21.5;
            case "26-35":
                return 30.5;
            case "36-45":
                return 40.5;
            case "46-60":
                return 50.5;
            case "60+":
                return 60; // Media aproximada para mayores de 56 años
            default:
                return 1;
        }
    };
    const mediaEdad = calcularMediaEdad(edadSegmento);

    // Crear el objeto procesado
    const datosProcesados = {
        mes: mes,
        producto: datosFormulario.producto,
        precio: datosFormulario.precio,
        tipoVenta: datosFormulario.tipoVenta,
        publicidad: datosFormulario.publicidad,
        garantia: datosFormulario.garantia,
        descuento: datosFormulario.descuento,
        edadMedia: mediaEdad,
        generoSegmento: datosFormulario.generoSegmento,
        pais: datosFormulario.pais,
        puntosVenta: datosFormulario.puntosVenta,
        canales: datosFormulario.canales
    };

    console.log("Datos procesados:", datosProcesados);
    return datosProcesados;
}





//////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////// Procesar los dato de  el formulario para enviarlos a la red neurona //////////////////////
// Enviar los datos procesados al backend
/*async function enviarDatosAlBackend() {
    const datosProcesados = procesarDatosFormulario();

    if (!datosProcesados) {
        console.error("No se pudieron procesar los datos.");
        return;
    }

    try {
        const respuesta = await fetch("/procesar-datos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosProcesados)
        });

        if (respuesta.ok) {
            const resultado = await respuesta.json();
            console.log("Respuesta del backend:", resultado);
            
        } else {
            console.error("Error al enviar datos:", respuesta.statusText);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}*/

async function enviarDatosAlBackend() {

    const datosProcesados = procesarDatosFormulario();
    if (!datosProcesados) {
        console.error("No se pudieron procesar los datos.");
        return;
    }

    try {
        const response = await fetch('/procesar-datos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosProcesados)
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.redirectTo) {
            // Redirigir al usuario a la nueva vista
            window.location.href = data.redirectTo;
        } else {
            console.log('Respuesta del servidor:', data);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}








