import React from 'react';
import { Car as CarType } from '../types';
import { Shield, Zap, Coffee } from 'lucide-react';

interface FleetSectionProps {
  cars: CarType[];
}

export const FleetSection: React.FC<FleetSectionProps> = ({ cars }) => {
  return (
    <section className="pt-24 pb-4 bg-slate-950 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-indigo-500 font-semibold tracking-wider text-sm uppercase">Sua Experiência</span>
          <h2 className="text-4xl font-bold text-white mt-2 mb-4">
            Frota Premium
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Não é possível escolher o modelo específico, mas garantimos que um destes veículos incríveis irá atendê-lo com o máximo conforto e segurança.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cars.map((car, index) => (
            <div key={index} className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10">
              <div className="h-56 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10 opacity-60"></div>
                <img 
                  src={car.image} 
                  alt={car.type} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">Categoria</span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">{car.type}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">{car.description}</p>
                
                <div className="flex items-center gap-4 text-slate-500 text-xs border-t border-slate-800 pt-4">
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-emerald-500" /> Seguro
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-amber-500" /> Rápido
                  </div>
                  <div className="flex items-center gap-1">
                    <Coffee className="w-4 h-4 text-indigo-500" /> Conforto
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};