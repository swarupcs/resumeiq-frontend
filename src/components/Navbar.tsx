import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LogOut, User, Sun, Moon, Menu, X, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/primitives';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown';
import { selectCurrentUser } from '@/features/authSlice';
import { useTheme } from '@/context/ThemeContext';
import { useLogout } from '@/hooks/auth/useLogout';

const Navbar = () => {
  const { mutate: handleLogout, isPending: isLoggingOut } = useLogout();
  const location = useLocation();
  const user = useSelector(selectCurrentUser);
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const getInitials = () => {
    if (user?.firstName && user?.lastName) return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    return user?.emailId?.[0]?.toUpperCase() ?? 'U';
  };

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How it Works' },
    { href: '#testimonials', label: 'Testimonials' },
  ];
  const isLanding = location.pathname === '/';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 opacity-90" />
            <Zap className="h-4 w-4 text-white relative z-10 fill-white" />
          </div>
          <span className="font-display text-lg font-bold text-foreground tracking-tight">
            Resume<span className="text-gradient">IQ</span>
          </span>
        </Link>

        {isLanding && (
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/60 transition-all duration-200">
                {link.label}
              </a>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="flex items-center justify-center w-9 h-9 rounded-xl border border-border hover:border-primary/40 bg-secondary/40 hover:bg-secondary transition-all duration-200" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-primary" />}
          </button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <button className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-border hover:border-primary/40 bg-secondary/40 hover:bg-secondary transition-all duration-200">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-xs font-bold">{getInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground hidden sm:block">{user.firstName}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-3 p-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-sm font-bold">{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">{user.firstName} {user.lastName}</span>
                    <span className="text-xs text-muted-foreground truncate">{user.emailId}</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.location.href = '/dashboard'} className="gap-2">
                  <User className="h-4 w-4" /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleLogout()} className="text-destructive gap-2">
                  {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                  {isLoggingOut ? 'Logging out...' : 'Log out'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-primary to-purple-600 text-white border-0 shadow-lg" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
              {isLanding && (
                <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-secondary/40 text-muted-foreground">
                  {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </button>
              )}
            </>
          )}
        </div>
      </div>
      {isLanding && mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="flex items-center px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/60 transition-all" onClick={() => setMobileOpen(false)}>
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
