//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////// Función para inicializar la tabla con datos desde localStorage///////////////////////////////
function inicializarTablaDesdeLocalStorage() {
  const table = document.querySelector('.income-table');
  const datosTabla = JSON.parse(localStorage.getItem('datosOtrosIngresos')) || [];

  datosTabla.forEach(fila => {
    const newRow = document.createElement('tr');
    newRow.classList.add('OTROS');

    // Crear celda para la descripción
    const cellLabel = document.createElement('td');
    const descriptionInput = document.createElement('input');
    descriptionInput.type = 'text';
    descriptionInput.value = fila.descripcion || '';
    descriptionInput.style.width = '150px';
    descriptionInput.required = true;
    descriptionInput.addEventListener('input', () => actualizarLocalStorage());
    cellLabel.appendChild(descriptionInput);
    newRow.appendChild(cellLabel);

    // Crear celdas para los meses
    fila.valores.forEach(valor => {
      const cell = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'float';
      input.value = valor || '';
      input.placeholder = '0';
      input.style.width = '100px';
      input.required = false;
      input.addEventListener('input', () => actualizarLocalStorage());
      cell.appendChild(input);
      newRow.appendChild(cell);
    });

    // Insertar la nueva fila antes de la fila "OTROS INGRESOS"
    const lastRow = table.querySelector('tbody tr:last-child');
    table.tBodies[0].insertBefore(newRow, lastRow);
  });
}




//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////// Función para guardar los datos de la tabla en localStorage///////////////////////////////

function actualizarLocalStorage() {
  const table = document.querySelector('.income-table');
  const rows = table.querySelectorAll('tbody tr.OTROS');

  const datosTabla = Array.from(rows).map(row => {
    const inputs = row.querySelectorAll('input');
    const descripcion = inputs[0].value; // El primer input es la descripción
    const valores = Array.from(inputs).slice(1).map(input => parseFloat(input.value) || 0); // Resto de inputs

    return { descripcion, valores };
  });

  localStorage.setItem('datosOtrosIngresos', JSON.stringify(datosTabla));
  actualizarTotalesDesdeLocalStorage();
}



// Función para agregar una nueva fila
function addIncomeRow() {
  const table = document.querySelector('.income-table');
  const headerCells = table.querySelectorAll('thead tr th');
  const storedLength = headerCells.length - 1; // Número de columnas (menos la primera)

  // Crear nueva fila
  const newRow = document.createElement('tr');
  newRow.classList.add('OTROS');

  // Crear celda para la descripción
  const cellLabel = document.createElement('td');
  const descriptionInput = document.createElement('input');
  descriptionInput.type = 'text';
  descriptionInput.placeholder = 'Descripción del ingreso';
  descriptionInput.style.width = '150px';
  descriptionInput.required = true;
  descriptionInput.addEventListener('input', () => actualizarLocalStorage());
  cellLabel.appendChild(descriptionInput);
  newRow.appendChild(cellLabel);

  // Crear celdas para los meses
  for (let i = 0; i < storedLength; i++) {
    const cell = document.createElement('td');
    const input = document.createElement('input');
    input.type = 'float';
    input.placeholder = '0';
    input.style.width = '100px';
    input.required = false;
    input.addEventListener('input', () => actualizarLocalStorage());
    cell.appendChild(input);
    newRow.appendChild(cell);
  }

  // Insertar la nueva fila antes de la fila "OTROS INGRESOS"
  const lastRow = table.querySelector('tbody tr:last-child');
  table.tBodies[0].insertBefore(newRow, lastRow);

  // Actualizar el almacenamiento local
  actualizarLocalStorage();
  actualizarTotalesDesdeLocalStorage();

}

// Inicializar la tabla al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  inicializarTablaDesdeLocalStorage();
});




////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////


// Función para cargar los datos desde la API
async function loadPredictions() {
  try {
    const response = await fetch("/obtenerVentasPronosticadas");

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Datos recibidos:", data); // Verifica los datos que llegan

    // Verificar si los datos contienen las claves y valores esperados
    if (typeof data !== 'object' || Object.keys(data).length === 0) {
      console.error("Los datos no tienen la estructura esperada:", data);
      return; // Detener la ejecución si los datos no son válidos
    }

    renderTable(data); // Solo renderizar si los datos son válidos
  } catch (error) {
    console.error("Error al cargar predicciones:", error);
  }
}


// Función para renderizar los datos en la tabla
function renderTable(data) {
  const monthNames = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  // Verificar existencia de la tabla
  const headerRow = document.querySelector(".income-table thead tr");
  const forecastRow = document.querySelector(".income-table tbody tr:nth-child(1)");

  if (!headerRow || !forecastRow) {
    console.error("La estructura de la tabla no está correctamente definida.");
    return;
  }

 // Renderizar encabezado
headerRow.innerHTML = "<th>MESES</th>";
const mesesEncabezado = []; // Arreglo para almacenar los meses

Object.keys(data).forEach(month => {
    const th = document.createElement("th");
    th.textContent = monthNames[parseInt(month)];
    headerRow.appendChild(th);

    // Agregar el mes al arreglo
    mesesEncabezado.push(monthNames[parseInt(month)]);
});

// Guardar los meses en el localStorage
localStorage.setItem('mesesActualPrediccion', JSON.stringify(mesesEncabezado));


  // Renderizar fila de pronósticos
  forecastRow.innerHTML = "<td>Ventas Pronosticadas</td>";
  Object.values(data).forEach(sale => {
    const td = document.createElement("td");
    td.textContent = !isNaN(sale) ? sale.toFixed(2) : "N/A";
    td.dataset.value = sale;
    forecastRow.appendChild(td);
  });
}


document.addEventListener("DOMContentLoaded", () => {
  const table = document.querySelector(".income-table");
  if (!table) {
    console.error("La tabla no existe en el DOM.");
    return;
  }

  loadPredictions(); // Cargar datos desde la API


  setTimeout(updateCashRow, 500); //ejectur la funcion de vaores de porcentajes de los tipos de vneta
});

function updateCashRow() {
  const forecastRow = document.querySelector(".income-table tbody tr:nth-child(1)"); // Ventas Pronosticadas
  const cashRow = document.querySelector(".income-table tbody tr:nth-child(2)"); // Ventas en efectivo
  const oneMonthRow = document.querySelector(".income-table tbody tr:nth-child(3)"); // Vencimiento a 1 mes
  const twoMonthRow = document.querySelector(".income-table tbody tr:nth-child(4)"); //vencimneto a 2 meses

  if (!forecastRow || !cashRow || !oneMonthRow || !twoMonthRow) {
    console.error("No se encontraron las filas necesarias para actualizar.");
    return;
  }

  // Obtener el porcentaje de la primera celda de "Ventas en efectivo"
  const cashInput = cashRow.querySelector("input.cash-percentage");
  if (!cashInput) {
    console.error("No se encontró el input de porcentaje en la fila 'Ventas en efectivo'.");
    return;
  }

  const percentage = parseFloat(cashInput.value) / 100;
  if (isNaN(percentage)) {
    console.error("El valor ingresado no es un número válido.");
    return;
  }

  // Obtener el porcentaje de la primera celda de "Ventas vencimento a un mes "
  const cashInput2 = oneMonthRow.querySelector("input.one-month-percentage");
  if (!cashInput2) {
    console.error("No se encontró el input de porcentaje en la fila 'Ventas vencimiento 1 mes'.");
    return;
  }

  const porcentage2 = parseFloat(cashInput2.value) / 100;
  if (isNaN(porcentage2)) {
    console.error("El valor ingresado no es un número válido.");
    return;
  }

  //Obtener el porcentaje de la seugunda celda de "ventas vencimento a dos meses"
  const cashInput3 = twoMonthRow.querySelector("input.two-months-percentage");
  if (!cashInput3) {
    console.error("No se encontró el input de porcentaje en la fila 'Ventas vencimineto a dos meses'.");
    return;
  }

  const porcentage3 = parseFloat(cashInput3.value) / 100;
  if (isNaN(porcentage3)) {
    console.log("El valor ingresado no es un numero valido")
    return;
  }

  // Iterar sobre las celdas de "Ventas Pronosticadas" y calcular valores
  Array.from(forecastRow.querySelectorAll("td")).forEach((cell, index) => {
    if (index === 0) return; // Saltar la primera celda (etiqueta)

    const forecastValue = parseFloat(cell.dataset.value); // Obtener valor pronosticado
    if (isNaN(forecastValue)) return;

    // Asegurarse de que las filas de "Ventas en efectivo" , "Vencimiento a 1 mes"  y "vencimiento a 2 mess" tengan suficientes celdas
    while (cashRow.cells.length <= index) {
      cashRow.insertCell();
    }

    while (oneMonthRow.cells.length <= index) {
      oneMonthRow.insertCell();
    }

    while (twoMonthRow.cells.length <= index) {
      twoMonthRow.insertCell();
    }

    // Calcular el valor para la celda correspondiente
    const cashValue = forecastValue * percentage;
    const targetCell = cashRow.cells[index];
    targetCell.textContent = cashValue.toFixed(2); // Mostrar el valor calculado
    targetCell.dataset.value = cashValue; // Guardar el valor en el atributo data-value

    // Calcular el valor para "Vencimiento a 1 mes"
    if (index === 1) {
      // Para el primer mes (no se multiplica, se toma el valor directamente)
      oneMonthRow.cells[index].textContent = '---------'; // Se toma el valor directamente
    } else {
      // Para los meses siguientes, tomar el valor del mes anterior y multiplicar
      const prevMonthSale = parseFloat(forecastRow.cells[index - 1].dataset.value);
      //oneMonthRow.cells[index].textContent = (prevMonthSale * porcentage2).toFixed(2);
      const cashValue2 = prevMonthSale * porcentage2;
      const targetCell2 = oneMonthRow.cells[index];
      targetCell2.textContent = cashValue2.toFixed(2); // Mostrar el valor calculado
      targetCell2.dataset.value = cashValue2; // Guardar el valor en el atributo data-value
    };


    //calcular el valor para "Vencimiento a dos meses"
    if (index === 1 || index === 2) {
      // Para el primer mes (no se multiplica, se toma el valor directamente)
      twoMonthRow.cells[index].textContent = '---------'; // Se toma el valor directamente
    } else {
      // Para los meses siguientes, tomar el valor del mes anterior y multiplicar
      const prevMonthSale3 = parseFloat(forecastRow.cells[index - 2].dataset.value);
      //twoMonthRow.cells[index].textContent = (prevMonthSale2 * porcentage3).toFixed(2);
      const cashValue3 = prevMonthSale3 * porcentage3;
      const targetCell3 = twoMonthRow.cells[index];
      targetCell3.textContent = cashValue3.toFixed(2); // Mostrar el valor calculado
      targetCell3.dataset.value = cashValue3; // Guardar el valor en el atributo data-value
    };

    guardarDatosEnLocalStorage();
    actualizarTotalesDesdeLocalStorage();
    // Llamada a la función
    let celdasConTotal = obtenerTDCeldasTotal();
    console.log(celdasConTotal);
  });




  function obtenerTDCeldasTotal() {
    // Seleccionar todas las filas con la clase "total"
    let filasTotal = document.querySelectorAll('tr.total');

    // Crear un arreglo para almacenar los datos de las celdas
    let celdasTotal = [];

    // Recorrer todas las filas con la clase "total"
    filasTotal.forEach(fila => {
      // Obtener todas las celdas (td) de la fila
      let celdas = fila.querySelectorAll('td');

      // Almacenar los valores de las celdas en el arreglo
      celdas.forEach(celda => {
        celdasTotal.push(celda.textContent.trim()); // Se obtiene el texto y se elimina el espacio extra
      });
    });

    // Retornar el arreglo con los valores de las celdas
    return celdasTotal;
  }



 
  
  
} function actualizarTotalesDesdeLocalStorage() {
  // Obtener los datos almacenados en localStorage
  let datosTabla = JSON.parse(localStorage.getItem('datosTabla')) || [];
  let datosOtrosIngresos = JSON.parse(localStorage.getItem('datosOtrosIngresos')) || [];

  // Verificar si hay datos
  if (!Array.isArray(datosTabla) || datosTabla.length === 0) {
    console.warn('No hay datos válidos en localStorage para "datosTabla".');
  }

  if (!Array.isArray(datosOtrosIngresos)) {
    console.warn('No hay datos válidos en localStorage para "datosOtrosIngresos".');
    datosOtrosIngresos = [];
  }

  // Seleccionar la fila con clase "total"
  let filaTotal = document.querySelector('tr.total');

  if (!filaTotal) {
    console.error('No se encontró la fila con clase "total".');
    return;
  }
   // Crear un objeto para almacenar los totales
   let totales = {};
  // Obtener todas las celdas de la fila "total"
  let celdasTotal = filaTotal.querySelectorAll('td');

  // Iterar sobre las columnas 2 a 6 (índices 1 a 5 en datosTabla)
  for (let colIndex = 2; colIndex <= 6; colIndex++) {
    let sumaColumna = 0;

    // Sumar los valores de la columna correspondiente en todos los objetos de datosTabla
    datosTabla.forEach(obj => {
      let valor = parseFloat(obj[`columna${colIndex}`]) || 0; // Convertir a número o asignar 0
      sumaColumna += valor;
    });

    // Sumar el primer valor del arreglo `valores` de cada objeto en datosOtrosIngresos
    datosOtrosIngresos.forEach(obj => {
      if (obj.valores && Array.isArray(obj.valores) && obj.valores.length >= (colIndex - 1)) {
        let valorOtroIngreso = parseFloat(obj.valores[colIndex - 2]) || 0; // Restar 2 porque las columnas empiezan en índice 2
        sumaColumna += valorOtroIngreso;
      }
    });

    // Insertar el valor calculado en el TD correspondiente
    if (celdasTotal[colIndex - 1]) { // Restar 1 para obtener el índice en celdasTotal
      celdasTotal[colIndex - 1].textContent = sumaColumna.toFixed(2); // Formatear a 2 decimales
    } else {
      console.warn(`No se encontró la celda para la columna ${colIndex}.`);
    }
    // Guardar el total en el objeto de totales
    totales[`columna${colIndex}`] = sumaColumna.toFixed(2);
  }

  // Guardar el objeto totales en localStorage
  localStorage.setItem('totalesTabla', JSON.stringify(totales));
}







////////////////////////////////////////////////////////////////////////
document.addEventListener("input", (event) => {
  if (event.target.classList.contains("cash-percentage") ||
    event.target.classList.contains("one-month-percentage") ||
    event.target.classList.contains("two-months-percentage")) {
    //updateRemainingPercentage(); // Recalcular los porcentajes restantes

    updateCashRow();

  }
});

function updateRemainingPercentage() {
  const cashPercentage = parseFloat(document.querySelector(".cash-percentage").value) || 0;
  const oneMonthPercentage = parseFloat(document.querySelector(".one-month-percentage").value) || 0;
  const twoMonthPercentage = parseFloat(document.querySelector(".two-months-percentage").value) || 0;

  const remainingPercentage = 100 - (cashPercentage + oneMonthPercentage);

  if (remainingPercentage >= 0) {
    // Asignar automáticamente el porcentaje restante a "vencimiento a 2 meses"
    document.querySelector(".one-months-percentage").value = parseInt(oneMonthPercentage);
    document.querySelector(".cash-percentage").value = parseInt(cashPercentage);
    document.querySelector(".two-months-percentage").value = remainingPercentage;
    document.getElementById("errorMessage").style.display = "none"; // Ocultar mensaje de error
    updateCashRow();
  } else {
    // Mostrar mensaje de error si los porcentajes suman más de 100
    document.getElementById("errorMessage").style.display = "block";
  }


}

// Función para recalcular la suma





/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////Funcion para obtenr los datos de las filas de ventas /////////////////////////////////

function guardarDatosEnLocalStorage() {
  // Crear un arreglo para almacenar las filas formateadas
  let datos = [];

  // Seleccionar todas las filas con las clases VE, VV1M, VV2M y OTROS
  let filas = document.querySelectorAll("table tbody tr.VE, table tbody tr.VV1M, table tbody tr.VV2M");

  // Recorrer todas las filas seleccionadas
  filas.forEach(fila => {
    // Obtener todas las celdas (td) de la fila
    let celdas = fila.querySelectorAll('td');

    // Crear un objeto para almacenar los valores de cada fila
    let filaDatos = {};

    // Recorrer todas las celdas y almacenar sus valores en el objeto
    // Recorrer todas las celdas y almacenar sus valores en el objeto
    celdas.forEach((celda, index) => {
      // Si la celda contiene un input, obtenemos el valor del input, de lo contrario, obtenemos el textContent
      if (celda.querySelector('input')) {
        // Si la celda tiene un input, obtenemos el valor del input
        filaDatos[`columna${index + 1}`] = celda.querySelector('input').value.trim();
      } else {
        // De lo contrario, obtenemos el textContent de la celda
        filaDatos[`columna${index + 1}`] = celda.textContent.trim();
      }
    });

    // Agregar el objeto de la fila al arreglo de datos
    datos.push(filaDatos);
  });

  // Convertir el arreglo de datos a JSON
  let datosJSON = JSON.stringify(datos);

  // Guardar los datos en localStorage
  localStorage.setItem('datosTabla', datosJSON);

  // Confirmación en consola
  console.log("Datos guardados en localStorage:", datosJSON);
}

// Llamada a la función
guardarDatosEnLocalStorage();

