/* Signal Forge 404: quiet technical dead-end with sharp borders, readable recovery action, and no decorative gimmicks. */
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => { document.title = "404 | Team Fälschen"; }, []);
  return <div className="site-shell legal-page"><main className="container legal-content not-found"><p className="eyebrow mono">TF / ERROR REPORT</p><h1>404<br /><span>OFF GRID.</span></h1><p>The requested coordinate does not exist in this build.</p><a className="sharp-button sharp-button-dark" href="/">Return to the build ↗</a></main></div>;
}
