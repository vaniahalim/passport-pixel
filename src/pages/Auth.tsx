import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Check your email to confirm your account! 📧");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3 animate-bounce-pixel">✈️</div>
          <h1 className="font-pixel text-lg pixel-text-shadow text-foreground leading-relaxed">
            PASSPORT PIXEL
          </h1>
          <p className="font-retro text-xl text-muted-foreground mt-1">
            {isLogin ? "Welcome back, traveler!" : "Start your adventure!"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="pixel-border-lg bg-card p-6 space-y-4">
          <h2 className="font-pixel text-xs text-card-foreground text-center">
            {isLogin ? "🔑 LOG IN" : "📝 SIGN UP"}
          </h2>

          <div>
            <label className="font-pixel text-[8px] text-card-foreground block mb-1">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pixel-border-sm bg-background text-foreground font-retro text-lg px-3 py-2 outline-none placeholder:text-muted-foreground"
              placeholder="explorer@email.com"
            />
          </div>

          <div>
            <label className="font-pixel text-[8px] text-card-foreground block mb-1">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full pixel-border-sm bg-background text-foreground font-retro text-lg px-3 py-2 outline-none placeholder:text-muted-foreground"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-pixel text-[10px] py-3 pixel-border-sm hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? "LOADING..." : isLogin ? "▶ ENTER" : "▶ CREATE ACCOUNT"}
          </button>

          <p className="font-retro text-lg text-center text-muted-foreground">
            {isLogin ? "No account? " : "Already have one? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-accent hover:text-accent/80 underline cursor-pointer"
            >
              {isLogin ? "Sign up!" : "Log in!"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;
