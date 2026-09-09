import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loginFn } from "@/server-functions/fnauthLogin";
import { registerFn } from "@/server-functions/fnauthRegister";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Ingresar — PuntoVenta" },
      {
        name: "description",
        content: "Inicia sesión o crea tu cuenta para operar el sistema POS.",
      },
      { property: "og:title", content: "Ingresar — PuntoVenta" },
      { property: "og:description", content: "Acceso al sistema de punto de venta." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session, loading, refresh } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/panel", replace: true });
  }, [loading, session, navigate]);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    console.log("🔵 [AuthPage] Iniciando proceso de login...");

    try {
      console.log("🔵 [AuthPage] Llamando a loginFn con email:", email);
      const result = await loginFn({
        data: { email, password },
      } as never);

      setBusy(false);

      if (!result.success) {
        console.error("❌ [AuthPage] Error en login:", result.error);
        toast.error(result.error ?? "Error al iniciar sesión");
        return;
      }

      localStorage.setItem("auth_token", result.data?.token);
      localStorage.setItem("auth_user", JSON.stringify(result.data?.user));
      console.log("✅ [AuthPage] Sesión guardada en localStorage");
      console.log("✅ [AuthPage] Login exitoso:", result.data?.user?.EMAIL);
      console.log("🔎 [AuthPage] Valores login:", JSON.stringify(result.data, null, 2));
      console.log("✅ Redirigiendo a pagina principal: /panel");
      toast.success("Bienvenido de nuevo");
      refresh();
      navigate({ to: "/panel", replace: true }); // ✅ Redirigir al panel
    } catch (err) {
      setBusy(false);
      console.error("❌ [AuthPage] Excepción en login:", err);
      toast.error(err instanceof Error ? err.message : "Error desconocido en login");
    }
  }

  async function registrar(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    console.log("🔵 [AuthPage] Iniciando proceso de registro...");

    try {
      const nombreUsuario = email.split("@")[0];
      console.log("🔵 [AuthPage] Llamando a registerFn con email:", email);

      const result = await registerFn({
        data: { nombre, nombreUsuario, email, password },
      } as never);

      setBusy(false);

      if (!result.success) {
        console.error("❌ [AuthPage] Error en registro:", result.error);
        toast.error(result.error ?? "Error al crear la cuenta");
        return;
      }

      console.log("✅ [AuthPage] Registro exitoso:", email);
      toast.success("Cuenta creada. Ya puedes ingresar.");
    } catch (err) {
      setBusy(false);
      console.error("❌ [AuthPage] Excepción en registro:", err);
      toast.error(err instanceof Error ? err.message : "Error desconocido en registro");
    }
  }
  //Pendiente
  async function google() {
    /* const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("No se pudo iniciar sesión con Google");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/panel", replace: true }); */
    return true;
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-primary font-mono font-bold text-primary-foreground">
            PV
          </div>
          <div>
            <p className="font-semibold">PuntoVenta</p>
            <p className="text-xs text-muted-foreground">Acceso al sistema</p>
          </div>
        </div>

        <Tabs defaultValue="login" className="rounded-xl border border-border bg-card p-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
            <TabsTrigger value="signup">Crear cuenta</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-6">
            <form onSubmit={entrar} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pass">Contraseña</Label>
                <Input
                  id="pass"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                Ingresar
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-6">
            <form onSubmit={registrar} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre completo</Label>
                <Input
                  id="nombre"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email2">Correo</Label>
                <Input
                  id="email2"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pass2">Contraseña</Label>
                <Input
                  id="pass2"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                Crear cuenta
              </Button>
              <p className="text-xs text-muted-foreground">
                El primer usuario registrado obtiene el rol de administrador.
              </p>
            </form>
          </TabsContent>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> o{" "}
              <span className="h-px flex-1 bg-border" />
            </div>
            <Button variant="outline" className="w-full" onClick={google}>
              Continuar con Google
            </Button>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
