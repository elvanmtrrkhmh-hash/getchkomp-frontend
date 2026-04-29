import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { Mail, Lock, Eye, EyeOff, Sparkles, ChevronRight, ShieldCheck, Zap, Package, LogIn, ArrowRight } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { login, isLoading, customer, error } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Redirect jika sudah login
  useEffect(() => {
    if (customer) {
      navigate("/");
    }
  }, [customer, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast({
        title: t("common.error"),
        description: t("auth.email_password_required"),
        variant: "destructive",
      });
      return;
    }

    try {
      await login(formData.email, formData.password);
      toast({
        title: t("common.success"),
        description: t("auth.login_success"),
      });
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      const errorMessage = error || (err instanceof Error ? err.message : t("common.error"));
      console.error("Login error:", err);
      toast({
        title: t("common.error"),
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#030712] overflow-x-hidden relative">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 lg:py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full overflow-hidden pointer-events-none opacity-20 lg:opacity-100">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] animate-pulse delay-700"></div>
        </div>

        <div className="w-full max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Visual/Branding */}
            <div className="relative z-10 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-blue-400 text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Sparkles size={16} className="mr-2" />
                <span>Premium Tech Experience</span>
              </div>
              
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black tracking-tighter text-white leading-[1.1]">
                  Selamat Datang <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                    Kembali 👋
                  </span>
                </h1>
                <p className="text-slate-400 text-lg md:text-xl font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Masuk dan lanjutkan pengalaman belanja perangkat teknologi terbaik bersama Tech Komputer Hub.
                </p>
              </div>

              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-sm">
                    <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
                      <Package size={20} />
                    </div>
                    <span className="text-slate-300 font-bold text-sm uppercase tracking-wide">Produk Original</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-sm">
                    <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
                      <ShieldCheck size={20} />
                    </div>
                    <span className="text-slate-300 font-bold text-sm uppercase tracking-wide">Garansi Resmi</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-sm">
                    <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                      <Zap size={20} />
                    </div>
                    <span className="text-slate-300 font-bold text-sm uppercase tracking-wide">Checkout Cepat</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="relative z-20 flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-8 duration-1000">
              <div className="w-full max-w-lg">
                <div className="glass-card bg-white/[0.03] backdrop-blur-[24px] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative overflow-hidden group">
                  {/* Inner Glow Decorative */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/[0.05] to-purple-500/[0.05] pointer-events-none"></div>
                  
                  <div className="relative z-10 space-y-8">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl mb-4 text-blue-400">
                        <LogIn size={32} />
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-2">Login Account</h2>
                      <p className="text-slate-500 text-sm">{t("auth.login_desc")}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Email */}
                      <div className="space-y-2 group/input">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1 transition-colors group-focus-within/input:text-blue-400">
                          {t("auth.email")}
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-blue-400 transition-colors">
                            <Mail size={18} />
                          </div>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="nama@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div className="space-y-2 group/input">
                        <div className="flex justify-between items-center px-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors group-focus-within/input:text-blue-400">
                            {t("auth.password")}
                          </label>
                          <Link to="#" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">
                            Lupa Password?
                          </Link>
                        </div>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-blue-400 transition-colors">
                            <Lock size={18} />
                          </div>
                          <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="w-full h-14 pl-12 pr-12 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      {/* Error Message */}
                      {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start space-x-3 animate-in zoom-in-95 duration-300">
                          <div className="mt-0.5 text-red-500">
                            <ShieldCheck size={18} className="rotate-180" />
                          </div>
                          <p className="text-sm text-red-400 font-medium leading-tight">{error}</p>
                        </div>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full group relative h-14 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl font-bold text-white shadow-[0_10px_40px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.7)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <span className="relative z-10 flex items-center">
                          {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <>
                              Masuk Sekarang
                              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                            </>
                          )}
                        </span>
                      </button>

                      {/* Divider */}
                      <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-white/5"></div>
                        <span className="flex-shrink mx-4 text-slate-500 text-[10px] uppercase tracking-widest font-bold">atau</span>
                        <div className="flex-grow border-t border-white/5"></div>
                      </div>

                      {/* Register Link */}
                      <p className="text-center text-slate-400 text-sm font-medium">
                        {t("auth.dont_have_account")}{" "}
                        <Link
                          to="/register"
                          className="text-white hover:text-blue-400 transition-colors relative group inline-block"
                        >
                          Daftar Akun Baru
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
                        </Link>
                      </p>
                    </form>
                  </div>
                </div>

                <p className="text-center text-slate-600 text-[10px] mt-8 px-4 leading-relaxed">
                  {t("auth.terms_agreement")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
