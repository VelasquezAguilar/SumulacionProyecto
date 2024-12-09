// Recuperar los meses, ingresos, egresos, datosTabla y flujoNeto del localStorage
const meses = JSON.parse(localStorage.getItem('mesesActualPrediccion')) || [];
const ingresos = JSON.parse(localStorage.getItem('totalesTabla')) || {};
const egresos = JSON.parse(localStorage.getItem('totalesTablaCompra')) || {};
const datosTabla = JSON.parse(localStorage.getItem('datosTabla')) || [];
const flujoNeto = JSON.parse(localStorage.getItem('flujoNeto')) || {};

// Filtrar los meses que empiezan desde el índice 2
const mesesFiltrados = meses.slice(2); // Desde el índice 2 en adelante

// Nombres completos para las filas
const nombresFilas = {
    "TI": "Total Ingresos",
    "TE": "Total Egresos",
    "FNE": "Flujo neto de efectivo (FNE)",
    "EI": "Efectivo Inicial",
    "EF": "Efectivo Final",
    "SME": "Saldo mínimo de efectivo",
    "F": "Financiamiento",
    "ISM": "Ingreso Saldo mínimo"
};

// Crear objeto para flujoNeto si no existe
let flujoNetoCalculado = flujoNeto;
const headerRow = document.querySelector('thead tr');

// Crear objeto para flujoNeto si no existe

// Renderizar los meses en el encabezado
headerRow.innerHTML = "<th>MES</th>";
mesesFiltrados.forEach(month => {
    const th = document.createElement("th");
    th.textContent = month;
    headerRow.appendChild(th);
});
// Crear las filas de la tabla
const tbody = document.querySelector('tbody');

// Función para crear una fila
function crearFila(clase, datos, esFne = false) {
    const row = document.createElement("tr");
    row.classList.add(clase);
    
    const td = document.createElement("td");
    td.textContent = nombresFilas[clase]; // Nombre completo de la fila
    row.appendChild(td);
    
    mesesFiltrados.forEach((month, index) => {
        const td = document.createElement("td");
        
        let valor = datos[`columna${index + 2}`] || "0"; // Obtener el valor correspondiente
        if (esFne) {
            // Para la fila de FNE, restamos Ingresos - Egresos
            const ingreso = parseFloat(ingresos[`columna${index + 2}`]) || 0;
            const egreso = parseFloat(egresos[`columna${index + 2}`]) || 0;
            valor = (ingreso - egreso).toFixed(2);
            
            // Si el valor es negativo, añadir clase 'perdida'
            if (parseFloat(valor) < 0) {
                td.classList.add('perdida');
            }
            
            // Guardar el resultado de FNE en el objeto flujoNeto
            flujoNetoCalculado[month] = valor;
        }
        
        td.textContent = valor;
        row.appendChild(td);
    });
    return row;
}

// Crear las filas de "Total Ingresos", "Total Egresos" y FNE
tbody.appendChild(crearFila('TI', ingresos));
tbody.appendChild(crearFila('TE', egresos));
tbody.appendChild(crearFila('FNE', {}, true));

/// Clave para almacenar los datos de Efectivo Final en localStorage
const EFKey = "efectivoFinal";
let efectivoFinalValores = JSON.parse(localStorage.getItem(EFKey)) || Array(mesesFiltrados.length).fill(0);

// Función para guardar Efectivo Final en localStorage
function guardarEfectivoFinal() {
    localStorage.setItem(EFKey, JSON.stringify(efectivoFinalValores));
}

// Inicialización de las filas de Efectivo Inicial y Efectivo Final
const efectivoInicialRow = document.createElement("tr");
efectivoInicialRow.classList.add("EI");
const tdEfectivoInicial = document.createElement("td");
tdEfectivoInicial.textContent = "Efectivo Inicial";
efectivoInicialRow.appendChild(tdEfectivoInicial);

const efectivoFinalRow = document.createElement("tr");
efectivoFinalRow.classList.add("EF");
const tdEfectivoFinal = document.createElement("td");
tdEfectivoFinal.textContent = "Efectivo Final";
efectivoFinalRow.appendChild(tdEfectivoFinal);

let valorEfectivoInicial = 35127.01; // Valor inicial para el primer mes

// Crear celdas para EI y EF dinámicamente
mesesFiltrados.forEach((month, index) => {
    const flujoNetoValor = parseFloat(flujoNetoCalculado[month]) || 0;

    // Calcular la celda actual de EF
    const nuevoEfectivoFinal = flujoNetoValor + valorEfectivoInicial;

    // Guardar el valor en el array
    efectivoFinalValores[index] = nuevoEfectivoFinal;

    // Crear celda para EI (Efectivo Inicial)
    const tdEI = document.createElement("td");
    tdEI.textContent = valorEfectivoInicial.toFixed(2);
    efectivoInicialRow.appendChild(tdEI);

    // Crear celda para EF (Efectivo Final)
    const tdEF = document.createElement("td");
    tdEF.textContent = nuevoEfectivoFinal.toFixed(2);
    efectivoFinalRow.appendChild(tdEF);

    // Actualizar valores para la siguiente iteración
    valorEfectivoInicial = nuevoEfectivoFinal; // El EF actual será el EI de la próxima columna
});

// Guardar valores en localStorage después de la iteración
guardarEfectivoFinal();

// Agregar las filas al cuerpo de la tabla
tbody.appendChild(efectivoInicialRow);
tbody.appendChild(efectivoFinalRow);

// Función para cargar Efectivo Final desde localStorage
function cargarEfectivoFinal() {
    efectivoFinalValores = JSON.parse(localStorage.getItem(EFKey)) || Array(mesesFiltrados.length).fill(0);

    const EFCells = efectivoFinalRow.querySelectorAll("td:not(:first-child)");
    efectivoFinalValores.forEach((valor, index) => {
        if (EFCells[index]) {
            EFCells[index].textContent = valor.toFixed(2);
        }
    });
}


// Claves para localStorage
//const EFKey = "efectivoFinal";
const SMEKey = "saldoMinimo";

// Inicializar valores de efectivo final y saldo mínimo
//let efectivoFinalValores = JSON.parse(localStorage.getItem(EFKey)) || Array(mesesFiltrados.length).fill(0);
let saldoMinimoValores = JSON.parse(localStorage.getItem(SMEKey)) || Array(mesesFiltrados.length).fill(5000); // Valor por defecto de SME

// Función para guardar Saldo Mínimo en localStorage
function guardarSaldoMinimo() {
    localStorage.setItem(SMEKey, JSON.stringify(saldoMinimoValores));
}

// Función para actualizar ISM y F dinámicamente
function actualizarISMFinanciamiento() {
    const ISMCells = ingresoSaldoMinimoRow.querySelectorAll("td:not(:first-child)");
    const FCells = financiamientoRow.querySelectorAll("td:not(:first-child)");

    efectivoFinalValores.forEach((efectivoFinal, index) => {
        const saldoMinimo = saldoMinimoValores[index];
        const diferencia = efectivoFinal - saldoMinimo;

        if (diferencia >= 0) {
            // Si EF >= SME, insertar en ISM
            ISMCells[index].textContent = diferencia.toFixed(2);
            FCells[index].textContent = ""; // Vaciar celda de Financiamiento
        } else {
            // Si EF < SME, insertar en F
            ISMCells[index].textContent = ""; // Vaciar celda de ISM
            FCells[index].textContent = Math.abs(diferencia).toFixed(2); // Valor absoluto para Financiamiento
        }
    });
}

// Crear las filas necesarias
const saldoMinimoRow = document.createElement("tr");
saldoMinimoRow.classList.add("SME");
const tdSaldoMinimo = document.createElement("td");
tdSaldoMinimo.textContent = "Saldo mínimo de efectivo";
saldoMinimoRow.appendChild(tdSaldoMinimo);

const financiamientoRow = document.createElement("tr");
financiamientoRow.classList.add("F");
const tdFinanciamiento = document.createElement("td");
tdFinanciamiento.textContent = "Financiamiento";
financiamientoRow.appendChild(tdFinanciamiento);

const ingresoSaldoMinimoRow = document.createElement("tr");
ingresoSaldoMinimoRow.classList.add("ISM");
const tdIngresoSaldoMinimo = document.createElement("td");
tdIngresoSaldoMinimo.textContent = "Ingreso Saldo Mínimo";
ingresoSaldoMinimoRow.appendChild(tdIngresoSaldoMinimo);

// Crear celdas dinámicas para SME, ISM, y F
mesesFiltrados.forEach((month, index) => {
    const tdSME = document.createElement("td");
    const inputSME = document.createElement("input");
    inputSME.type = "number";
    inputSME.placeholder = saldoMinimoValores[index].toFixed(2); // Placeholder con el valor guardado
    inputSME.value = saldoMinimoValores[index].toFixed(2);
    inputSME.addEventListener("input", (e) => {
        saldoMinimoValores[index] = parseFloat(e.target.value) || 5000; // Actualizar valor de SME
        guardarSaldoMinimo(); // Guardar en localStorage
        actualizarISMFinanciamiento(); // Actualizar ISM y F
    });
    tdSME.appendChild(inputSME);
    saldoMinimoRow.appendChild(tdSME);

    const tdF = document.createElement("td");
    financiamientoRow.appendChild(tdF);

    const tdISM = document.createElement("td");
    ingresoSaldoMinimoRow.appendChild(tdISM);
});

// Agregar las filas al cuerpo de la tabla
tbody.appendChild(saldoMinimoRow);
tbody.appendChild(financiamientoRow);
tbody.appendChild(ingresoSaldoMinimoRow);

// Llamar a la función inicial para actualizar ISM y F al cargar la tabla
actualizarISMFinanciamiento();




// Guardar flujoNeto actualizado en el localStorage
localStorage.setItem('flujoNeto', JSON.stringify(flujoNetoCalculado));

// Agregar botones al contenedor
const buttonContainer = document.querySelector(".button-container");
buttonContainer.innerHTML = `
    <button>Generar Reporte</button>
    <button>Finalizar</button>
`;
