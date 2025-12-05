import React, { useState, useEffect } from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { BookingFormState, Address, User, TripRecord } from '../types';
import { WHATSAPP_NUMBER } from '../constants';
import { Send, MapPin, Sparkles, Car, Clock } from 'lucide-react';
import { generateTravelTip } from '../services/geminiService';

interface BookingFormProps {
  user: User | null;
}

export const BookingForm: React.FC<BookingFormProps> = ({ user }) => {
  const [formData, setFormData] = useState<BookingFormState>({
    name: '',
    whatsapp: '',
    time: '',
    needsTrunk: false,
    pickup: { street: '', number: '', neighborhood: '' },
    destination: { street: '', number: '', neighborhood: '' }
  });
  const [tip, setTip] = useState<string>("");

  useEffect(() => {
    // Generate a tip on component mount
    generateTravelTip().then(setTip);
  }, []);

  // Autofill name if user logs in
  useEffect(() => {
    if (user) {
        setFormData(prev => ({...prev, name: user.name}));
    }
  }, [user]);

  const handleAddressChange = (
    type: 'pickup' | 'destination',
    field: keyof Address,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  // Helper to check if address is an airport
  const isAirport = (address: string) => address.toLowerCase().includes('aeroporto');
  
  const isPickupAirport = isAirport(formData.pickup.street);
  const isDestinationAirport = isAirport(formData.destination.street);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.whatsapp) {
      alert("O WhatsApp é obrigatório para contato.");
      return;
    }

    if (!formData.time) {
      alert("Por favor, informe a data e hora da viagem.");
      return;
    }

    // Custom validation logic
    
    // 1. Validate Pickup
    if (!isPickupAirport) {
        if (!formData.pickup.number || !formData.pickup.neighborhood) {
            alert("Por favor, preencha o Número e o Bairro do endereço de embarque.");
            return;
        }
    }

    // 2. Validate Destination
    if (!isDestinationAirport) {
        if (!formData.destination.number || !formData.destination.neighborhood) {
             alert("Por favor, preencha o Número e o Bairro do destino.");
             return;
        }
    }

    const pickupDetails = isPickupAirport 
        ? `📍 ${formData.pickup.street}` // Just the name/airport
        : `📍 Rua: ${formData.pickup.street}\n   Nº: ${formData.pickup.number}\n   Bairro: ${formData.pickup.neighborhood}`;

    const destDetails = isDestinationAirport
        ? `🏁 ${formData.destination.street}`
        : `🏁 Rua: ${formData.destination.street}\n   Nº: ${formData.destination.number}\n   Bairro: ${formData.destination.neighborhood}`;

    // Format Date
    const dateObj = new Date(formData.time);
    const formattedDate = dateObj.toLocaleString('pt-BR', { 
        weekday: 'short', 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    // Loyalty Status Logic for Message
    // Cycle Logic: 1 trip = 1%, resets after 20.
    const tripCount = user?.tripCount || 0;
    const loyaltyDiscount = tripCount === 0 ? 0 : ((tripCount - 1) % 20) + 1;
    
    const clubStatus = user
        ? `👑 *MEMBRO DO CLUBE* \n(Total Viagens: ${tripCount} | Desconto Fidelidade: ${loyaltyDiscount}%)`
        : `👤 *Cliente Visitante*`;

    const message = `
*Nova Solicitação de Viagem - Motorista Profissional* 🚀

${clubStatus}

*Cliente:* ${formData.name}
*WhatsApp:* ${formData.whatsapp}
*Data e Hora:* ${formattedDate} 📅
*Precisa de Porta-malas:* ${formData.needsTrunk ? 'Sim ✅' : 'Não ❌'}

*De:* 
${pickupDetails}

*Para:*
${destDetails}

_Agendamento via Site_
    `.trim();

    // Save to local history for Admin demo
    const history: TripRecord[] = JSON.parse(localStorage.getItem('tripHistory') || '[]');
    history.push({
      id: Date.now().toString(),
      userId: user?.id, // Link to user if logged in
      date: new Date().toLocaleString('pt-BR'),
      clientName: formData.name,
      pickup: formData.pickup.street,
      destination: formData.destination.street,
      status: 'pending' // Default status is pending
    });
    localStorage.setItem('tripHistory', JSON.stringify(history));

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="relative z-20 -mt-32 max-w-5xl mx-auto px-4">
      <div className="bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 border-b border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Car className="text-indigo-500" />
              Agendar Viagem
            </h2>
            <p className="text-slate-400 text-sm">Preencha os dados e confirme no WhatsApp</p>
          </div>
          {tip && (
            <div className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <p className="text-indigo-200 text-xs font-medium italic max-w-xs truncate md:max-w-md">
                "{tip}"
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {/* User Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-start">
            <Input 
              label="Seu Nome" 
              placeholder="Como prefere ser chamado?" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            
            <div className="flex flex-col">
              <Input 
                  label="Data e Hora" 
                  type="datetime-local"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="[&::-webkit-calendar-picker-indicator]:invert" // Fix for dark mode calendar icon
              />
              <p className="text-xs text-amber-500 mt-1.5 flex items-center gap-1 font-medium">
                 <Clock className="w-3 h-3" />
                 Mínimo 30min de antecedência
              </p>
            </div>

            <div className="relative">
              <Input 
                label="WhatsApp (Obrigatório)" 
                placeholder="(47) 99999-9999" 
                type="tel"
                required 
                value={formData.whatsapp}
                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                className="border-indigo-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 relative">
            {/* Divider for desktop */}
            <div className="hidden lg:block absolute left-1/2 top-4 bottom-4 w-px bg-slate-700/50 -translate-x-1/2"></div>

            {/* Pickup */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-white">Endereço de Embarque</h3>
              </div>
              
              <div className="space-y-3 pl-2">
                <Input 
                  label="Rua ou Local" 
                  placeholder="Nome da rua ou Aeroporto..." 
                  required
                  value={formData.pickup.street}
                  onChange={(e) => handleAddressChange('pickup', 'street', e.target.value)}
                />
                <div className={`flex gap-3 transition-opacity duration-300 ${isPickupAirport ? 'opacity-50' : 'opacity-100'}`}>
                  <div className="w-1/3">
                    <Input 
                      label="Número" 
                      placeholder={isPickupAirport ? "Opcional" : "123"}
                      required={!isPickupAirport}
                      disabled={isPickupAirport}
                      value={formData.pickup.number}
                      onChange={(e) => handleAddressChange('pickup', 'number', e.target.value)}
                    />
                  </div>
                  <div className="w-2/3">
                    <Input 
                      label="Bairro" 
                      placeholder={isPickupAirport ? "Opcional" : "Bairro"}
                      required={!isPickupAirport}
                      disabled={isPickupAirport}
                      value={formData.pickup.neighborhood}
                      onChange={(e) => handleAddressChange('pickup', 'neighborhood', e.target.value)}
                    />
                  </div>
                </div>
                {isPickupAirport && (
                    <p className="text-xs text-emerald-400 ml-1 animate-pulse">
                        * Detectamos Aeroporto: Número e Bairro não são necessários.
                    </p>
                )}
              </div>
            </div>

            {/* Destination */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-white">Endereço de Destino</h3>
              </div>
              
              <div className="space-y-3 pl-2">
                <Input 
                  label="Rua ou Local" 
                  placeholder="Nome da rua ou Aeroporto..." 
                  required
                  value={formData.destination.street}
                  onChange={(e) => handleAddressChange('destination', 'street', e.target.value)}
                />
                <div className={`flex gap-3 transition-opacity duration-300 ${isDestinationAirport ? 'opacity-50' : 'opacity-100'}`}>
                  <div className="w-1/3">
                    <Input 
                      label="Número" 
                      placeholder={isDestinationAirport ? "Opcional" : "456"} 
                      required={!isDestinationAirport}
                      disabled={isDestinationAirport}
                      value={formData.destination.number}
                      onChange={(e) => handleAddressChange('destination', 'number', e.target.value)}
                    />
                  </div>
                  <div className="w-2/3">
                    <Input 
                      label="Bairro" 
                      placeholder={isDestinationAirport ? "Opcional" : "Bairro"}
                      required={!isDestinationAirport}
                      disabled={isDestinationAirport}
                      value={formData.destination.neighborhood}
                      onChange={(e) => handleAddressChange('destination', 'neighborhood', e.target.value)}
                    />
                  </div>
                </div>
                {isDestinationAirport && (
                    <p className="text-xs text-rose-400 ml-1 animate-pulse">
                        * Detectamos Aeroporto: Número e Bairro não são necessários.
                    </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-700/50">
            <div className="flex items-center gap-4 bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-700">
              <span className="text-sm font-medium text-slate-300">Precisa de porta-malas?</span>
              <div className="flex bg-slate-800 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, needsTrunk: true})}
                  className={`px-3 py-1 rounded-md text-sm transition-all ${formData.needsTrunk ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  Sim
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, needsTrunk: false})}
                  className={`px-3 py-1 rounded-md text-sm transition-all ${!formData.needsTrunk ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  Não
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full md:w-auto min-w-[200px] h-14 text-lg group">
              <span>Chamar Motorista</span>
              <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};