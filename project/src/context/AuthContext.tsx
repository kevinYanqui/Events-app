  import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

  // Interfaz para el usuario
  interface User {
    id: number;
    name: string;
    email: string;
    role: 'ADMIN' | 'CLIENTE';
    telefono: string;
  }

  interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
  }

  const AuthContext = createContext<AuthContextType | undefined>(undefined);

  const API_URL = 'http://localhost:8080/api/auth/login';

  export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
      setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Credenciales inválidas');
        }
        const data = await response.json();

        const userData: User = {
          id: data.id,
          name: data.nombre,
          email: data.email,
          role: data.roles.includes('ADMIN') ? 'ADMIN' : 'CLIENTE',
          telefono: data.telefono,
        };

        setUser(userData);
        setToken(data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', data.token);
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

    const logout = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
          {children}
        </AuthContext.Provider>
    );
  };

  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };