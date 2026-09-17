export function mapMysqlErrorToUserMessage(code: string, fallback: string): string {
  switch (code) {
    case "PROTOCOL_CONNECTION_LOST":
      return "Conexion perdida al conectar a la Base de Datos";
    case "ECONNRESET":
      return "Conexion reseteada al conectar a la Base de Datos";
    case "ETIMEDOUT":
      return "Timeout al conectar a la Base de Datos";
    case "ECONNREFUSED":
      return "Conexion a Base de Datos Rechazada";
    case "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR":
      return "Servicio temporalmente no disponible. Intente nuevamente en unos minutos.";
    case "ER_ACCESS_DENIED_ERROR":
      return "Error de configuración de la base de datos. Contacte al administrador.";
    case "ER_BAD_DB_ERROR":
      return "Base de datos no encontrada. Contacte al administrador.";
    case "ER_NO_SUCH_TABLE":
      return "Error de estructura de datos. Contacte al administrador.";
    case "ER_DUP_ENTRY":
      return "El registro ya existe.";
    case "ER_LOCK_WAIT_TIMEOUT":
      return "El sistema está ocupado. Intente nuevamente.";
    default:
      return fallback || "Error inesperado al procesar la solicitud.";
  }
}
