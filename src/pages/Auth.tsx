import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const toEmail = (n: string) =>
  `${Array.from(n.toLowerCase()).map((c) => c.codePointAt(0)!.toString(16)).join("-")}@passport-pixel.app`;
const toPassword = (pin: string) => `pp-pin-${pin}-passport`;

const Auth = () => {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [taken, setTaken] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 30) {
      toast.error("Username must be 2–30 characters");
      return;
    }
    if (!/^\d{4,6}$/.test(pin)) {
      toast.error("PIN must be 4 digits");
      return;
    }
    setLoading(true);
    setTaken(false);
    const email = toEmail(trimmed);
    const password = toPassword(pin);

    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
    if (!signInErr) { setLoading(false); return; }

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .ilike("username", trimmed.replace(/[%_\\]/g, "\\$&"))
      .maybeSingle();

    if (existing) {
      setTaken(true);
      setLoading(false);
      return;
    }

    if (!/^[a-zA-Z0-9_.]{2,30}$/.test(trimmed)) {
      toast.error("Username can only use letters, numbers, _ and .");
      setLoading(false);
      return;
    }
    if (!/^\d{4}$/.test(pin)) {
      toast.error("New usernames need a 4-digit PIN");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error || !data.user) {
      toast.error(error?.message ?? "Could not start");
      setLoading(false);
      return;
    }
    const { error: upErr } = await supabase
      .from("profiles")
      .update({ username: trimmed })
      .eq("id", data.user.id);
    if (upErr) {
      toast.error("That name was just taken, try another");
      await supabase.auth.signOut();
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
          <p className="font-retro text-xl text-muted-foreground mt-1">Pick a username, traveler!</p>
        </div>

        <form onSubmit={handleSubmit} className="pixel-border-lg bg-card p-6 space-y-4">
          <div>
            <label className="font-pixel text-[8px] text-card-foreground block mb-1">USERNAME</label>
            <input
              value={name}
              onChange={(e) => { setName(e.target.value.replace(/\s/g, "")); setTaken(false); }}
              required
              maxLength={30}
              autoCapitalize="none"
              className="w-full pixel-border-sm bg-background text-foreground font-retro text-lg px-3 py-2 outline-none placeholder:text-muted-foreground"
              placeholder="vania_travels"
            />
          </div>
          <div>
            <label className="font-pixel text-[8px] text-card-foreground block mb-1">4-DIGIT PIN</label>
            <input
              value={pin}
              onChange={(e) => { setPin(e.target.value.replace(/\D/g, "").slice(0, 6)); setTaken(false); }}
              required
              inputMode="numeric"
              type="password"
              className="w-full pixel-border-sm bg-background text-foreground font-retro text-lg px-3 py-2 outline-none placeholder:text-muted-foreground tracking-widest"
              placeholder="••••"
            />
          </div>

          {taken && (
            <div className="font-retro text-lg text-muted-foreground text-center">
              That username is taken (or wrong PIN).{" "}
              <button
                type="button"
                onClick={() => navigate(`/p/${encodeURIComponent(name.trim())}`)}
                className="text-accent underline cursor-pointer"
              >
                View it
              </button>{" "}
              or pick another username.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-pixel text-[10px] py-3 pixel-border-sm hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? "LOADING..." : "▶ START"}
          </button>
          <p className="font-retro text-base text-center text-muted-foreground">
            New? Pick a unique username + 4-digit PIN to claim it. Returning? Use them on any device. Usernames aren't case-sensitive.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;
