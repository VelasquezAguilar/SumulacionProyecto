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

  // Obtener la longitud almacenada de los meses (si no hay, por defecto 12 meses)
  const storedLength = 5;

  // Crear inputs para las columnas de los meses (según la longitud almacenada)
  for (let i = 0; i < storedLength; i++) { 
    const cell = document.createElement('td');
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.placeholder = '0';
    input.style.width = '100px'; // Ajustar ancho si es necesario
    input.required = true;

    cell.appendChild(input);
    newRow.appendChild(cell);
  }

  // Insertar la nueva fila antes del botón de "+ Agregar Ingreso"
  const indicadorRow = document.getElementById('indicador');
  table.tBodies[0].insertBefore(newRow, indicadorRow);
}


////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

    
    // Mapa para convertir los números de mes en nombres de meses
    const monthMap = {
      1: "Enero",
      2: "Febrero",
      3: "Marzo",
      4: "Abril",
      5: "Mayo",
      6: "Junio",
      7: "Julio",
      8: "Agosto",
      9: "Septiembre",
      10: "Octubre",
      11: "Noviembre",
      12: "Diciembre",
    };
  
   // Función para cargar los datos desde la API
async function loadPredictions() {
  try {
    // Llamada a la API que expone los datos JSON
    const response = await fetch('/obtenerVentasPronosticadas');
    
    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    // Procesar los datos para renderizar la tabla
    renderTable(data);
  } catch (error) {
    console.error("Error al cargar predicciones:", error);
  }
}
  
    // Función para renderizar la tabla
    function renderTable(predictions) {
      const monthsRow = document.getElementById("monthsRow");
      const salesRow = document.querySelector("#incomeTable tbody tr");
  
      // Iterar sobre las predicciones
      for (const [monthNumber, value] of Object.entries(predictions)) {
        const monthName = monthMap[parseInt(monthNumber)];
  
        // Crear y agregar encabezado del mes
        const th = document.createElement("th");
        th.textContent = monthName;
        monthsRow.appendChild(th);
  
        // Crear y agregar celda de ventas pronosticadas
        const td = document.createElement("td");
        td.textContent = value.toFixed(2); // Mostrar con dos decimales
        salesRow.appendChild(td);
      }
    }
  
    // Ejecutar la función para cargar los datos
    loadPredictions();



/////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////Para controla rlo de los porcentajes de vencimiento//////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar los valores predeterminados
  const defaultPercentages = {
    cash: 45,
    oneMonth: 34,
    twoMonths: 21,
  };

  // Cargar los valores iniciales en los campos de entrada
  document.getElementById('cashPercentage').value = defaultPercentages.cash;
  document.getElementById('oneMonthPercentage').value = defaultPercentages.oneMonth;
  document.getElementById('twoMonthsPercentage').value = defaultPercentages.twoMonths;

  // Función para actualizar el porcentaje restante
  function updateRemainingPercentage() {
    const cash = parseFloat(document.getElementById('cashPercentage').value);
    const oneMonth = parseFloat(document.getElementById('oneMonthPercentage').value);

    // Calcular el porcentaje restante para asegurarse de que la suma sea 100%
    const remaining = 100 - (cash + oneMonth);

    if (remaining >= 0) {
      document.getElementById('twoMonthsPercentage').value = remaining;
      document.getElementById('errorMessage').style.display = 'none'; // Ocultar mensaje de error si la suma es válida
    } else {
      document.getElementById('errorMessage').style.display = 'block'; // Mostrar mensaje de error si la suma excede 100%
    }
  }

  // Añadir los eventos para actualizar el porcentaje restante al ingresar un valor
  document.getElementById('cashPercentage').addEventListener('input', updateRemainingPercentage);
  document.getElementById('oneMonthPercentage').addEventListener('input', updateRemainingPercentage);

  // Función para aplicar los cambios (en caso de querer guardarlos o hacer algo más con los valores)
  document.getElementById('applyChangesBtn').addEventListener('click', () => {
    const cash = parseFloat(document.getElementById('cashPercentage').value);
    const oneMonth = parseFloat(document.getElementById('oneMonthPercentage').value);
    const twoMonths = parseFloat(document.getElementById('twoMonthsPercentage').value);

    if (cash + oneMonth + twoMonths === 100) {
      // Si la suma es válida, puedes hacer algo con los datos (por ejemplo, actualizar la base de datos)
      console.log('Porcentajes actualizados:', { cash, oneMonth, twoMonths });
    } else {
      console.error('La suma de los porcentajes no es 100');
    }
  });
});
