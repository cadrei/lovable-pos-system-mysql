import pool from "../../../database/mysqlpool";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { RowDataPacket } from "mysql2";
import { AuditoriaUsuarioInsert } from "@/types/mysqltypes";
import { insertAuditoriaUsuario } from "./auditoriaUsuarios";

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

// Plantillas base de auditoría
const auditoriaBase: AuditoriaUsuarioInsert = {
  USER_ID: 0,
  USER_EMAIL: "",
  ACTION: "LOGIN",
  MODULE: "AUTH",
  ENTITY: "USUARIOS",
  ENTITY_ID: null,
  OLD_VALUE: null,
  NEW_VALUE: null,
  IP: null, // aquí puedes pasar la IP si la capturas en la request
};
// Plantilla: login fallido por usuario inexistente/inactivo
const auditoriaLoginUsuarioNoEncontrado: AuditoriaUsuarioInsert = {
  ...auditoriaBase,
  ACTION: "LOGIN_FAIL",
  NEW_VALUE: "Usuario no encontrado o inactivo",
};

// Plantilla: login fallido por contraseña incorrecta
const auditoriaLoginPasswordIncorrecta: AuditoriaUsuarioInsert = {
  ...auditoriaBase,
  ACTION: "LOGIN_FAIL",
  NEW_VALUE: "Contraseña incorrecta",
};

// Plantilla: login exitoso
const auditoriaLoginExitoso: AuditoriaUsuarioInsert = {
  ...auditoriaBase,
  ACTION: "LOGIN_SUCCESS",
  NEW_VALUE: "Usuario autenticado correctamente",
};

// Plantilla: error inesperado en login
const auditoriaLoginError: AuditoriaUsuarioInsert = {
  ...auditoriaBase,
  ACTION: "LOGIN_ERROR",
  NEW_VALUE: "Error inesperado en login",
};

export async function login(email: string, password: string): Promise<AuthResult> {
  try {
    console.log("🔵 [auth.login] Ejecutando consulta de login con email:", { email });
    const [rows] = await pool.query<UsuarioRow[]>(
      `SELECT u.USER_ID,u.NOMBRE,u.EMAIL,u.PASSWORD_HASH,u.ESTADO,
              e.ID_EMPLEADO,e.NOMBRES AS NOMBRE_EMPLEADO,
              s.ID_SUCURSAL,s.NOMBRE_SUCURSAL
       FROM USUARIOS u
       JOIN EMPLEADO e ON u.ID_EMPLEADO = e.ID_EMPLEADO
       JOIN SUCURSALES s ON e.ID_SUCURSAL = s.ID_SUCURSAL
       WHERE u.EMAIL = ? AND u.ESTADO='A'`,
      [email],
    );
    const user = rows[0];
    if (!user) {
      console.error("❌ [auth.login] Usuario no encontrado o inactivo:", { email });
      await insertAuditoriaUsuario({
        ...auditoriaLoginUsuarioNoEncontrado,
        USER_EMAIL: email,
      });
      throw new Error("Usuario no encontrado o inactivo");
    }
    console.log("🔵 [auth.login] Validando contraseña:", { email });
    const valid = await bcrypt.compare(password, user.PASSWORD_HASH);
    if (!valid) {
      console.error("❌ [auth.login] Contraseña incorrecta para usuario:", { email });
      await insertAuditoriaUsuario({
        ...auditoriaLoginPasswordIncorrecta,
        USER_ID: user.USER_ID,
        USER_EMAIL: user.EMAIL,
        ENTITY_ID: String(user.USER_ID),
      });
      throw new Error("Contraseña incorrecta");
    }
    console.log("🔵 [auth.login] Actualizando último login:", { userId: user.USER_ID });
    await pool.query("UPDATE USUARIOS SET ULTIMO_LOGIN = NOW() WHERE USER_ID = ?", [user.USER_ID]);
    console.log("🔵 [auth.login] Obteniendo permisos del usuario:", { userId: user.USER_ID });
    const permisos = await getPermisosUsuario(user.USER_ID);
    console.log("✅ [auth.login] Permisos obtenidos:", { userId: user.USER_ID, permisos });
    console.log("🔵 [auth.login] Generando token JWT:", { userId: user.USER_ID });
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
    console.log("✅ [auth.login] Login exitoso:", { email });
    await insertAuditoriaUsuario({
      ...auditoriaLoginExitoso,
      USER_ID: user.USER_ID,
      USER_EMAIL: user.EMAIL,
      ENTITY_ID: String(user.USER_ID),
    });
    return { token, user };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("❌ [auth.login] Error en login:", { email, message });
    await insertAuditoriaUsuario({
      ...auditoriaLoginError,
      USER_EMAIL: email,
      NEW_VALUE: message,
    });
    throw new Error(`[auth.login] ${message}`);
  }
}

export async function getPermisosUsuario(userId: number): Promise<string[]> {
  try {
    console.log("🔵 [auth.getPermisosUsuario] Obteniendo permisos de usuario : ", { userId });
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
    console.log("✅ [auth.getPermisosUsuario] Permisos encontrados: ", {
      userId,
      count: rows.length,
    });
    return rows.map((r) => r.PERMISO_ID);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("❌ [auth.getPermisosUsuario] Error al obtener permisos: ", { userId, message });
    throw new Error(`[auth.getPermisosUsuario] ${message}`);
  }
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
    console.log("🔵 [auth.register] Encriptando contraseña: ", { email, nombreUsuario });
    const hash = await bcrypt.hash(password, 10);

    console.log("🔵 [auth.register] Insertando nuevo usuario: ", { email, nombreUsuario });
    await pool.query(
      `INSERT INTO USUARIOS (NOMBRE, NOMBRE_USUARIO, EMAIL, TELEFONO, ID_SUCURSAL, PASSWORD_HASH, ESTADO)
       VALUES (?, ?, ?, ?, ?, ?, 'A')`,
      [nombre, nombreUsuario, email, telefono ?? null, idSucursal ?? null, hash],
    );
    console.log("✅ [auth.register] Usuario registrado correctamente: ", { email, nombreUsuario });
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("❌ [auth.register] Error en registro", { email, nombreUsuario, message });
    throw new Error(`[auth.register] ${message}`);
  }
}
