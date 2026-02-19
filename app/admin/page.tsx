'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PlusCircle, Link as LinkIcon, CheckCircle2, Loader2 } from 'lucide-react';

export default function AdminPage() {
  const [clientName, setClientName] = useState('');
  const [brokerEmail, setBrokerEmail] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Génération d'un token simple (ex: bernard-452)
    const suffix = Math.floor(100 + Math.random() * 900);
    const newToken = `${clientName.toLowerCase().trim().replace(/\s+/g, '-')}-${suffix}`;
    
    const { error } = await supabase.from('projects').insert([
      { 
        client_name: clientName, 
        broker_email: brokerEmail, 
        access_token: newToken,
        progress_percent: 10,
        status_text: "Dossier en cours de création"
      }
    ]);

    setLoading(false);
    if (error) {
      setMessage("Erreur : " + error.message);
    } else {
      setToken(newToken);
      setMessage("Le dossier a été créé avec succès !");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6 font-sans text-zinc-900">
      <div className="mx-auto max-w-md pt-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
            <PlusCircle size={20} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Nouvel accès client</h1>
        </div>

        <form onSubmit={createProject} className="space-y-4 rounded-[2.5rem] bg-white p-8 shadow-xl shadow-zinc-200/50 border border-white">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-400">Nom du client</label>
            <input 
              required
              className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 p-4 outline-none focus:border-zinc-300 transition-all" 
              placeholder="ex: M. Bernard" 
              onChange={(e) => setClientName(e.target.value)} 
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-400">Email du courtier</label>
            <input 
              required
              type="email"
              className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 p-4 outline-none focus:border-zinc-300 transition-all" 
              placeholder="ex: contact@courtier.fr" 
              onChange={(e) => setBrokerEmail(e.target.value)} 
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black p-4 font-bold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Générer le lien de suivi"}
          </button>
        </form>

        {token && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="rounded-[2rem] bg-emerald-50 p-6 border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-700 mb-4">
                <CheckCircle2 size={18} />
                <span className="font-bold text-sm">{message}</span>
              </div>
              
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-600/50 mb-2">Lien pour le client</p>
              <div className="flex items-center gap-2 rounded-xl bg-white p-3 border border-emerald-200 shadow-sm">
                <code className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-emerald-800">
                  {window.location.origin}/track/{token}
                </code>
                <button 
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/track/${token}`)}
                  className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  <LinkIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}