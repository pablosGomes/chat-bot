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
        background: focused ? '#FFFFFF' : '#F5F5F7',
        border: focused ? '2px solid #7A2FF2' : '2px solid #E5E5E7',
        borderRadius: '28px',
        padding: '4px',
        transition: 'all 0.3s ease',
        boxShadow: focused ? '0 0 0 4px rgba(122, 47, 242, 0.1)' : 'none',
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
          height: '44px',
          padding: '0 16px',
          fontSize: '15px',
          color: '#1F1F1F',
          outline: 'none',
          border: 'none',
        }}
      />
      
      <button
        type="submit"
        disabled={enviando}
        aria-label="Enviar mensagem"
        className="shrink-0 flex items-center justify-center"
        style={{ 
          width: '44px',
          height: '44px',
          borderRadius: '22px',
          background: enviando ? '#D1D5DB' : 'linear-gradient(135deg, #7A2FF2 0%, #5A18D6 100%)',
          color: '#FFFFFF',
          cursor: enviando ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: enviando ? 'none' : '0 2px 10px rgba(122, 47, 242, 0.25)',
          transform: 'scale(1)',
        }}
        onMouseEnter={(e) => {
          if (!enviando) {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(122, 47, 242, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = enviando ? 'none' : '0 2px 10px rgba(122, 47, 242, 0.25)';
        }}
        onMouseDown={(e) => {
          if (!enviando) {
            e.currentTarget.style.transform = 'scale(0.95)';
          }
        }}
        onMouseUp={(e) => {
          if (!enviando) {
            e.currentTarget.style.transform = 'scale(1.1)';
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
