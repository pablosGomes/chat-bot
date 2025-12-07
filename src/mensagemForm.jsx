import { useRef, useState } from "react";
import { SendIcon, LoaderIcon } from "./components/Icons";
import { sendMessageToMistral } from "./services/mistralApi";

const MensagemForm = ({ setChatHistory, chatHistory }) => {
  const inputRef = useRef();
  const [enviando, setEnviando] = useState(false);
  const [focused, setFocused] = useState(false);

  const enviarMensagem = async (texto) => {
    if (!texto || enviando) return;
    
    setEnviando(true);

    setChatHistory((history) => [
      ...history,
      { role: "user", text: texto },
      { role: "thinking", text: "" },
    ]);

    try {
      const resposta = await sendMessageToMistral(chatHistory, texto);
      
      setChatHistory((history) => {
        const novaLista = [...history];
        novaLista.pop();
        novaLista.push({ role: "bot", text: resposta });
        return novaLista;
      });
    } catch (error) {
      setChatHistory((history) => {
        const novaLista = [...history];
        novaLista.pop();
        novaLista.push({
          role: "bot",
          text: "Ops! 😅 Tive um probleminha. Pode tentar de novo?",
        });
        return novaLista;
      });
      console.error("Erro:", error);
    } finally {
      setEnviando(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const texto = inputRef.current.value.trim();
    if (texto) {
      inputRef.current.value = "";
      enviarMensagem(texto);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex items-center"
      style={{ 
        background: focused ? '#FFFFFF' : '#F9FAFB',
        border: focused ? '2px solid #8B5CF6' : '2px solid #E5E7EB',
        borderRadius: '28px',
        padding: '5px',
        transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        boxShadow: focused 
          ? '0 0 0 4px rgba(139, 92, 246, 0.12), 0 4px 16px rgba(124, 58, 237, 0.08)' 
          : 'none',
        transform: focused ? 'scale(1.01)' : 'scale(1)',
      }}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Digite sua mensagem..."
        required
        disabled={enviando}
        name="mensagem"
        autoComplete="off"
        aria-label="Digite sua mensagem"
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="flex-1 bg-transparent disabled:opacity-50"
        style={{ 
          height: '46px',
          padding: '0 18px',
          fontSize: '14px',
          fontWeight: 400,
          color: '#1F2937',
          outline: 'none',
          border: 'none',
          transition: 'opacity 0.2s ease',
        }}
      />
      
      <button
        type="submit"
        disabled={enviando}
        aria-label="Enviar mensagem"
        className="shrink-0 flex items-center justify-center"
        style={{ 
          width: '46px',
          height: '46px',
          borderRadius: '23px',
          background: enviando 
            ? '#D1D5DB' 
            : 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
          color: '#FFFFFF',
          cursor: enviando ? 'not-allowed' : 'pointer',
          transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: enviando ? 'none' : '0 4px 14px rgba(124, 58, 237, 0.3)',
          transform: 'scale(1)',
        }}
        onMouseEnter={(e) => {
          if (!enviando) {
            e.currentTarget.style.transform = 'scale(1.15)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(124, 58, 237, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = enviando ? 'none' : '0 4px 14px rgba(124, 58, 237, 0.3)';
        }}
        onMouseDown={(e) => {
          if (!enviando) {
            e.currentTarget.style.transform = 'scale(0.9)';
          }
        }}
        onMouseUp={(e) => {
          if (!enviando) {
            e.currentTarget.style.transform = 'scale(1.15)';
          }
        }}
      >
        {enviando ? (
          <LoaderIcon size={20} />
        ) : (
          <SendIcon size={18} />
        )}
      </button>
    </form>
  );
};

export default MensagemForm;
