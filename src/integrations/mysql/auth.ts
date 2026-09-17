import pool from "../../../database/mysqlpool";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import type { RowDataPacket } from "mysql2";
import {
  AuditoriaUsuarioInsert,
  UsuarioRow,
  AuthResult,
  auditoriaBase,
  auditoriaLoginUsuarioNoEncontrado,
  auditoriaLoginPasswordIncorrecta,
  auditoriaLoginExitoso,
  auditoriaLoginError,
} from "@/types/mysqltypes";
import { insertAuditoriaUsuario } from "./auditoriaUsuarios";

const JWT_SECRET = process.env["JWT_SECRET"] ?? "secret";

export async function login(email: string, password: string): Promise<AuthResult> {
  try {
    console.log("🔵 [auth.login] Ejecutando consulta de login con email:", { email });
    const [rows] = await pool.query<UsuarioRow[]>(
      `SELECT u.USER_ID,u.NOMBRE,u.EMAIL,u.PASSWORD_HASH,u.ESTADO,e.ID_EMPLEADO,e.NOMBRES AS NOMBRE_EMPLEADO,s.ID_SUCURSAL,s.NOMBRE_SUCURSAL
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
    //console.log("✅ [auth.login] Permisos obtenidos:", { userId: user.USER_ID, permisos });

    // 🔹 Generar token de sesión único
    console.log("🔵 [auth.login] Generando SESSION_ID único:", { userId: user.USER_ID });
    const sessionToken = generateSessionToken();
    await updateSessionToken(user.USER_ID, sessionToken);

    console.log("🔵 [auth.login] Generando token JWT:", { userId: user.USER_ID });
    const token = jwt.sign(
      {
        USER_ID: user.USER_ID,
        EMAIL: user.EMAIL,
        NOMBRE: user.NOMBRE,
        NOMBRE_USUARIO: user.NOMBRE_USUARIO,
        ID_SUCURSAL: user.ID_SUCURSAL,
        SESSION_ID: sessionToken, // 🔹 Nuevo campo en el payload
        PERMISOS: permisos,
      },
      JWT_SECRET,
      { expiresIn: "10h" },
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

/**
 * Genera un token de sesión único para control de sesión única
 */
function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Actualiza el SESSION_ID del usuario en la base de datos
 * Esto invalida cualquier sesión anterior del mismo usuario
 */
export async function updateSessionToken(userId: number, sessionToken: string): Promise<void> {
  try {
    console.log("🔵 [auth.updateSessionToken] Actualizando SESSION_ID para usuario:", { userId });
    await pool.query("UPDATE USUARIOS SET SESSION_ID = ? WHERE USER_ID = ?", [
      sessionToken,
      userId,
    ]);
    console.log("✅ [auth.updateSessionToken] SESSION_ID actualizado correctamente");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("❌ [auth.updateSessionToken] Error al actualizar SESSION_ID:", {
      userId,
      message,
    });
    throw new Error(`[auth.updateSessionToken] ${message}`);
  }
}

/**
 * Valida si el sessionToken proporcionado coincide con el almacenado en BD
 * Retorna true si la sesión es válida, false si fue invalidada (otro login)
 */
export async function validateSessionToken(userId: number, sessionToken: string): Promise<boolean> {
  try {
    console.log("🔵 [auth.validateSessionToken] Validando sesión para usuario:", { userId });
    const [rows] = await pool.query<UsuarioRow[]>(
      "SELECT SESSION_ID FROM USUARIOS WHERE USER_ID = ?",
      [userId],
    );
    if (!rows || rows.length === 0) {
      console.warn("⚠️ [auth.validateSessionToken] Usuario no encontrado:", { userId });
      return false;
    }
    const storedToken = rows[0]?.SESSION_ID;
    const isValid = storedToken === sessionToken;
    console.log("✅ [auth.validateSessionToken] Sesión válida:", { isValid });
    return isValid;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("❌ [auth.validateSessionToken] Error al validar sesión:", { userId, message });
    throw new Error(`[auth.validateSessionToken] ${message}`);
  }
}

/**
 * Limpia el SESSION_ID del usuario (logout a nivel de BD)
 */
export async function clearSessionToken(userId: number): Promise<void> {
  try {
    console.log("🔵 [auth.clearSessionToken] Limpiando SESSION_ID para usuario:", { userId });
    await pool.query("UPDATE USUARIOS SET SESSION_ID = NULL WHERE USER_ID = ?", [userId]);
    console.log("✅ [auth.clearSessionToken] SESSION_ID limpiado correctamente");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("❌ [auth.clearSessionToken] Error al limpiar SESSION_ID:", { userId, message });
    throw new Error(`[auth.clearSessionToken] ${message}`);
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
