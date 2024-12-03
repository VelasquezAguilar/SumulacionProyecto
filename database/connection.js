import sql from "mssql";

export async function connect (user,password,server,dataBase){
    const sqlConfig = {
        user: user,
        password: password,
        database: dataBase,
        server: server,
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        },
        options: {
            encrypt: false,
            trustServerCertificate: true 
        }
    }
    
    try {
        const pool = await sql.connect(sqlConfig);
        
        // Realizar una consulta de prueba para verificar la conexión
        const result = await pool.request().query("SELECT GETDATE()");
        console.log("Conexión exitosa:", result);

        return pool;  // Retorna el pool de conexiones
    } catch (err) {
        console.log("Error de conexión a la base de datos:", err.message);
        console.error(err);  // Imprime el error completo
    }
}

