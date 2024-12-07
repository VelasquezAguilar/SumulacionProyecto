//import { localsName } from "ejs";

// Obtener referencias al modal
const formModal = document.getElementById("form-modal");



/////////////////////////////////////////////////////////////////////////////////////////
/////////////////FUNCION PARA ESTABLECER CONEXION CON LA BASE DE DATOS///////////////////
/**
 * Extraer datos del formulario
 * @returns {Object}
 */
function extractData() {
  return {
    server: formModal.querySelector("#ServerName").value,
    dataBase: formModal.querySelector("#DbName").value,
    user: formModal.querySelector("#UserName").value,
    password: formModal.querySelector("#Password").value,
  };
}

/**
 * Conectar a la base de datos
 */
async function dbConnection() {
  const formData = extractData();

  // Verificar si los campos están vacíos antes de enviar la solicitud
  if (!formData.server || !formData.dataBase || !formData.user || !formData.password) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  try {
    const response = await fetch("/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),  // Enviar solo los campos necesarios
    });
    const result = await response.json();
    console.log("este es el resultado brother:", result)
    if (result.message === 'Conexión establecida con éxito') {
      alert("Conexión exitosa");
      

        // Guardar los datos en localStorage
        localStorage.setItem("dbConnectionInfo", JSON.stringify(formData));
        console.log("Datos guardados en localStorage");
         // Guardar datos en localStorage
      

      await populateTableNames();  // Llama esta función después de la conexión
       
    } else {
      alert("Exito en la conexión: " + result.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al conectar con la base de datos 333.");
  }
}




/////////////////////////////////////////////////////////////////////////////////////////
///////////////////FUNCION PARA OBTENER LAS TABLAS DE LA CONEXION///////////////////////

/**
 * Extraer nombres de las tablas y llenar el select
 */
async function populateTableNames() {
  try {
    const formData = extractData();  // Obtener los datos del formulario

    // Verifica y muestra los datos antes de enviarlos
    console.log('Datos enviados al servidor:', formData);

    // Verificar si los campos no están vacíos
    if (!formData.server || !formData.dataBase || !formData.user || !formData.password) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const response = await fetch("/tableNames", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),

    });
    console.log("Verificando conexión...", JSON.stringify(formData))
    var tonces = response;
    console.log("que es lo que imprime:", tonces)

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error al obtener tablas:", errorResponse.message);
      alert("Error al obtener las tablas: " + errorResponse.message);
      return;
    }

    const result = await response.json();
    console.log('Resultado del servidor:', result); // Verifica la respuesta del servidor

    // Limpiar opciones previas
    const tableSelect = formModal.querySelector("#TableName");
    tableSelect.innerHTML = '<option value="">Selecciona una tabla</option>';

    // Llenar select con las tablas obtenidas
    result.recordset.forEach((table) => {
      let option = document.createElement("option");
      option.value = table.table_name;
      option.innerText = table.table_name;
      tableSelect.appendChild(option);
    });

    // Agregar evento para capturar y guardar la tabla seleccionada
    tableSelect.addEventListener("change", (event) => {
      const selectedTable = event.target.value; // Obtener la tabla seleccionada
      if (selectedTable) {
        console.log("Tabla seleccionada:", selectedTable);
        localStorage.setItem("selectedTable", selectedTable); // Guardar en localStorage
      }
    });
  } catch (error) {
    console.error("Error:", error);
    alert("Error al cargar las tablas.");
  }
}




/////////////////////////////////////////////////////////////////////////////////////////
//////////////FUNCION PARA RENDERIZAR LA MODAL DE AGREGAR CONEXION///////////////////////
/**
*
* @param {string} typeOfBlockDraggedId
* set html content for modals
*/
// Función para mostrar el modal con el contenido
function setModalHtmlContent(typeOfBlockDraggedId) {
  console.log('clicked!!----------------------------------------------------');

  const modalContentDiv = formModal.querySelector('.modal-content');

  // Verifica si el id del bloque arrastrado es "source" y establece el contenido del modal
  if (typeOfBlockDraggedId === "source") {
    modalContentDiv.innerHTML = `
        <div id="modalContentDiv">
  <div class="modal-header">
    <h5 class="modal-title">Configurar Destino</h5>
    <button type="button" class="btn-close" onclick="toggleModal()" aria-label="Close"></button>
  </div>
  <div class="modal-body">
    <!-- Campos del formulario -->
    <div class="mb-3">
      <label for="ServerName" class="form-label">Nombre del Servidor</label>
      <input type="text" class="form-control" id="ServerName" placeholder="Servidor de destino">
    </div>
    <div class="mb-3">
      <label for="DbName" class="form-label">Nombre de la Base de Datos</label>
      <input type="text" class="form-control" id="DbName" placeholder="Base de datos de destino">
    </div>
    <div class="mb-3">
      <label for="UserName" class="form-label">Usuario</label>
      <input type="text" class="form-control" id="UserName" placeholder="Usuario de conexión">
    </div>
    <div class="mb-3">
      <label for="Password" class="form-label">Contraseña</label>
      <input type="password" class="form-control" id="Password" placeholder="Contraseña de conexión">
    </div>
    <!-- Botón de conexión -->
    <div class="mb-3">
      <button type="button" class="btn btn-primary" onclick="dbConnection()">Conectar</button>
    </div>
    <!-- Selector de tabla -->
    <div class="mb-3">
      <label for="TableName" class="form-label">Tabla de Destino</label>
      <select class="form-select" id="TableName">
        <option value="">Selecciona una tabla</option>
      </select>
    </div>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-secondary" onclick="cancelConfig()">Cancelar</button>
    <button type="button" class="btn btn-primary" onclick="saveDestinationConfig()">Guardar</button>
  </div>
</div>
`;

    // Abre el modal manualmente
    var myModal = new bootstrap.Modal(document.getElementById('form-modal'), {});
    myModal.show();

    formModal
      .querySelector("#methodSelection")
      .addEventListener("change", checkSelectValue);

  }
}


/////////////////////////////////////////////////////////////////////////////////////////
///////////////////FUNCION PARA RENDERIZAR LAS OCNEXIONES EXITOSAS///////////////////////
function renderConnectionsFromLocalStorage() {
  // Obtener datos únicos de dbConnectionInfo
  const connectionData = JSON.parse(localStorage.getItem("dbConnectionInfo"));

  // Obtener datos múltiples de conexiones
  const multipleConnections = JSON.parse(localStorage.getItem("conexiones")) || [];

  // Obtener la referencia al cuerpo de la tabla
  const tableBody = document.getElementById("connectionTableBody");

  // Limpiar contenido previo
  tableBody.innerHTML = "";

  // Renderizar la conexión única (si existe)
  if (connectionData) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>1</td>
      <td>Conexión LocalStorage</td>
      <td>${connectionData.server}</td>
      <td>${connectionData.dataBase}</td>
      <td>${connectionData.user}</td>
    `;
    tableBody.appendChild(row);
  }

  // Renderizar conexiones múltiples
  multipleConnections.forEach((connection, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${connectionData ? index + 2 : index + 1}</td>
      <td contenteditable="true" class="editable">${connection.nombre || "Nueva Conexión"}</td>
      <td>${connection.server}</td>
      <td>${connection.dataBase}</td>
      <td>${connection.user}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Llamar la función para renderizar las conexiones al cargar la página
window.onload = renderConnectionsFromLocalStorage;





// Esta es la función para cerrar el modal al hacer clic en "Cancelar"
function cancelConfig() {
  // Cierra el modal (esto depende de tu implementación específica de modal)
  // Si usas Bootstrap, puedes hacer algo como:
  $('#modalContentDiv').modal('hide'); // Oculta el modal con jQuery (ajusta según tu caso)
  
  // No hace nada más (no guarda nada en el localStorage)
  console.log('Acción cancelada');
}