/* Signal Forge app shell: light research showcase, client-side routes with clear escape paths. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function SimplePage({ title, label, children }: { title: string; label: string; children: React.ReactNode }) {
  return <div className="site-shell legal-page"><header className="legal-header container"><a href="/" className="mono">← FÄLSCHEN</a><span className="mono">{label}</span></header><main className="container legal-content"><p className="eyebrow mono">TEAM FÄLSCHEN / {label}</p><h1>{title}</h1>{children}<p className="mono legal-updated">LAST UPDATED / AUGUST 21, 2026</p></main></div>;
}

function Router() {
  return <Switch><Route path="/" component={Home} /><Route path="/privacy"><SimplePage title="Privacy Policy" label="PRIVACY"><p>Team Fälschen respects your privacy. This showcase page does not ask you to create an account, does not sell personal information, and does not intentionally collect sensitive personal data. If you use the contact form, the information you enter is intended only for responding to your note and is not presented here as a stored public record.</p><p>Basic anonymous site analytics may be provided by the hosting environment to understand page performance and traffic. You can disable cookies through your browser. For questions about this policy, use the contact form on the home page.</p></SimplePage></Route><Route path="/terms"><SimplePage title="Terms & Conditions" label="TERMS"><p>By viewing this website, you agree to use its content lawfully and respectfully. The research descriptions, project names, marks, and written materials belong to Team Fälschen or their respective owners. They are provided for showcase and informational purposes and may not be reproduced, redistributed, or represented as your own without permission.</p><p>Project descriptions are snapshots of ongoing work and do not constitute professional, medical, engineering, or safety advice. Team Fälschen may update or remove content as research develops.</p></SimplePage></Route><Route path="/thank-you"><SimplePage title="Transmission received" label="CONFIRMATION"><p>Your note was captured by the interface. Thank you for taking the time to reach out to Team Fälschen.</p><a className="sharp-button sharp-button-dark" href="/">Return to the build ↗</a></SimplePage></Route><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>;
}

export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>; }
