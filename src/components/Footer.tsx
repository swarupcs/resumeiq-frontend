import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export const Footer = () => (
  <footer className="border-t border-border bg-card/30">
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600" />
            <Zap className="h-4 w-4 text-white fill-white relative z-10" />
          </div>
          <span className="font-display text-base font-bold text-foreground">Resum<span className="text-gradient">IQ</span></span>
        </Link>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} ResumIQ. All rights reserved.</p>
        <div className="flex items-center gap-4">
          {['Privacy Policy', 'Terms of Service', 'Contact'].map((item) => (
            <a key={item} href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{item}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);
