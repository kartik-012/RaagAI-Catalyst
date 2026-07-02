"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Eye, EyeOff, ArrowRight, Shield, GitBranch, FlaskConical, Mail, Lock, X, CheckCircle, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import * as Dialog from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/Button"
import { toast } from "sonner"

const features = [
  { icon: GitBranch, title: "Agentic Tracing", desc: "Trace every LLM call across LangChain, LlamaIndex, OpenAI, CrewAI and more" },
  { icon: FlaskConical, title: "Evaluations", desc: "Run Faithfulness, Hallucination, Relevance and 20+ metrics on your datasets" },
  { icon: Shield, title: "Guardrails", desc: "Block toxic, PII-leaking or off-topic outputs before they reach your users" },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Forgot password state
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Sign up state
  const [signUpOpen, setSignUpOpen] = useState(false)
  const [signUpEmail, setSignUpEmail] = useState("")
  const [signUpPassword, setSignUpPassword] = useState("")
  const [signUpConfirm, setSignUpConfirm] = useState("")
  const [signUpLoading, setSignUpLoading] = useState(false)
  const [showSignUpPassword, setShowSignUpPassword] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Enter both email and password")
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    
    // Check against mock database (localStorage)
    const savedEmail = localStorage.getItem("ragaai_registered_email") || "kartikraikar2005@gmail.com"
    const savedPassword = localStorage.getItem("ragaai_password") || "admin123"
    
    if (email !== savedEmail || password !== savedPassword) {
      toast.error("Invalid email or password")
      setLoading(false)
      return
    }

    localStorage.setItem("ragaai_token", "demo_token")
    localStorage.setItem("ragaai_user_email", email)
    toast.success("Authenticated successfully")
    router.push("/dashboard")
    setLoading(false)
  }

  const handleForgotPassword = async () => {
    if (!forgotEmail || !forgotEmail.includes("@")) {
      toast.error("Enter a valid email address")
      return
    }
    setForgotLoading(true)
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Failed to send email")
        setForgotLoading(false)
        return
      }

      setForgotSent(true)
      setPreviewUrl(data.previewUrl)
      toast.success("Password reset email sent!")
    } catch (err) {
      toast.error("Network error. Please try again.")
    }
    setForgotLoading(false)
  }

  const resetForgotState = () => {
    setForgotOpen(false)
    setForgotEmail("")
    setForgotSent(false)
    setForgotLoading(false)
    setPreviewUrl(null)
  }

  const handleSignUp = async () => {
    if (!signUpEmail || !signUpPassword || !signUpConfirm) {
      toast.error("Please fill in all fields")
      return
    }
    if (signUpPassword !== signUpConfirm) {
      toast.error("Passwords do not match")
      return
    }
    setSignUpLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    localStorage.setItem("ragaai_registered_email", signUpEmail)
    localStorage.setItem("ragaai_password", signUpPassword)
    localStorage.setItem("ragaai_token", "demo_token")
    localStorage.setItem("ragaai_user_email", signUpEmail)
    toast.success("Account created successfully!")
    router.push("/dashboard")
    setSignUpLoading(false)
  }

  const resetSignUpState = () => {
    setSignUpOpen(false)
    setSignUpEmail("")
    setSignUpPassword("")
    setSignUpConfirm("")
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 border-r border-border p-12 relative z-10 overflow-hidden">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 z-10"
        >
          <motion.div 
            animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/50"
          >
            <Zap className="w-4.5 h-4.5 text-white" />
          </motion.div>
          <span className="font-bold text-lg text-foreground tracking-tight">RagaAI Catalyst</span>
        </motion.div>

        <div className="space-y-12 z-10">
          <motion.div
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
          >
            <motion.h1 
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="text-4xl font-extrabold text-foreground leading-tight tracking-tight"
            >
              Enterprise LLM<br />
              <motion.span 
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-[length:200%_auto]"
              >
                Observability Platform
              </motion.span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-muted-foreground text-base leading-relaxed max-w-sm"
            >
              Evaluate, trace, and safeguard your LLM applications — from prototype to production.
            </motion.p>
          </motion.div>

          <div className="space-y-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -50, rotate: -5 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ delay: 0.5 + i * 0.15, type: "spring", stiffness: 200, damping: 15 }}
                whileHover={{ scale: 1.05, x: 10, backgroundColor: "rgba(139, 92, 246, 0.05)" }}
                className="flex gap-4 p-3 -ml-3 rounded-xl cursor-default transition-colors"
              >
                <motion.div 
                  whileHover={{ rotate: 180, scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 shadow-inner"
                >
                  <Icon className="w-5 h-5 text-primary" />
                </motion.div>
                <div>
                  <p className="text-sm font-bold text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="text-xs font-medium text-muted-foreground/60 z-10"
        >
          © 2026 RagaAI · v2.1.7
        </motion.p>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm space-y-6"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">RagaAI Catalyst</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Sign in</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your email and password to continue
            </p>
          </div>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 h-10 rounded-md border border-border bg-background text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => { setForgotOpen(true); setForgotEmail(email); }}
                  className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 h-10 rounded-md border border-border bg-background text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              loading={loading}
              onClick={handleLogin}
              icon={!loading ? <ArrowRight className="w-4 h-4" /> : undefined}
            >
              {loading ? "Authenticating..." : "Sign in"}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Don&apos;t have an account?{" "}
            <span className="text-primary font-medium cursor-pointer hover:underline" onClick={() => setSignUpOpen(true)}>Create Account</span>
          </p>
        </motion.div>
      </div>

      {/* Forgot Password Modal */}
      <Dialog.Root open={forgotOpen} onOpenChange={(open) => { if (!open) resetForgotState() }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-xl p-6 w-full max-w-md z-50 shadow-2xl">
            <AnimatePresence mode="wait">
              {!forgotSent ? (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Dialog.Title className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" /> Reset Password
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-muted-foreground mt-1">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                  </Dialog.Description>

                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleForgotPassword()}
                          placeholder="you@gmail.com"
                          className="w-full pl-10 pr-4 h-10 rounded-md border border-border bg-background text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="outline" onClick={resetForgotState}>Cancel</Button>
                      <Button onClick={handleForgotPassword} loading={forgotLoading}>
                        Send Reset Link
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                  <Dialog.Title className="text-lg font-semibold text-foreground">
                    Check Your Email
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-muted-foreground mt-2 mb-6">
                    We&apos;ve sent a password reset link to <strong className="text-foreground">{forgotEmail}</strong>. 
                    Please check your inbox and follow the instructions.
                  </Dialog.Description>

                  {previewUrl && (
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors mb-4"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Email Preview (Ethereal)
                    </a>
                  )}

                  <div className="mt-4">
                    <Button onClick={resetForgotState} className="w-full">
                      Back to Sign In
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Didn&apos;t receive the email?{" "}
                    <button onClick={() => { setForgotSent(false); }} className="text-primary hover:underline font-medium">
                      Try again
                    </button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <Dialog.Close asChild>
              <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Sign Up Modal */}
      <Dialog.Root open={signUpOpen} onOpenChange={(open) => { if (!open) resetSignUpState() }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-xl p-6 w-full max-w-md z-50 shadow-2xl">
            <Dialog.Title className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" /> Create Account
            </Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground mt-1">
              Create a new account to access the Catalyst platform.
            </Dialog.Description>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="you@gmail.com"
                    className="w-full pl-10 pr-4 h-10 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showSignUpPassword ? "text" : "password"}
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 h-10 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showSignUpPassword ? "text" : "password"}
                    value={signUpConfirm}
                    onChange={(e) => setSignUpConfirm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSignUp()}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 h-10 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border mt-4">
                <Button variant="outline" onClick={resetSignUpState}>Cancel</Button>
                <Button onClick={handleSignUp} loading={signUpLoading}>
                  Create Account
                </Button>
              </div>
            </div>
            
            <Dialog.Close asChild>
              <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  )
}
