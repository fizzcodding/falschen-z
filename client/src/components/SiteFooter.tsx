/* Site footer per target spec: two-section design (main + copyright bar).
 * Main: large brand + tagline + description (60%), sidebar with INDEX nav and DIRECT contact/site links (40%).
 * Bottom bar: copyright left, "BUILT IN DHAKA" + blinking cursor right. Inverted navy/paper palette.
 */
import { Link } from "wouter";
import { LIFESPHERE_SITE_URL, PAPER_URL } from "@/data/lifesphere";

const lockupUrl = "/assets/white-version.png";
const footerArt = "/assets/falschen-footer-dither.png";

const indexLinks = [
  { name: "Lifesphere", link: "#lifesphere" },
  { name: "Research", link: "#research" },
  { name: "Team", link: "#team" },
  { name: "Contact", link: "#contact" },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer" id="footer" aria-label="Site footer">
      <div className="footer-art" aria-hidden="true" style={{ backgroundImage: `url(${footerArt})` }} />
      <div className="container footer-inner">
        <div className="footer-main">
          <div className="footer-brand-block">
            <div className="footer-brand">
              <img src={lockupUrl} alt="Team Fälschen" className="footer-lockup" />
            </div>
            <p className="footer-desc">
              Robotics, physics, and AI research out of Dhaka. Two researcher-engineers, one bench, eleven awards — building LifeSphere, Entropia, and Convergō.
            </p>
          </div>

          <nav className="footer-sidebar" aria-label="Footer navigation">
            <div className="footer-col">
              <h3 className="footer-col-head mono">INDEX</h3>
              <ul>
                {indexLinks.map((item) => (
                  <li key={item.name}>
                    <a href={item.link} className="mono">{item.name}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-col">
              <h3 className="footer-col-head mono">DIRECT</h3>
              <ul>
                <li><a href="#contact" className="mono">Send a note</a></li>
                <li><a href={LIFESPHERE_SITE_URL} target="_blank" rel="noopener noreferrer" className="mono">LifeSphere site ↗</a></li>
                <li><a href={PAPER_URL} className="mono">Research paper ↗</a></li>
                <li><Link href="/privacy" className="mono">Privacy</Link></li>
                <li><Link href="/terms" className="mono">Terms</Link></li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="footer-bottom mono">
          <span>© {new Date().getFullYear()} TEAM FÄLSCHEN</span>
          <span className="footer-cursor-wrap">BUILT IN DHAKA<span className="footer-cursor" aria-hidden="true">▍</span></span>
        </div>
      </div>
    </footer>
  );
}
