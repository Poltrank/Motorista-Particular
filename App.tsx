import React, { useState, useEffect } from 'react';
import { BookingForm } from './components/BookingForm';
import { FleetSection } from './components/FleetSection';
import { AdvantageClub } from './components/AdvantageClub';
import { AdminPanel } from './components/AdminPanel';
import { User, ViewState, Car, TripRecord } from './types';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Lock, User as UserIcon, LogOut, Menu, X, Phone } from 'lucide-react';
import { WHATSAPP_NUMBER, CAR_TYPES } from './constants';

// Admin Credentials from prompt
const ADMIN_USER = "ADM";
const ADMIN_PASS = "Armandinho10#";

// Default Hero Image
const DEFAULT_HERO_IMAGE = "https://images.unsplash.com/photo-1493238792015-faa33f3cf54b?q=80&w=2073&auto=format&fit=crop";

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.HOME);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Custom Settings State (Hero & Fleet Images)
  const [heroImage, setHeroImage] = useState<string>(DEFAULT_HERO_IMAGE);
  const [fleetCars, setFleetCars] = useState<Car[]>(CAR_TYPES);

  // Login State fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin Modal State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // Mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Load settings from local storage
    const savedHero = localStorage.getItem('heroImage');
    const savedFleet = localStorage.getItem('fleetCars');

    if (savedHero) setHeroImage(savedHero);
    if (savedFleet) setFleetCars(JSON.parse(savedFleet));
  }, []);

  const handleUpdateSettings = (newHero: string, newFleet: Car[]) => {
    setHeroImage(newHero);
    setFleetCars(newFleet);
    localStorage.setItem('heroImage', newHero);
    localStorage.setItem('fleetCars', JSON.stringify(newFleet));
  };

  const getConfirmedTripCount = (userId: string) => {
    const history: TripRecord[] = JSON.parse(localStorage.getItem('tripHistory') || '[]');
    // Count trips that match the userId AND are confirmed
    return history.filter(t => t.userId === userId && t.status === 'confirmed').length;
  };

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for Admin Login directly from main login
    // Using trim() to handle accidental spaces
    if (loginEmail.trim() === ADMIN_USER && loginPass.trim() === ADMIN_PASS) {
      setIsAdminLoggedIn(true);
      setViewState(ViewState.ADMIN);
      setLoginError('');
      // Clear fields
      setLoginEmail('');
      setLoginPass('');
      return;
    }

    if (loginEmail && loginPass) {
      // Mock login success - In a real app, this would be validated against a backend
      // We assign a static ID '1' for this demo user
      const mockUserId = '1';
      const tripCount = getConfirmedTripCount(mockUserId);

      setCurrentUser({
        id: mockUserId,
        name: 'Cliente VIP',
        email: loginEmail,
        isClubMember: true,
        tripCount: tripCount 
      });
      setViewState(ViewState.HOME);
      setLoginError('');
      // Clear fields
      setLoginEmail('');
      setLoginPass('');
    } else {
      setLoginError('Preencha todos os campos.');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUser.trim() === ADMIN_USER && adminPass.trim() === ADMIN_PASS) {
      setIsAdminLoggedIn(true);
      setShowAdminModal(false);
      setViewState(ViewState.ADMIN);
      setAdminError('');
    } else {
      setAdminError('Credenciais inválidas.');
    }
  };

  const renderHeader = () => (
    <header className="absolute top-0 w-full z-50 border-b border-white/10 bg-slate-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <div 
          className="cursor-pointer group"
          onClick={() => setViewState(ViewState.HOME)}
        >
          <h1 className="text-2xl font-bold text-white tracking-tight flex flex-col sm:flex-row sm:gap-2 sm:items-baseline">
            <span>MOTORISTA</span>
            <span className="text-indigo-500 group-hover:text-indigo-400 transition-colors">PROFISSIONAL</span>
          </h1>
          <span className="text-xs text-slate-400 tracking-widest uppercase">Jaraguá do Sul</span>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-4 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
              <span className="text-sm text-indigo-200">Olá, {currentUser.name}</span>
              <div className="h-4 w-px bg-slate-600"></div>
              <button 
                className="text-slate-400 hover:text-white transition-colors"
                onClick={() => setCurrentUser(null)}
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Button 
              variant="secondary" 
              onClick={() => setViewState(ViewState.LOGIN)}
              className="text-sm px-6"
            >
              <UserIcon className="w-4 h-4" /> Área do Cliente
            </Button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4">
          {currentUser ? (
             <div className="flex flex-col gap-4">
                <p className="text-slate-300">Logado como <span className="text-white font-bold">{currentUser.name}</span></p>
                <Button variant="outline" onClick={() => setCurrentUser(null)} fullWidth>Sair</Button>
             </div>
          ) : (
            <Button variant="secondary" onClick={() => { setViewState(ViewState.LOGIN); setIsMobileMenuOpen(false); }} fullWidth>
              Área do Cliente
            </Button>
          )}
        </div>
      )}
    </header>
  );

  const renderFooter = () => (
    <footer className="bg-slate-950 text-slate-400 py-12 px-6 border-t border-slate-900">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <p className="text-xl font-bold text-white mb-2">Motorista Profissional</p>
          <p className="text-indigo-500 mb-4">Jaraguá do Sul - SC</p>
          <p className="text-sm max-w-xs">Agendamentos rápidos e seguros via WhatsApp para toda a região.</p>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-2">
          <a 
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-2xl font-bold text-white tracking-wider hover:text-emerald-400 transition-colors"
          >
             <Phone className="w-6 h-6" />
             (47) 97400-8115
          </a>
          <span className="text-xs text-slate-600">© 2024 Todos os direitos reservados.</span>
          {/* Hidden Admin Access */}
          <button 
            onClick={() => setShowAdminModal(true)}
            className="text-slate-900 hover:text-slate-800 transition-colors p-2 mt-4"
            aria-label="Admin Access"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );

  const renderLogin = () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[100px]"></div>

      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Bem-vindo</h2>
          <p className="text-slate-400 mt-2">Acesse sua conta para ver benefícios</p>
        </div>
        
        <form onSubmit={handleUserLogin} className="space-y-5">
          <Input 
            label="Email ou Usuário" 
            type="text" 
            placeholder="seu@email.com ou usuário" 
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <Input 
            label="Senha" 
            type="password" 
            placeholder="******" 
            value={loginPass}
            onChange={(e) => setLoginPass(e.target.value)}
          />
          {loginError && <p className="text-red-400 text-sm bg-red-950/30 p-2 rounded border border-red-900/50">{loginError}</p>}
          <Button type="submit" fullWidth className="mt-4">Entrar</Button>
        </form>
        
        <div className="mt-6 pt-6 border-t border-slate-800 text-center">
           <button onClick={() => alert("Simulação: Cadastro realizado!")} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
             Criar nova conta
           </button>
        </div>
        
        <button onClick={() => setViewState(ViewState.HOME)} className="absolute top-4 left-4 text-slate-500 hover:text-white transition-colors">
          ← Voltar
        </button>
      </div>
    </div>
  );

  if (viewState === ViewState.ADMIN && isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-100">
        <AdminPanel 
          onLogout={() => { setIsAdminLoggedIn(false); setViewState(ViewState.HOME); }} 
          currentHeroImage={heroImage}
          currentCars={fleetCars}
          onUpdateSettings={handleUpdateSettings}
        />
      </div>
    );
  }

  if (viewState === ViewState.LOGIN) {
    return renderLogin();
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100 selection:bg-indigo-500/30 relative">
      {renderHeader()}

      {/* Modern Hero Section */}
      <div className="relative h-[500px] flex items-start justify-center overflow-hidden pt-32">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0 transition-opacity duration-1000">
          <img 
            src={heroImage} 
            alt="Night Drive" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/50 to-slate-950"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 backdrop-blur-md">
            <span className="text-indigo-300 text-sm font-semibold tracking-wide uppercase">Jaraguá do Sul e Região</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white drop-shadow-lg">
            Sua viagem, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">elevada.</span>
          </h1>
          <p className="text-xl md:text-2xl font-light text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Experiência premium em transporte executivo. Pontualidade garantida e frota diversificada para sua necessidade.
          </p>
        </div>
      </div>

      <main className="flex-grow pb-20 bg-slate-950 relative">
        <BookingForm user={currentUser} />
        <FleetSection cars={fleetCars} />
        <AdvantageClub user={currentUser} onLoginClick={() => setViewState(ViewState.LOGIN)} />
      </main>

      {renderFooter()}

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-400 text-white p-4 rounded-full shadow-lg shadow-emerald-500/30 transition-transform hover:scale-110 flex items-center justify-center animate-bounce"
        aria-label="Falar no WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Admin Modal - KEPT AS BACKUP */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
              <Lock className="w-5 h-5 text-indigo-500" /> Acesso Restrito
            </h3>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <Input 
                placeholder="Usuário" 
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
              <Input 
                type="password" 
                placeholder="Senha" 
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
              {adminError && <p className="text-red-400 text-xs font-semibold">{adminError}</p>}
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="ghost" fullWidth onClick={() => setShowAdminModal(false)}>Cancelar</Button>
                <Button type="submit" fullWidth>Acessar</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;