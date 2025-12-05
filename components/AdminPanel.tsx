import React, { useEffect, useState } from 'react';
import { TripRecord, Car, TripStatus } from '../types';
import { Button } from './Button';
import { Input } from './Input';
import { LogOut, Trash2, Image, Save, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface AdminPanelProps {
  onLogout: () => void;
  currentHeroImage: string;
  currentCars: Car[];
  onUpdateSettings: (heroImage: string, cars: Car[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout, currentHeroImage, currentCars, onUpdateSettings }) => {
  const [history, setHistory] = useState<TripRecord[]>([]);
  
  // Settings State
  const [heroImage, setHeroImage] = useState(currentHeroImage);
  const [cars, setCars] = useState<Car[]>(currentCars);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const data = localStorage.getItem('tripHistory');
    if (data) {
      // Ensure records have a status property if loaded from old data
      const parsedData = JSON.parse(data).map((record: any) => ({
        ...record,
        status: record.status || 'pending'
      }));
      setHistory(parsedData);
    }
  }, []);

  const updateTripStatus = (id: string, newStatus: TripStatus) => {
    const updatedHistory = history.map(trip => 
      trip.id === id ? { ...trip, status: newStatus } : trip
    );
    setHistory(updatedHistory);
    localStorage.setItem('tripHistory', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    if(window.confirm("Tem certeza que deseja limpar o histórico?")) {
      localStorage.removeItem('tripHistory');
      setHistory([]);
    }
  };

  const handleCarImageChange = (index: number, newUrl: string) => {
    const updatedCars = [...cars];
    updatedCars[index].image = newUrl;
    setCars(updatedCars);
  };

  const saveSettings = () => {
    onUpdateSettings(heroImage, cars);
    setSaveStatus('Alterações salvas com sucesso!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const getStatusBadge = (status: TripStatus) => {
    switch (status) {
      case 'confirmed':
        return <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full"><CheckCircle className="w-3 h-3"/> Realizada</span>;
      case 'cancelled':
        return <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full"><XCircle className="w-3 h-3"/> Cancelada</span>;
      default:
        return <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full"><Clock className="w-3 h-3"/> Orçamento/Pendente</span>;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen bg-slate-100 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-slate-800">Painel Administrativo</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onLogout} className="bg-slate-700 hover:bg-slate-600">
            <LogOut className="w-4 h-4" /> Sair
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SECTION 1: EDIT SITE PHOTOS */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden h-fit">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h2 className="font-semibold text-slate-700 flex items-center gap-2">
              <Image className="w-5 h-5 text-indigo-500" />
              Editar Fotos do Site
            </h2>
            {saveStatus && <span className="text-xs font-bold text-emerald-600 animate-pulse">{saveStatus}</span>}
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Imagem de Fundo (Topo)</label>
              <div className="flex gap-2">
                <Input 
                  value={heroImage} 
                  onChange={(e) => setHeroImage(e.target.value)}
                  placeholder="URL da imagem (https://...)"
                  className="bg-white border-slate-300 text-slate-800 focus:ring-indigo-500"
                />
              </div>
              <div className="mt-2 h-24 w-full bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative">
                  <img src={heroImage} alt="Preview" className="w-full h-full object-cover opacity-80" />
                  <span className="absolute bottom-1 right-2 text-xs bg-black/50 text-white px-2 rounded">Preview</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <label className="block text-sm font-medium text-slate-700 mb-4">Fotos da Frota (URLs)</label>
              {cars.map((car, idx) => (
                <div key={idx} className="mb-4 p-3 border border-slate-200 rounded-lg bg-slate-50/50">
                  <span className="text-xs font-bold text-indigo-600 uppercase mb-1 block">{car.type}</span>
                  <Input 
                    value={car.image}
                    onChange={(e) => handleCarImageChange(idx, e.target.value)}
                    placeholder="URL da imagem"
                    className="bg-white border-slate-300 text-slate-800 text-sm mb-2"
                  />
                  <div className="h-16 w-24 bg-slate-200 rounded overflow-hidden">
                    <img src={car.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={saveSettings} fullWidth className="mt-4">
              <Save className="w-4 h-4" /> Salvar Alterações
            </Button>
          </div>
        </div>

        {/* SECTION 2: TRIP HISTORY */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-[800px]">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
            <div>
                <h2 className="font-semibold text-slate-700">Gestão de Solicitações</h2>
                <p className="text-xs text-slate-500">Confirme as viagens para gerar pontos de fidelidade</p>
            </div>
            <Button variant="outline" onClick={clearHistory} className="text-red-500 border-red-200 hover:bg-red-50">
                <Trash2 className="w-4 h-4" /> Limpar
            </Button>
          </div>
          
          {history.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              Nenhum registro encontrado.
            </div>
          ) : (
            <div className="overflow-x-auto overflow-y-auto flex-grow">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-xs sticky top-0 z-10">
                  <tr>
                    <th className="p-4 bg-slate-100">Status</th>
                    <th className="p-4 bg-slate-100">Cliente/Data</th>
                    <th className="p-4 bg-slate-100">Trajeto</th>
                    <th className="p-4 bg-slate-100 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.slice().reverse().map((trip) => (
                    <tr key={trip.id} className="hover:bg-slate-50">
                      <td className="p-4">
                        {getStatusBadge(trip.status)}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-slate-800">{trip.clientName}</div>
                        <div className="text-xs text-slate-500">{trip.date}</div>
                        {trip.userId && <div className="text-[10px] bg-indigo-100 text-indigo-700 px-1 rounded inline-block mt-1">Membro</div>}
                      </td>
                      <td className="p-4 text-slate-600 max-w-[200px]">
                          <div className="flex flex-col gap-1 text-xs truncate">
                              <span className="font-bold truncate" title={trip.pickup}>De: <span className="font-normal">{trip.pickup}</span></span>
                              <span className="font-bold truncate" title={trip.destination}>Para: <span className="font-normal">{trip.destination}</span></span>
                          </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                           {trip.status === 'pending' && (
                             <>
                               <button 
                                 onClick={() => updateTripStatus(trip.id, 'confirmed')}
                                 title="Confirmar Viagem (Gera pontos)"
                                 className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                               >
                                 <CheckCircle className="w-5 h-5" />
                               </button>
                               <button 
                                 onClick={() => updateTripStatus(trip.id, 'cancelled')}
                                 title="Cancelar/Rejeitar"
                                 className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                               >
                                 <XCircle className="w-5 h-5" />
                               </button>
                             </>
                           )}
                           {trip.status === 'confirmed' && (
                             <button 
                               onClick={() => updateTripStatus(trip.id, 'cancelled')}
                               className="text-xs text-red-500 hover:underline"
                             >
                               Cancelar
                             </button>
                           )}
                           {trip.status === 'cancelled' && (
                             <button 
                               onClick={() => updateTripStatus(trip.id, 'confirmed')}
                               className="text-xs text-emerald-500 hover:underline"
                             >
                               Reativar
                             </button>
                           )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};