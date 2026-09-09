import pool from "../../../database/mysqlpool";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { RowDataPacket } from "mysql2";

const JWT_SECRET = process.env["JWT_SECRET"] ?? "secret";

export interface UsuarioRow extends RowDataPacket {
  USER_ID: number;
  NOMBRE: string;
  NOMBRE_USUARIO: string;
  EMAIL: string;
  TELEFONO?: string;
  ID_SUCURSAL?: string;
  PASSWORD_HASH: string;
  ESTADO: string;
  ULTIMO_LOGIN?: Date;
}

export interface AuthResult {
  token: string;
  user: UsuarioRow;
}

export async function login(email: string, password: string): Promise<AuthResult> {
  try {
    console.log("🔵 [DB] Ejecutando consulta de login...");
    const [rows] = await pool.query<UsuarioRow[]>(
      `SELECT u.USER_ID,u.NOMBRE,u.EMAIL,u.PASSWORD_HASH,u.ESTADO,e.ID_EMPLEADO,e.NOMBRES AS NOMBRE_EMPLEADO,s.ID_SUCURSAL,s.NOMBRE_SUCURSAL
       FROM USUARIOS u
       JOIN EMPLEADO e ON u.ID_EMPLEADO = e.ID_EMPLEADO
       JOIN SUCURSALES s ON e.ID_SUCURSAL = s.ID_SUCURSAL
       WHERE u.EMAIL = ?
       AND U.ESTADO='A'`,
      [email],
    );

    const user = rows[0];
    if (!user) {
      console.error("❌ [DB] Usuario no encontrado o inactivo:", email);
      throw new Error("Usuario no encontrado o inactivo");
    }

    console.log("🔵 [Auth] Validando contraseña...");
    const valid = await bcrypt.compare(password, user.PASSWORD_HASH);
    if (!valid) {
      console.error("❌ [Auth] Contraseña incorrecta para usuario:", email);
      throw new Error("Contraseña incorrecta");
    }

    console.log("🔵 [DB] Actualizando último login...");
    await pool.query("UPDATE USUARIOS SET ULTIMO_LOGIN = NOW() WHERE USER_ID = ?", [user.USER_ID]);

    // Obtener permisos
    console.log("🔵 [DB] Obteniendo Permisos del Usuario...");
    const permisos = await getPermisosUsuario(user.USER_ID);
    console.log("🔎 [Auth] Permisos obtenidos:", permisos);
    console.log("🔵 [Auth] Generando token JWT...");
    const token = jwt.sign(
      {
        USER_ID: user.USER_ID,
        EMAIL: user.EMAIL,
        NOMBRE: user.NOMBRE,
        NOMBRE_USUARIO: user.NOMBRE_USUARIO,
        ID_SUCURSAL: user.ID_SUCURSAL,
        PERMISOS: permisos,
      },
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    console.log("✅ [Auth] Login exitoso para usuario:", email);
    return { token, user };
  } catch (error) {
    console.error("❌ [Auth] Error en login:", error);
    throw error;
  }
}

export async function getPermisosUsuario(userId: number): Promise<string[]> {
  console.log("🔵 [DB] Ejecutando consulta para obtener permisos...");
  const [rows] = await pool.query<(RowDataPacket & { PERMISO_ID: string })[]>(
    `SELECT DISTINCT p.PERMISO_ID
     FROM USUARIOS u
     INNER JOIN USUARIO_ROL ur ON u.USER_ID = ur.USER_ID
     INNER JOIN ROLES r ON ur.ROL_ID = r.ROL_ID
     INNER JOIN ROL_PERMISO rp ON r.ROL_ID = rp.ROL_ID
     INNER JOIN PERMISOS p ON rp.PERMISO_ID = p.PERMISO_ID
     WHERE u.USER_ID = ?`,
    [userId],
  );
  console.log(`✅ [DB] Permisos encontrados: ${rows.length}`);
  return rows.map((r) => r.PERMISO_ID);
}

export async function register(
  nombre: string,
  nombreUsuario: string,
  email: string,
  password: string,
  telefono?: string,
  idSucursal?: string,
): Promise<{ success: boolean }> {
  try {
    console.log("🔵 [Auth] Encriptando contraseña...");
    const hash = await bcrypt.hash(password, 10);

    console.log("🔵 [DB] Insertando nuevo usuario...");
    await pool.query(
      `INSERT INTO USUARIOS (NOMBRE, NOMBRE_USUARIO, EMAIL, TELEFONO, ID_SUCURSAL, PASSWORD_HASH, ESTADO)
       VALUES (?, ?, ?, ?, ?, ?, 'A')`,
      [nombre, nombreUsuario, email, telefono ?? null, idSucursal ?? null, hash],
    );

    console.log("✅ [Auth] Usuario registrado correctamente:", email);
    return { success: true };
  } catch (error) {
    console.error("❌ [Auth] Error en registro:", error);
    throw error;
  }
}
