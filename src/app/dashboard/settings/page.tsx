"use client"
import { useState, useEffect } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { toast } from "sonner"
import { Save, User, Bell, Shield, Cloud, ExternalLink, Send, CheckCircle } from "lucide-react"
import { useAppStore } from "@/store"

export default function SettingsPage() {
  const { userProfile, setUserProfile } = useAppStore()
  const [saving, setSaving] = useState(false)
  
  const [profile, setProfile] = useState({ name: userProfile.name, email: userProfile.email, company: "Enterprise LLC" })
  const [notifications, setNotifications] = useState({ emailAlerts: true, traceFailures: true, weeklyReport: false })
  const [dataRetention, setDataRetention] = useState("30")
  const [testEmailLoading, setTestEmailLoading] = useState(false)
  const [lastPreviewUrl, setLastPreviewUrl] = useState<string | null>(null)

  // Load user email from localStorage (set during login)
  useEffect(() => {
    const savedEmail = localStorage.getItem("ragaai_user_email")
    if (savedEmail) {
      setProfile(p => ({ ...p, email: savedEmail }))
    }
  }, [])

  const handleSave = () => {
    setSaving(true)
    localStorage.setItem("ragaai_user_email", profile.email)
    localStorage.setItem("ragaai_settings", JSON.stringify({ profile, notifications, dataRetention }))
    setUserProfile({ name: profile.name, email: profile.email })
    setTimeout(() => {
      setSaving(false)
      toast.success("Settings saved successfully")
    }, 1000)
  }

  const handleToggleNotification = async (key: keyof typeof notifications, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))

    if (value && profile.email && profile.email.includes("@")) {
      // Send confirmation email when enabling a notification
      const labels: Record<string, string> = {
        emailAlerts: "Email Alerts",
        traceFailures: "Trace Failure Notifications",
        weeklyReport: "Weekly Usage Reports",
      }
      try {
        const res = await fetch("/api/email/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: profile.email,
            subject: `${labels[key]} Enabled — RagaAI Catalyst`,
            title: `${labels[key]} Enabled`,
            message: `You have enabled ${labels[key].toLowerCase()} for your RagaAI Catalyst account. You will now receive notifications at ${profile.email}. You can change this anytime from Settings.`,
            actionUrl: "http://localhost:3001/dashboard/settings",
          }),
        })
        const data = await res.json()
        if (res.ok) {
          toast.success(`Confirmation email sent to ${profile.email}`)
          if (data.previewUrl) setLastPreviewUrl(data.previewUrl)
        }
      } catch {
        // Silently fail - notification toggle still works
      }
    }
  }

  const sendTestEmail = async () => {
    if (!profile.email || !profile.email.includes("@")) {
      toast.error("Please enter a valid email address first")
      return
    }
    setTestEmailLoading(true)
    try {
      const res = await fetch("/api/email/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: profile.email,
          subject: "Welcome Notification — RagaAI Catalyst",
          title: "🎉 Email Notifications Active",
          message: `This is a notification email from RagaAI Catalyst, sent to ${profile.email}. Your email notifications are working perfectly!`,
          actionUrl: "http://localhost:3000/dashboard",
        }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success("Email sent successfully!")
        if (data.previewUrl) setLastPreviewUrl(data.previewUrl)
      } else {
        toast.error(data.error || "Failed to send email")
      }
    } catch {
      toast.error("Network error. Please try again.")
    }
    setTestEmailLoading(false)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Settings" />
      <main className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-6">
        
        <Card>
          <CardHeader className="border-b border-border bg-muted/10">
            <CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Full Name</label>
                <input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Email Address</label>
                <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Company</label>
                <input value={profile.company} onChange={e => setProfile({...profile, company: e.target.value})} className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border bg-muted/10">
            <div className="flex items-center justify-between w-full">
              <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5 text-emerald-500" /> Email Notifications</CardTitle>
              <Button variant="outline" size="sm" icon={<Send className="w-3.5 h-3.5" />} onClick={sendTestEmail} loading={testEmailLoading}>
                Send Email Notification
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {lastPreviewUrl && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20 mb-4">
                <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                <p className="text-xs text-muted-foreground flex-1">
                  Email sent! Using Ethereal mode.
                </p>
                <a
                  href={lastPreviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary font-medium hover:underline shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View Email
                </a>
              </div>
            )}

            <label className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 cursor-pointer">
              <div>
                <span className="text-sm font-medium text-foreground block">Email Alerts</span>
                <span className="text-xs text-muted-foreground">Receive important alerts via email</span>
              </div>
              <input type="checkbox" checked={notifications.emailAlerts} onChange={e => handleToggleNotification("emailAlerts", e.target.checked)} className="w-4 h-4 rounded text-primary focus:ring-primary" />
            </label>
            <label className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 cursor-pointer">
              <div>
                <span className="text-sm font-medium text-foreground block">Trace Failure Notifications</span>
                <span className="text-xs text-muted-foreground">Get notified immediately when a pipeline trace fails</span>
              </div>
              <input type="checkbox" checked={notifications.traceFailures} onChange={e => handleToggleNotification("traceFailures", e.target.checked)} className="w-4 h-4 rounded text-primary focus:ring-primary" />
            </label>
            <label className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 cursor-pointer">
              <div>
                <span className="text-sm font-medium text-foreground block">Weekly Usage Report</span>
                <span className="text-xs text-muted-foreground">Receive a weekly summary of token usage and costs</span>
              </div>
              <input type="checkbox" checked={notifications.weeklyReport} onChange={e => handleToggleNotification("weeklyReport", e.target.checked)} className="w-4 h-4 rounded text-primary focus:ring-primary" />
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border bg-muted/10">
            <CardTitle className="flex items-center gap-2"><Cloud className="w-5 h-5 text-blue-500" /> Data Management</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Data Retention Period (Days)</label>
              <select value={dataRetention} onChange={e => setDataRetention(e.target.value)} className="w-full md:w-1/2 h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="7">7 Days</option>
                <option value="30">30 Days</option>
                <option value="90">90 Days</option>
                <option value="365">1 Year</option>
                <option value="infinite">Keep Forever</option>
              </select>
              <p className="text-xs text-muted-foreground mt-2">Traces and logs older than the retention period will be automatically permanently deleted.</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4"/>}>Save Changes</Button>
        </div>

      </main>
    </div>
  )
}
