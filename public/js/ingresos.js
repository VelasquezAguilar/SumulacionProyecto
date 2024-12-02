// Función para mostrar solo los meses a partir del mes seleccionado
/*function filterTable() {

    const selectedMonth = document.getElementById('monthSelect').value;
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  
    // Encuentra el índice del mes seleccionado
    const startIndex = months.indexOf(selectedMonth);
  
    // Obtiene todas las filas de la tabla
    const table = document.getElementById('incomeTable');
    const rows = table.rows;
  
    // Recorre todas las filas de la tabla
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].cells;
  
      // Ocultar las columnas de los meses no deseados (fuera de los 2 previos y 2 posteriores)
      for (let j = 1; j < cells.length; j++) {
        if (j - 1 < startIndex - 2 || j - 1 > startIndex + 2) {
          cells[j].style.display = 'none'; // Oculta la columna
          toggleOtrosIngresos();
        } else {
          cells[j].style.display = ''; // Muestra la columna
        }
      }
      
    }
  
     // Función para mostrar/ocultar la fila de Otros Ingresos
     function toggleOtrosIngresos() {
        const row = document.getElementById('otrosIngresosRow');
        if (row.style.display === 'none') {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
        filterTable(); // Actualiza la tabla cuando se cambia la visibilidad
    }

    // Llamar a filterTable para aplicar los filtros iniciales
    filterTable();
    // Mostrar también los totales solo para los tres meses seleccionados y los dos siguientes
    const totalVentas = ventasPronosticadas.slice(startIndex - 2, startIndex + 3).reduce((a, b) => a + b, 0);
    const totalEfectivo = ventasEfectivo.slice(startIndex - 2, startIndex + 3).reduce((a, b) => a + b, 0);
    const totalVencimiento1 = vencimientoMes1.slice(startIndex - 2, startIndex + 3).reduce((a, b) => a + b, 0);
    const totalVencimiento2 = vencimientoMes2.slice(startIndex - 2, startIndex + 3).reduce((a, b) => a + b, 0);
  
    // Mostrar los totales
    document.getElementById('total-ventas').innerText = totalVentas;
    document.getElementById('total-efectivo').innerText = totalEfectivo;
    document.getElementById('total-vencimiento1').innerText = totalVencimiento1;
    document.getElementById('total-vencimiento2').innerText = totalVencimiento2;
  }
  */
 // Variables de ventas pronosticadas
/*const ventasPronosticadas = {
    "Enero": 200000,
    "Febrero": 250000,
    "Marzo": 300000,
    "Abril": 350000,
    "Mayo": 400000,
    "Junio": 450000,
    "Julio": 500000,
    "Agosto": 550000,
    "Septiembre": 600000,
    "Octubre": 650000,
    "Noviembre": 700000,
    "Diciembre": 750000
  };
  
  // Función para filtrar los meses de la tabla según el mes seleccionado
  function filterTable() {
    const selectedMonth = document.getElementById('monthSelect').value;
    const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const startIndex = months.indexOf(selectedMonth);
  
    const table = document.getElementById('incomeTable');
    const rows = table.rows;
  
    // Ajusta la visualización de las celdas según el mes seleccionado
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].cells;
  
      // Muestra las celdas correspondientes a los meses seleccionados y oculta las anteriores
      for (let j = 1; j < cells.length - 1; j++) {
        if (j < startIndex + 1) {
          cells[j].style.display = 'none';
        } else {
          cells[j].style.display = '';
        }
      }
    }
  
    // Rellenar los datos de ventas pronosticadas en las celdas
    for (let i = 1; i <= 12; i++) {
      let month = months[i - 1];
      if (months.indexOf(selectedMonth) <= i) {
        table.rows[0].cells[i].innerHTML = ventasPronosticadas[month] || "";
      } else {
        table.rows[0].cells[i].innerHTML = "";
      }
    }
  
    // Lógica para las filas de vencimiento y sumas
    updateVencimientoRows(selectedMonth);
  }
  
  // Función para actualizar las celdas de vencimiento
  function updateVencimientoRows(selectedMonth) {
    const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const startIndex = months.indexOf(selectedMonth);
  
    // Actualizar las filas de vencimiento
    const vencimientoUnMesRow = document.getElementsByTagName("tr")[2];
    const vencimientoDosMesesRow = document.getElementsByTagName("tr")[3];
  
    for (let i = 1; i <= 12; i++) {
      if (i <= startIndex - 1) {
        vencimientoUnMesRow.cells[i].innerHTML = "";
        vencimientoDosMesesRow.cells[i].innerHTML = "";
      } else {
        if (i === startIndex) {
          vencimientoUnMesRow.cells[i].innerHTML = ""; // Vacío para la celda anterior al mes seleccionado
        }
        else if (i === startIndex + 1) {
          vencimientoDosMesesRow.cells[i].innerHTML = ""; // Vacío para la celda a dos meses antes
        } else {
          vencimientoUnMesRow.cells[i].innerHTML = ""; // Se mantiene vacío
        }
      }
    }
  }
  
  // Función para agregar una fila de ingreso (otros ingresos)
  function toggleOtrosIngresos() {
    const otrosIngresosRow = document.getElementById('otrosIngresosRow');
    const tableBody = document.getElementById('incomeTable').getElementsByTagName('tbody')[0];
  
    // Verificar si ya existe una fila de ingreso, para no agregarla más de una vez
    if (!document.getElementById('otrosIngresosInputs')) {
      const newRow = tableBody.insertRow(tableBody.rows.length - 1);
      newRow.id = 'otrosIngresosInputs';
  
      // Crear las celdas para el ingreso
      const cell1 = newRow.insertCell(0);
      const cell2 = newRow.insertCell(1);
      const cell3 = newRow.insertCell(2);
      const cell4 = newRow.insertCell(3);
      const cell5 = newRow.insertCell(4);
      const cell6 = newRow.insertCell(5);
      const cell7 = newRow.insertCell(6);
      const cell8 = newRow.insertCell(7);
      const cell9 = newRow.insertCell(8);
      const cell10 = newRow.insertCell(9);
      const cell11 = newRow.insertCell(10);
      const cell12 = newRow.insertCell(11);
      const cell13 = newRow.insertCell(12);
  
      cell1.innerHTML = `<input type="text" placeholder="Descripción del ingreso">`;
      cell2.innerHTML = `<input type="number" placeholder="0" oninput="updateTotal()"/>`;
      cell3.innerHTML = `<input type="number" placeholder="0" oninput="updateTotal()"/>`;
      cell4.innerHTML = `<input type="number" placeholder="0" oninput="updateTotal()"/>`;
      cell5.innerHTML = `<input type="number" placeholder="0" oninput="updateTotal()"/>`;
      cell6.innerHTML = `<input type="number" placeholder="0" oninput="updateTotal()"/>`;
      cell7.innerHTML = `<input type="number" placeholder="0" oninput="updateTotal()"/>`;
      cell8.innerHTML = `<input type="number" placeholder="0" oninput="updateTotal()"/>`;
      cell9.innerHTML = `<input type="number" placeholder="0" oninput="updateTotal()"/>`;
      cell10.innerHTML = `<input type="number" placeholder="0" oninput="updateTotal()"/>`;
      cell11.innerHTML = `<input type="number" placeholder="0" oninput="updateTotal()"/>`;
      cell12.innerHTML = `<input type="number" placeholder="0" oninput="updateTotal()"/>`;
      cell13.innerHTML = `<input type="number" placeholder="0" oninput="updateTotal()"/>`;
    } else {
      otrosIngresosRow.style.display = 'none'; // Ocultar el botón cuando se muestra la fila
    }
  }
  
  // Función para actualizar los totales
  function updateTotal() {
    const rows = document.getElementById('incomeTable').rows;
    let totalIngresos = 0;
  
    // Sumar todos los valores de los ingresos (en las celdas)
    for (let i = 1; i < rows.length - 1; i++) {
      const row = rows[i];
      for (let j = 1; j <= 12; j++) {
        const cell = row.cells[j];
        const value = parseFloat(cell.querySelector('input') ? cell.querySelector('input').value : 0);
        totalIngresos += value;
      }
    }
  
    // Actualizar la celda total
    document.getElementById('total-ventas').innerHTML = totalIngresos;
    // Puedes agregar más lógica para actualizar los totales específicos como "efectivo" y "vencimientos" si lo deseas.
  }*/
 // Función para filtrar la tabla según el mes seleccionado// Función para mostrar solo los meses a partir del mes seleccionado
/*function filterTable() {
    const selectedMonth = document.getElementById('monthSelect').value;
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  
    // Encuentra el índice del mes seleccionado
    const startIndex = months.indexOf(selectedMonth);
  
    // Obtiene todas las filas de la tabla
    const table = document.getElementById('incomeTable');
    const rows = table.rows;
  
    // Recorre todas las filas de la tabla
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].cells;
  
      // Ocultar los meses antes del mes seleccionado
      for (let j = 1; j < cells.length; j++) {
        if (j <= startIndex) {
          cells[j].style.display = 'none'; // Oculta la columna
        } else {
          cells[j].style.display = ''; // Muestra la columna
        }
      }
    }
  
    // Mostrar también los dos meses anteriores y dos meses posteriores al mes seleccionado
    const monthsToShow = [];
    const monthsCount = months.length;
  
    for (let i = -2; i <= 2; i++) {
      const monthIndex = (startIndex + i + monthsCount) % monthsCount;
      monthsToShow.push(monthIndex);
    }
  
    // Recorre todas las filas y muestra solo los meses seleccionados
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].cells;
  
      for (let j = 1; j < cells.length; j++) {
        if (monthsToShow.includes(j - 1)) {
          cells[j].style.display = ''; // Muestra la columna
        } else {
          cells[j].style.display = 'none'; // Oculta la columna
        }
      }
    }

    
      
  }

  function addIncomeRow() {
    // Obtener la tabla
    const table = document.getElementById('incomeTable');
    
    // Crear una nueva fila
    const newRow = document.createElement('tr');
  
    // Crear la primera celda (OTROS INGRESOS)
    const cellLabel = document.createElement('td');
    cellLabel.textContent = 'Ingreso Adicional';  // Puedes personalizar este texto
    newRow.appendChild(cellLabel);
  
    // Crear inputs para las columnas de los meses (saltando las dos primeras celdas)
    for (let i = 1; i < 13; i++) { // 12 meses, saltamos la columna de texto
      const cell = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '0';
      input.placeholder = '0';
      input.style.width = '80px'; // Ajustar ancho si es necesario
      input.required = true;
  
      cell.appendChild(input);
      newRow.appendChild(cell);
    }
  
    // Insertar la nueva fila antes del botón de "+ Agregar Ingreso"
    const otrosIngresosRow = document.getElementById('indicador');
    table.tBodies[0].insertBefore(newRow, otrosIngresosRow);
  }
  addIncomeRow();
  /*const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  
  function filterTable() {
    const selectedMonth = document.getElementById('monthSelect').value;
    const startIndex = months.indexOf(selectedMonth);
  
    // Control del botón "Agregar Ingreso"
    const addButtonRow = document.getElementById('otrosIngresosRow');
    addButtonRow.style.display = selectedMonth ? '' : 'none';
  
    const table = document.getElementById('incomeTable');
    const rows = table.rows;
  
    // Calcular índices de los meses a mostrar (seleccionado ± 2)
    const monthsToShow = [];
    for (let i = -2; i <= 2; i++) {
      const index = (startIndex + i + 12) % 12;  // Asegura índices circulares
      monthsToShow.push(index);
    }
  
    localStorage.setItem('monthsToShowLength', monthsToShow.length);  // Guardar longitud
  
    // Ocultar/mostrar columnas según la selección
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].cells;
      for (let j = 1; j < cells.length; j++) {
        if (monthsToShow.includes(j - 1)) {
          cells[j].style.display = '';
        } else {
          cells[j].style.display = 'none';
        }
      }
    }
  }
  
  function addIncomeRow() {
    const table = document.getElementById('incomeTable');
    const newRow = document.createElement('tr');
  
    const cellLabel = document.createElement('td');
    const descriptionInput = document.createElement('input');
    descriptionInput.type = 'text';
    descriptionInput.placeholder = 'Descripción del ingreso';
    descriptionInput.required = true;
    cellLabel.appendChild(descriptionInput);
    newRow.appendChild(cellLabel);
  
    const visibleColumns = parseInt(localStorage.getItem('monthsToShowLength'), 10) || 5;
  
    for (let i = 0; i < visibleColumns; i++) {
      const cell = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '0';
      input.placeholder = '0';
      cell.appendChild(input);
      newRow.appendChild(cell);
    }
  
    const indicadorRow = document.getElementById('indicador');
    table.tBodies[0].insertBefore(newRow, indicadorRow);
  }
  
  // Ajuste dinámico del botón
  const table = document.querySelector('table');
  const addButton = document.getElementById('otrosIngresosRows');
  addButton.addEventListener('click', function() {
    const totalColumns = table.rows[0].cells.length;
    const buttonCell = addButton.closest('td');
    buttonCell.setAttribute('colspan', totalColumns);
  });*/
  
/*
function filterTable() {
  const selectedMonth = document.getElementById('monthSelect').value.trim().toLowerCase();
  const indicadorRow = document.getElementById('otrosIngresosRow');

  // Ocultar el botón si no se selecciona un mes válido
  if (selectedMonth === "" || !months.includes(selectedMonth)) {
    indicadorRow.style.display = 'none'; // Ocultar el botón si no se ha seleccionado mes
    return; // Detener la ejecución si no se seleccionó mes
  }

  // Mostrar el botón si se seleccionó un mes válido
  indicadorRow.style.display = '';

  const startIndex = months.indexOf(selectedMonth);

  // Obtener las filas de la tabla
  const table = document.getElementById('incomeTable');
  const rows = table.rows;

  // Mostrar solo los dos meses antes y dos meses después del seleccionado, con excepciones para enero y febrero
  const monthsToShow = [];
  const monthsCount = months.length;

  // Lógica especial para enero y febrero (mostrar noviembre, diciembre, enero, febrero, marzo)
  if (startIndex === 0) { // Si se seleccionó enero
    monthsToShow.push(monthsCount - 2); // Diciembre
    monthsToShow.push(monthsCount - 1); // Noviembre
    monthsToShow.push(startIndex); // Enero
    monthsToShow.push(1); // Febrero
    monthsToShow.push(2); // Marzo
  } else if (startIndex === 1) { // Si se seleccionó febrero
    monthsToShow.push(monthsCount - 1); // Diciembre
    monthsToShow.push(startIndex - 1); // Enero
    monthsToShow.push(startIndex); // Febrero
    monthsToShow.push(2); // Marzo
    monthsToShow.push(3); // Abril
  } else { // Para los demás meses (marzo en adelante)
    for (let i = -2; i <= 2; i++) {
      const monthIndex = (startIndex + i + monthsCount) % monthsCount;
      monthsToShow.push(monthIndex);
    }
  }

  // Guardar el tamaño del arreglo monthsToShow en localStorage
  localStorage.setItem('monthsToShowLength', monthsToShow.length);

  // Recorre todas las filas y muestra solo los meses seleccionados
  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].cells;
    for (let j = 1; j < cells.length; j++) {
      if (monthsToShow.includes(j - 1)) {
        cells[j].style.display = ''; // Muestra la columna
      } else {
        cells[j].style.display = 'none'; // Oculta la columna
      }
    }
  }
}

function addIncomeRow() {
  // Obtener la tabla
  const table = document.getElementById('incomeTable');
  
  // Crear una nueva fila
  const newRow = document.createElement('tr');

  // Crear la primera celda (Descripción de ingreso) con un input de texto
  const cellLabel = document.createElement('td');
  const descriptionInput = document.createElement('input');
  descriptionInput.type = 'text';
  descriptionInput.placeholder = 'Descripción del ingreso';
  descriptionInput.style.width = '150px'; // Ajustar el ancho según sea necesario
  descriptionInput.required = true; // Asegura que el campo no quede vacío

  cellLabel.appendChild(descriptionInput);
  newRow.appendChild(cellLabel);

  const storedLength = parseInt(localStorage.getItem('monthsToShowLength'), 10) || 0;

  // Crear inputs para las columnas de los meses (12 meses)
  for (let i = 0; i < storedLength; i++) { // 12 meses, comenzando de la columna 1 (Enero)
    const cell = document.createElement('td');
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.placeholder = '0';
    input.style.width = '80px'; // Ajustar ancho si es necesario
    input.required = true;

    cell.appendChild(input);
    newRow.appendChild(cell);
  }

  // Insertar la nueva fila antes del botón de "+ Agregar Ingreso"
  const indicadorRow = document.getElementById('indicador');
  table.tBodies[0].insertBefore(newRow, indicadorRow);
}*/
/////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
/*
const months = [
  'enero',
  'febrero', 
  'marzo', 
  'abril', 
  'mayo', 
  'junio', 
  'julio', 
  'agosto', 
  'septiembre', 
  'octubre', 
  'noviembre', 
  'diciembre'];

function filterTable() {
const selectedMonth = document.getElementById('monthSelect').value;

// Mostrar u ocultar el botón de "Agregar Ingreso"
const indicadorRow = document.getElementById('otrosIngresosRow');
if (selectedMonth === "") {
  indicadorRow.style.display = 'none'; // Ocultar el botón si no se ha seleccionado mes
  // Salir de la función si no se seleccionó mes
  //return;
} else {
  indicadorRow.style.display = '';
   // Mostrar el botón si se seleccionó un mes
   
}

const startIndex = months.indexOf(selectedMonth);

// Obtener las filas de la tabla
const table = document.getElementById('incomeTable');
const rows = table.rows;

// Recorre todas las filas de la tabla y oculta los meses antes del mes seleccionado
for (let i = 0; i < rows.length; i++) {
  const cells = rows[i].cells;
  
  for (let j = 1; j < cells.length; j++) {
    if (j <= startIndex) {
      cells[j].style.display = 'none'; // Oculta la columna
    } else {
      cells[j].style.display = ''; // Muestra la columna
    }
  }
}

// Mostrar los dos meses antes y dos meses después del seleccionado
const monthsToShow = [];
const monthsCount = months.length;

for (let i = -2; i <= 2; i++) {
  const monthIndex = (startIndex + i + monthsCount) % monthsCount;
  monthsToShow.push(monthIndex);
}
// Guardar el tamaño del arreglo monthsToShow en localStorage
localStorage.setItem('monthsToShowLength', monthsToShow.length);
// Recorre todas las filas y muestra solo los meses seleccionados
for (let i = 0; i < rows.length; i++) {
  const cells = rows[i].cells;
  for (let j = 1; j < cells.length; j++) {
    if (monthsToShow.includes(j - 1)) {
      cells[j].style.display = ''; // Muestra la columna
    } else {
      cells[j].style.display = 'none'; // Oculta la columna
    }
  }
}
}


function addIncomeRow() {
// Obtener la tabla
const table = document.getElementById('incomeTable');

// Crear una nueva fila
const newRow = document.createElement('tr');

// Crear la primera celda (Descripción de ingreso) con un input de texto
const cellLabel = document.createElement('td');
const descriptionInput = document.createElement('input');
descriptionInput.type = 'text';
descriptionInput.placeholder = 'Descripción del ingreso';
descriptionInput.style.width = '150px'; // Ajustar el ancho según sea necesario
descriptionInput.required = true; // Asegura que el campo no quede vacío

cellLabel.appendChild(descriptionInput);
newRow.appendChild(cellLabel);

const storedLength = parseInt(localStorage.getItem('monthsToShowLength'), 10) || 0;

// Crear inputs para las columnas de los meses (12 meses)
for (let i = 0; i < storedLength  ; i++) { // 12 meses, comenzando de la columna 1 (Enero)
  const cell = document.createElement('td');
  const input = document.createElement('input');
  input.type = 'number';
  input.min = '0';
  input.placeholder = '0';
  input.style.width = '80px'; // Ajustar ancho si es necesario
  input.required = true;

  cell.appendChild(input);
  newRow.appendChild(cell);
}

// Insertar la nueva fila antes del botón de "+ Agregar Ingreso"
const indicadorRow = document.getElementById('indicador');
table.tBodies[0].insertBefore(newRow, indicadorRow);
}
// Ajuste dinámico del botón
const table = document.querySelector('table');
const addButton = document.getElementById('otrosIngresosRows');
addButton.addEventListener('click', function() {
  const totalColumns = table.rows[0].cells.length;
  const buttonCell = addButton.closest('td');
  buttonCell.setAttribute('colspan', totalColumns);
});*/
////////////////////////////////////////////////////
////////////////////////////////////////////////////
const months = [
  'enero',
  'febrero', 
  'marzo', 
  'abril', 
  'mayo', 
  'junio', 
  'julio', 
  'agosto', 
  'septiembre', 
  'octubre', 
  'noviembre', 
  'diciembre'];

function filterTable() {
const selectedMonth = document.getElementById('monthSelect').value.trim().toLowerCase();
const indicadorRow = document.getElementById('otrosIngresosRow');

// Ocultar el botón si no se selecciona un mes válido
if (selectedMonth === "" || !months.includes(selectedMonth)) {
  indicadorRow.style.display = 'none'; // Ocultar el botón si no se ha seleccionado mes
  return; // Detener la ejecución si no se seleccionó mes
}

// Mostrar el botón si se seleccionó un mes válido
indicadorRow.style.display = '';

const startIndex = months.indexOf(selectedMonth);

// Obtener las filas de la tabla
const table = document.getElementById('incomeTable');
const rows = table.rows;

// Mostrar solo los dos meses antes y dos meses después del seleccionado, con excepciones para enero y febrero
const monthsToShow = [];
const monthsCount = months.length;

// Lógica especial para enero y febrero (mostrar noviembre, diciembre, enero, febrero, marzo)
if (startIndex === 0) { // Si se seleccionó enero
  monthsToShow.push(monthsCount - 2); // Diciembre
  monthsToShow.push(monthsCount - 1); // Noviembre
  monthsToShow.push(startIndex); // Enero
  monthsToShow.push(1); // Febrero
  monthsToShow.push(2); // Marzo
} else if (startIndex === 1) { // Si se seleccionó febrero
  monthsToShow.push(monthsCount - 1); // Diciembre
  monthsToShow.push(startIndex - 1); // Enero
  monthsToShow.push(startIndex); // Febrero
  monthsToShow.push(2); // Marzo
  monthsToShow.push(3); // Abril
} else { // Para los demás meses (marzo en adelante)
  for (let i = -2; i <= 2; i++) {
    const monthIndex = (startIndex + i + monthsCount) % monthsCount;
    monthsToShow.push(monthIndex);
  }
}

// Guardar el tamaño del arreglo monthsToShow en localStorage
localStorage.setItem('monthsToShowLength', monthsToShow.length);

// Recorre todas las filas y muestra solo los meses seleccionados
for (let i = 0; i < rows.length; i++) {
  const cells = rows[i].cells;
  for (let j = 1; j < cells.length; j++) {
    if (monthsToShow.includes(j - 1)) {
      cells[j].style.display = ''; // Muestra la columna
    } else {
      cells[j].style.display = 'none'; // Oculta la columna
    }
  }
}

// Ajuste dinámico del botón
const tabler = document.querySelector('table');
const addButton = document.getElementById('boton');
addButton.addEventListener('click', function() {
  const totalColumns = tabler.rows[0].cells.length;
  const buttonCell = addButton.closest('td');
  buttonCell.setAttribute('colspan', totalColumns);
});
}

function addIncomeRow() {
// Obtener la tabla
const table = document.getElementById('incomeTable');

// Crear una nueva fila
const newRow = document.createElement('tr');

// Crear la primera celda (Descripción de ingreso) con un input de texto
const cellLabel = document.createElement('td');
const descriptionInput = document.createElement('input');
descriptionInput.type = 'text';
descriptionInput.placeholder = 'Descripción del ingreso';
descriptionInput.style.width = '150px'; // Ajustar el ancho según sea necesario
descriptionInput.required = true; // Asegura que el campo no quede vacío

cellLabel.appendChild(descriptionInput);
newRow.appendChild(cellLabel);

const storedLength = parseInt(localStorage.getItem('monthsToShowLength'), 10) || 0;

// Crear inputs para las columnas de los meses (12 meses)
for (let i = 0; i < storedLength; i++) { // 12 meses, comenzando de la columna 1 (Enero)
  const cell = document.createElement('td');
  const input = document.createElement('input');
  input.type = 'number';
  input.min = '0';
  input.placeholder = '0';
  input.style.width = '80px'; // Ajustar ancho si es necesario
  input.required = true;

  cell.appendChild(input);
  newRow.appendChild(cell);
}



// Insertar la nueva fila antes del botón de "+ Agregar Ingreso"
const indicadorRow = document.getElementById('indicador');
table.tBodies[0].insertBefore(newRow, indicadorRow);
}
/*// Ajuste dinámico del botón
const table = document.querySelector('table');
const addButton = document.getElementById('boton');
addButton.addEventListener('click', function() {
  const totalColumns = table.rows[0].cells.length;
  const buttonCell = addButton.closest('td');
  buttonCell.setAttribute('colspan', totalColumns);
});*/