import React from 'react';
import { MOCK_ADVANTAGES } from '../constants';
import { Award, Lock, Star, CheckCircle, Ticket, TrendingUp, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { User } from '../types';

interface AdvantageClubProps {
  user: User | null;
  onLoginClick: () => void;
}

export const AdvantageClub: React.FC<AdvantageClubProps> = ({ user, onLoginClick }) => {
  // Logic for the discount calculation with Reset Cycle
  // 1 trip = 1%
  // Max 20 trips = 20%
  // Trip 21 = 1% (Reset)
  
  const totalTrips = user?.tripCount || 0;
  
  // Calculate trips in current cycle (1 to 20)
  // If total is 0, discount is 0.
  // If total is 20, discount is 20.
  // If total is 21, discount is 1.
  const currentDiscount = totalTrips === 0 ? 0 : ((totalTrips - 1) % 20) + 1;
  
  const maxDiscount = 20;
  const progressPercentage = (currentDiscount / maxDiscount) * 100;
  
  const tripsToNextReward = 20 - currentDiscount;

  return (
    <div className="pt-8 pb-24 bg-gradient-to-b from-slate-900 to-slate-950 text-white border-t border-slate-900">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/10 mb-6">
            <Award className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">
            Clube de Vantagens
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
             <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> 100% Gratuito
             </span>
          </div>
          <p className="text-slate-400 max-w-lg mx-auto text-lg">
            Faça parte do nosso grupo exclusivo. Aqui quem ganha é o cliente, sem taxas escondidas, apenas descontos e benefícios.
          </p>
        </div>

        {!user ? (
          <div className="relative bg-slate-800/30 backdrop-blur-md p-10 rounded-2xl border border-slate-700 max-w-lg mx-auto overflow-hidden group hover:border-amber-500/30 transition-colors duration-500">
             {/* Decorative blurred blob */}
             <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-700"></div>

            <Lock className="w-12 h-12 text-slate-500 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold mb-3 text-white">Benefícios Bloqueados</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Você está a um passo de economizar. Faça login ou cadastre-se <strong>gratuitamente</strong> para desbloquear descontos imediatos e acumular carimbos.
            </p>
            <Button variant="secondary" onClick={onLoginClick} fullWidth className="bg-amber-600 hover:bg-amber-500 border-none text-white shadow-lg shadow-amber-900/20">
              Entrar no Clube Grátis
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Loyalty Card System */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 md:p-8 border border-amber-500/30 shadow-2xl relative overflow-hidden max-w-2xl mx-auto">
              {/* Gold Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 relative z-10">
                <div className="text-left">
                  <h3 className="text-xl font-bold text-amber-100 flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-amber-500" />
                    Cartão Fidelidade
                  </h3>
                  <p className="text-amber-500/80 text-sm mt-1">
                    Acumule 20 viagens para completar o ciclo.
                  </p>
                </div>
                <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg px-4 py-2 flex flex-col items-center">
                   <span className="text-xs text-amber-300 uppercase tracking-wide font-bold">Desconto Atual</span>
                   <span className="text-2xl font-bold text-amber-400">{currentDiscount}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative z-10">
                <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium">
                  <span>Início</span>
                  <span>Meta: 20%</span>
                </div>
                <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-700 relative">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.5)] transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                
                <div className="mt-4 flex items-center justify-between text-sm">
                  <p className="text-slate-300">
                    <strong className="text-white">{currentDiscount}</strong> viagens neste ciclo.
                  </p>
                  
                  {currentDiscount === 20 ? (
                     <span className="flex items-center gap-1 text-amber-400 text-xs font-bold animate-pulse">
                        <Award className="w-3 h-3" /> Ciclo Completo! Aproveite 20%.
                     </span>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-400 text-xs">
                      <TrendingUp className="w-3 h-3" /> Faltam {tripsToNextReward} para o máximo
                    </span>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between items-center text-xs text-slate-500">
                    <span>Total histórico de viagens: {totalTrips}</span>
                    <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3"/> Reinicia a cada 20 viagens</span>
                </div>
              </div>
            </div>

            {/* Standard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOCK_ADVANTAGES.map((adv, idx) => (
                <div key={idx} className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 hover:border-amber-500/50 hover:bg-slate-800 transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Star className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{adv.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{adv.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};