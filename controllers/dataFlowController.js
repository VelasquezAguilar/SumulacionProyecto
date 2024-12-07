import { connect } from "../database/connection.js";
import sql from "mssql";
//import { spawn } from 'child_process';
let connectionPool;
import fs from 'fs';
import path from 'path';


export class DataFlow {

    // Formatear los metadatos de las tablas
    static format_metadata(recordset) {
        let formattedData = { source: {} };
        recordset.forEach(register => {
            formattedData.source[register.columnName] = {
                dataType: register.dataType,
                length: register.length,
                precision: register.precision
            }
        });
        return formattedData;
    }

    // Obtener metadatos de una tabla
    static async getTableMetadata(tableName) {
        try {
            let result = await connectionPool.request().query(`
                SELECT COLUMN_NAME AS columnName,
                    DATA_TYPE AS dataType, 
                    CHARACTER_MAXIMUM_LENGTH AS length, 
                    NUMERIC_PRECISION AS precision 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME='${tableName}';`
            );
            let formattedData = this.format_metadata(result.recordset);
            return formattedData;
        } catch (error) {
            console.log("Error al obtener metadatos: ", error);
        }
    }



    // Método para establecer la conexión con la base de datos
    static async connection(req, res) {
        try {
            const { server, dataBase, user, password } = req.body;

            if (!connectionPool) {
                // Establecer la conexión con la base de datos utilizando los parámetros
                const pool = await connect(user, password, server, dataBase);
                connectionPool = pool; // Guardar la conexión en connectionPool
                //console.log("coneccion es entonces :", message)

                res.status(200).json({ message: 'Conexión establecida con éxito' });
            }
        } catch (error) {
            console.log("Error de conexión: ", error);
            res.status(400).json({ message: 'Sucedió un error durante la conexión' });
        }
    }




    //Metod para obtener la estrucututra de la tabla seleccionada 
    // Método para establecer la conexión con la base de datos
    static async connectionTable(req, res) {
        try {
            const { server, dataBase, user, password } = req.body;

            if (!connectionPool) {
                // Establecer la conexión con la base de datos utilizando los parámetros
                const pool = await connect(user, password, server, dataBase);
                connectionPool = pool; // Guardar la conexión en connectionPool
                //console.log("coneccion es entonces :", message)
                table = localStorage.getItem("selectedTable");
                var queryResult;

                queryResult = await DataFlow.getTableMetadata(table);
                res.status(200).json({ message: `Informacion de la tabla ${table}`, testQueryResult: queryResult });
                res.status(200).json({ message: 'Conexión establecida con éxito' });
            }
        } catch (error) {
            console.log("Error de conexión: ", error);
            res.status(400).json({ message: 'Sucedió un error durante la conexión' });
        }
    }




    // Obtener los nombres de las tablas después de que la conexión esté establecida
    static async getTableNames(req, res) {
        try {

            console.log("Verificando conexión...", connectionPool);
            // Primero, asegurémonos de que la conexión esté abierta
            console.log("Verificando conexión...", connectionPool);

            // Si ya hay una conexión establecida en connectionPool, no es necesario reconectar
            if (!connectionPool) {
                return res.status(400).json({ message: 'No se ha establecido conexión con la base de datos' });
            }


            var queryResult = await connectionPool.request().query(`
                SELECT table_name 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE table_type = 'BASE TABLE' AND table_name != 'sysdiagrams';`
            );


            // Enviar los resultados de las tablas al frontend
            res.status(200).json({
                message: 'Se obtuvieron las tablas de la base de datos',
                recordset: queryResult.recordset
            });

        } catch (error) {
            console.log("Error al obtener las tablas: ", error);
            res.status(400).json({ message: 'No se pudieron obtener las tablas' });
        }
    }


    //Metodo para procesar los datos del  fromualrio ose obtenerlos ya procesados 
    // Controlador para procesar los datos
   /* static procesarDatos = (req, res) => {
        const datos = req.body;
    
        // Validar que se recibieron los datos
        if (!datos || Object.keys(datos).length === 0) {
            return res.status(400).json({ error: 'No se recibieron datos' });
        }
    
        console.log("Datos recibidos del frontend:", datos);
    
        // Obtener la ruta del directorio actual (sin usar `import.meta.url`)
        const __dirname = path.resolve();
    
        // Obtener la ruta absoluta del archivo JSON usando path.join
        const filePath = path.join(__dirname, 'json', 'datosFormulario.json');
    
        // Leer el archivo JSON existente
        fs.readFile(filePath, (err, data) => {
            let datosGuardados = [];
    
            if (err) {
                if (err.code === 'ENOENT') {
                    // Si el archivo no existe, lo creamos
                    console.log("Archivo JSON no encontrado, crearemos uno nuevo.");
                } else {
                    console.error("Error al leer el archivo:", err);
                    return res.status(500).json({ error: 'Error al leer el archivo JSON' });
                }
            } else {
                try {
                    datosGuardados = JSON.parse(data); // Parsear los datos existentes
                } catch (parseError) {
                    console.error("Error al parsear el archivo JSON:", parseError);
                    return res.status(500).json({ error: 'Error al parsear el archivo JSON' });
                }
            }
    
            // Agregar los nuevos datos al array
            datosGuardados.push(datos);
    
            // Escribir los datos actualizados en el archivo JSON
            fs.writeFile(filePath, JSON.stringify(datosGuardados, null, 2), (err) => {
                if (err) {
                    console.error("Error al guardar los datos:", err);
                    return res.status(500).json({ error: 'Error al guardar los datos en el archivo JSON' });
                }
    
                // Responder con éxito
                res.status(200).json({ mensaje: "Datos guardados correctamente" });
            });
        });
    };*/

    static procesarDatos = (req, res) => {
        const datos = req.body;
    
        // Validar que se recibieron los datos
        if (!datos || Object.keys(datos).length === 0) {
            return res.status(400).json({ error: 'No se recibieron datos' });
        }
    
        console.log("Datos recibidos del frontend:", datos);
    
        // Obtener la ruta del directorio actual
        const __dirname = path.resolve();
    
        // Obtener la ruta absoluta del archivo JSON
        const filePath = path.join(__dirname, 'json', 'datosFormulario.json');
    
        // Leer el archivo JSON existente
        fs.readFile(filePath, 'utf-8', (err, data) => {
            let datosGuardados = [];
    
            if (err) {
                if (err.code === 'ENOENT') {
                    // Si el archivo no existe, lo tratamos como un archivo nuevo
                    console.log("Archivo JSON no encontrado, crearemos uno nuevo.");
                } else {
                    console.error("Error al leer el archivo:", err);
                    return res.status(500).json({ error: 'Error al leer el archivo JSON' });
                }
            } else if (data.trim() !== '') {
                try {
                    datosGuardados = JSON.parse(data); // Parsear los datos existentes
                } catch (parseError) {
                    console.error("Error al parsear el archivo JSON:", parseError);
                    return res.status(500).json({ error: 'El archivo JSON está dañado' });
                }
            }
    
            // Agregar los nuevos datos al array
            datosGuardados.push(datos);
    
            // Escribir los datos actualizados en el archivo JSON
            fs.writeFile(filePath, JSON.stringify(datosGuardados, null, 2), (err) => {
                if (err) {
                    console.error("Error al guardar los datos:", err);
                    return res.status(500).json({ error: 'Error al guardar los datos en el archivo JSON' });
                }
    
                // Responder con éxito
                res.status(200).json({ mensaje: "Datos guardados correctamente" });
            });
        });
    };
    
    /*
    
            // Ejecutar el script Python
            const pythonProcess = spawn("python3", ["procesar_datos.py"]);
    
            // Enviar datos al script Python
            pythonProcess.stdin.write(JSON.stringify(datos));
            pythonProcess.stdin.end();
    
            let resultado = "";
    
            // Leer la respuesta de Python
            pythonProcess.stdout.on("data", (data) => {
                resultado += data.toString();
            });
    
            pythonProcess.stderr.on("data", (error) => {
                console.error("Error en Python:", error.toString());
            });
    
            // Cuando termine, devolver la respuesta
            pythonProcess.on("close", (code) => {
                if (code !== 0) {
                    return res.status(500).json({ error: "Error ejecutando Python" });
                }
    
                try {
                    const resultadoJSON = JSON.parse(resultado);
                    res.status(200).json({
                        mensaje: "Datos procesados correctamente",
                        resultado: resultadoJSON
                    });
                } catch (error) {
                    res.status(500).json({ error: "Error procesando respuesta de Python" });
                }
            });*/


};


export class allViews {
    static redirectMenu(req, res) {
        res.render('menu');
    }
    static redirectInicio(req, res) {
        res.render('inicio');
    }

    static redirecProyeccion(req, res) {
        res.render('formularios');
    }

    static redirecBD(resq, res) {
        res.render('basesDatos');
    }
    static redirecIngresos(req, res) {
        res.render('ingresos');
    }

    static redirecEgresis(req, res) {
        res.render('egresos');
    }

    static redirecNeteo(req, res) {
        res.render('neteo');
    }

}