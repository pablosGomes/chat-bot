import { useState } from 'react';
import { X, MessageSquare } from 'lucide-react';

export default function MensagemChat() {
  const [aberto, setAberto] = useState(true);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {aberto ? (
        <div className="bg-purple-600 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2 max-w-xs transition-all">
          <span>Olá, precisa de ajuda?</span>
          <button onClick={() => setAberto(false)} className="ml-auto hover:opacity-80">
            <X size={18} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAberto(true)}
          className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition"
        >
          <MessageSquare size={20} />
        </button>
      )}
    </div>
  );
}
