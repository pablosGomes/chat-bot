import { useRef, useState } from "react";
import { motion } from "framer-motion";
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
    <motion.form 
      onSubmit={handleSubmit} 
      className="flex items-center"
      animate={{
        scale: focused ? 1.01 : 1,
        boxShadow: focused 
          ? '0 0 0 4px rgba(139, 92, 246, 0.12), 0 4px 16px rgba(124, 58, 237, 0.08)' 
          : '0 0 0 0px rgba(139, 92, 246, 0)',
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{ 
        background: focused ? '#FFFFFF' : '#F9FAFB',
        border: focused ? '2px solid #8B5CF6' : '2px solid #E5E7EB',
        borderRadius: '28px',
        padding: '5px',
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
        }}
      />
      
      <motion.button
        type="submit"
        disabled={enviando}
        aria-label="Enviar mensagem"
        whileHover={!enviando ? { scale: 1.12 } : undefined}
        whileTap={!enviando ? { scale: 0.9 } : undefined}
        animate={{
          boxShadow: enviando 
            ? 'none' 
            : '0 4px 14px rgba(124, 58, 237, 0.3)'
        }}
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
        }}
      >
        {enviando ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <LoaderIcon size={20} />
          </motion.div>
        ) : (
          <SendIcon size={18} />
        )}
      </motion.button>
    </motion.form>
  );
};

export default MensagemForm;
