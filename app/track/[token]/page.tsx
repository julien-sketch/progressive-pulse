'use client';
import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { FileUp, MessageCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function ClientTrackPage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params);
  const [project, setProject] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('access_token', resolvedParams.token)
        .single();
      
      if (data) setProject(data);
    };
    fetchProject();
  }, [resolvedParams.token]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !project) return;

    setUploading(true);
    setUploadSuccess(false);

    // Organisation des fichiers par nom de client dans le bucket
    const fileExt = file.name.split('.').pop();
    const fileName = `${project.client_name}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('client-documents')
      .upload(fileName, file);

    setUploading(false);
    if (error) {
      alert("Erreur lors de l'envoi : " + error.message);
    } else {
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 5000); // Cache le message après 5s
    }
  };

  if (!project) return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#F5F5F7]">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <p className="mt-4 text-sm font-medium text-gray-500">Récupération de votre dossier...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F7] px-6 pb-12 pt-16 font-sans text-gray-900">
      <div className="mx-auto max-w-md">
        
        {/* Header style Apple */}
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-black">ProgressivePrêt</h1>
          <p className="mt-2 text-gray-500 font-medium">Suivi de dossier • {project.client_name}</p>
        </header>

        {/* Carte principale */}
        <main className="relative overflow-hidden rounded-[2.5rem] bg-white/80 p-8 shadow-2xl shadow-gray-200/50 backdrop-blur-2xl border border-white/40">
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 tracking-tight leading-tight">
              {project.status_text}
            </h2>
            <p className="mt-2 text-sm font-medium text-gray-400">
              Dernière actualisation : {new Date(project.created_at).toLocaleDateString('fr-FR')}
            </p>
          </div>
          
          {/* Barre de progression Apple Style */}
          <div className="relative mb-4 h-5 w-full overflow-hidden rounded-full bg-gray-100 shadow-inner">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-emerald-400 to-green-400 transition-all duration-1000 ease-out"
              style={{ width: `${project.progress_percent}%` }}
            />
          </div>

          <div className="flex justify-between px-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <span>Signature</span>
            <span className="text-blue-500">{project.progress_percent}%</span>
            <span>Remise des clés</span>
          </div>
          
          {/* Actions */}
          <div className="mt-12 space-y-4">
            <label className={`flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl p-4 font-bold transition-all active:scale-95 shadow-lg ${uploadSuccess ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-gray-800'}`}>
              {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : (uploadSuccess ? <CheckCircle2 size={20} /> : <FileUp size={20} />)}
              <span>{uploading ? 'Envoi...' : (uploadSuccess ? 'Document reçu !' : 'Ajouter un document')}</span>
              <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>

            <a 
              href={`mailto:${project.broker_email}?subject=Question sur mon dossier ${project.client_name}`}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white p-4 font-bold text-gray-700 transition-all border border-gray-200 hover:bg-gray-50 active:scale-95"
            >
              <MessageCircle size={20} />
              Contacter mon courtier
            </a>
          </div>
        </main>

        {/* Footer discret */}
        <footer className="mt-16 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300">
            Propulsé par ProgressivePulse
          </p>
        </footer>
      </div>
    </div>
  );
}