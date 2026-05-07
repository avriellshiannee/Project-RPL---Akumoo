import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";

const Login = () => {
  const { signIn, signUp, user, isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) nav("/admin", { replace: true });
  }, [user, isAdmin, loading, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const fn = mode === "login" ? signIn : signUp;
    const { error } = await fn(email, password);
    setBusy(false);
    if (error) return toast.error(error);
    if (mode === "signup") {
      toast.success("Akun dibuat. Minta admin untuk memberi role admin di database.");
    } else {
      toast.success("Berhasil masuk");
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-soft p-6">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-border bg-card p-8 shadow-soft">
        <div className="flex flex-col items-center gap-2">
          <Logo />
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin Panel</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Password</Label>
            <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" variant="hero" className="w-full" disabled={busy}>
            {busy ? "Memproses..." : mode === "login" ? "Masuk" : "Daftar"}
          </Button>
        </form>
        <div className="text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>Belum punya akun?{" "}<button className="font-semibold text-primary" onClick={() => setMode("signup")}>Daftar</button></>
          ) : (
            <>Sudah punya akun?{" "}<button className="font-semibold text-primary" onClick={() => setMode("login")}>Masuk</button></>
          )}
        </div>
        <div className="text-center text-xs">
          <Link to="/" className="text-muted-foreground hover:text-foreground">← Kembali ke website</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
