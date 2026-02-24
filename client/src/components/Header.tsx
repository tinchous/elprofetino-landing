import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Settings, User, LogOut } from "lucide-react";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <h1 className="text-2xl font-display font-bold">
                <span className="text-foreground">ElProfe</span>
                <span className="text-glow-cyan" style={{ color: '#00d4ff' }}>Tino</span>
              </h1>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Dashboard link for all authenticated users */}
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>

                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    Perfil
                  </Button>
                </Link>

                {/* Admin link - only visible for admin users */}
                {user?.role === 'admin' && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="gap-2 text-cyan-500 hover:text-cyan-400">
                      <Settings className="w-4 h-4" />
                      Admin
                    </Button>
                  </Link>
                )}

                {/* User info and logout */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{user?.name}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => logout()}
                    className="gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Salir
                  </Button>
                </div>
              </>
            ) : (
              <Button 
                size="sm" 
                className="glow-cyan"
                style={{ backgroundColor: '#00d4ff', color: '#0a1628' }}
                asChild
              >
                <a href={getLoginUrl()}>Iniciar Sesión</a>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
