import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BotAvatarIcon, AISparkleIcon, ChatBubbleIcon, CloseIcon, OnlineIcon } from "./components/Icons";
import MensagemForm from "./mensagemForm";
import { sendMessageToMistral } from "./services/mistralApi";

// Variantes de animação CRIA
const chatContainerVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.85, 
    y: 30,
    transition: { duration: 0.2, ease: "easeIn" }
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 25,
      staggerChildren: 0.05
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: 20,
    transition: { duration: 0.2, ease: "easeIn" }
  }
};

const messageVariants = {
  hidden: (isUser) => ({ 
    opacity: 0, 
    x: isUser ? 20 : -20,
    scale: 0.95
  }),
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 30 
    }
  }
};

const chipVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.9 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      delay: i * 0.08
    }
  }),
  hover: {
    y: -4,
    scale: 1.02,
    transition: { type: "spring", stiffness: 400, damping: 20 }
  },
  tap: { scale: 0.95 }
};

const fabVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.1, 
    y: -4,
    transition: { type: "spring", stiffness: 400, damping: 15 }
  },
  tap: { scale: 0.92 }
};

const pulseVariants = {
  animate: {
    scale: [1, 1.3, 1],
    opacity: [0.5, 0, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const typingDotVariants = {
  animate: (i) => ({
    y: [0, -4, 0],
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      delay: i * 0.2,
      ease: "easeInOut"
    }
  })
};


export default function App() {
  const [aberto, setAberto] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      role: "bot",
      text: "Oi! 👋 Sou a cint.ia, sua parceira do CRIA. Tô aqui pra te ajudar com redações, tirar dúvidas da plataforma ou dar aquelas dicas pra você arrasar no ENEM. Bora?",
    },
  ]);
  const [enviandoSugestao, setEnviandoSugestao] = useState(false);
  const mensagensRef = useRef(null);

  const handleClose = () => {
    setAberto(false);
    setTimeout(() => {
      setChatHistory([
        {
          role: "bot",
          text: "Oi! 👋 Sou a cint.ia, sua parceira do CRIA. Tô aqui pra te ajudar com redações, tirar dúvidas da plataforma ou dar aquelas dicas pra você arrasar no ENEM. Bora?",
        },
      ]);
    }, 300);
  };

  useEffect(() => {
    if (mensagensRef.current) {
      mensagensRef.current.scrollTo({
        top: mensagensRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  const sugestoes = [
    "Como funciona o CRIA?",
    "Dicas de redação",
    "Competências ENEM",
  ];

  const enviarSugestao = async (texto) => {
    if (enviandoSugestao) return;
    setEnviandoSugestao(true);
    
    const historyForApi = [...chatHistory, { role: "user", text: texto }];
    setChatHistory([...historyForApi, { role: "thinking", text: "" }]);

    try {
      const resposta = await sendMessageToMistral(historyForApi, texto);
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
      console.error("Erro ao enviar sugestão:", error);
    } finally {
      setEnviandoSugestao(false);
    }
  };

  const shouldShowAvatar = (index) => {
    if (chatHistory[index].role === "user") return false;
    if (index === 0) return true;
    return chatHistory[index - 1].role !== chatHistory[index].role;
  };

  return (
    <div 
      className="fixed z-[9999]"
      style={{ 
        bottom: '20px', 
        right: '20px',
        fontFamily: "'Poppins', system-ui, sans-serif"
      }}
    >
      <AnimatePresence mode="wait">
        {aberto ? (
          <motion.div
            key="chat"
            variants={chatContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ transformOrigin: 'bottom right' }}
          >
            {/* CONTAINER PRINCIPAL */}
            <div 
              className="flex flex-col overflow-hidden"
              style={{ 
                width: 'min(400px, calc(100vw - 40px))',
                height: 'min(620px, calc(100vh - 100px))',
                borderRadius: '28px',
                background: '#FFFFFF',
                boxShadow: '0 25px 60px rgba(124, 58, 237, 0.15), 0 0 0 1px rgba(124, 58, 237, 0.05)'
              }}
            >
              
              {/* HEADER CRIA */}
              <header 
                className="shrink-0 flex items-center justify-between"
                style={{ 
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',
                  padding: '16px 18px',
                  borderRadius: '28px 28px 0 0',
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div 
                      className="flex items-center justify-center overflow-hidden"
                      style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '16px',
                        background: 'white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    >
                      <BotAvatarIcon size={42} />
                    </div>
                    {/* Bolinha online */}
                    <div 
                      style={{ 
                        position: 'absolute',
                        bottom: '-2px', 
                        right: '-2px',
                        width: '14px',
                        height: '14px',
                        background: '#10B981',
                        borderRadius: '50%',
                        border: '2px solid white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                  </div>
                  
                  <div className="text-white">
                    <div className="flex items-center gap-2">
                      <h1 style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.01em' }}>cint.ia</h1>
                      <motion.span 
                        className="flex items-center gap-1"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        style={{ 
                          background: 'rgba(255,255,255,0.2)', 
                          backdropFilter: 'blur(10px)',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '10px',
                          fontWeight: 600,
                          letterSpacing: '0.02em'
                        }}
                      >
                        <AISparkleIcon size={10} /> IA
                      </motion.span>
                    </div>
                    <p style={{ fontSize: '12px', opacity: 0.9, marginTop: '2px', fontWeight: 400 }}>
                      Sua assistente do CRIA
                    </p>
                  </div>
                </div>
                
                <motion.button
                  onClick={handleClose}
                  aria-label="Fechar chat"
                  whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.2)' }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center justify-center text-white"
                  style={{ 
                    width: '40px', height: '40px', 
                    borderRadius: '14px',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <CloseIcon size={18} />
                </motion.button>
              </header>

              {/* ÁREA DE MENSAGENS */}
              <div 
                className="flex-1 overflow-y-auto cria-scrollbar"
                ref={mensagensRef}
                style={{ 
                  background: 'linear-gradient(180deg, #FAFAFA 0%, #F5F3FF 100%)', 
                  padding: '18px' 
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <AnimatePresence>
                    {chatHistory.map((chat, index) => (
                      <motion.div
                        key={index}
                        custom={chat.role === "user"}
                        variants={messageVariants}
                        initial="hidden"
                        animate="visible"
                        className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}
                        style={{ alignItems: 'flex-end', gap: '10px' }}
                      >
                        {/* Avatar do Bot */}
                        {chat.role !== "user" && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ 
                              opacity: shouldShowAvatar(index) ? 1 : 0,
                              scale: shouldShowAvatar(index) ? 1 : 0.8
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            style={{ width: '36px', height: '36px', flexShrink: 0 }}
                          >
                            <div 
                              className="w-full h-full flex items-center justify-center overflow-hidden"
                              style={{ 
                                background: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)', 
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(124, 58, 237, 0.1)'
                              }}
                            >
                              <BotAvatarIcon size={28} />
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Balão de Mensagem */}
                        <motion.div
                          whileHover={{ y: -2, transition: { duration: 0.2 } }}
                          style={{
                            maxWidth: '80%',
                            padding: '14px 18px',
                            fontSize: '14px',
                            lineHeight: '1.6',
                            fontWeight: 400,
                            ...(chat.role === "user" 
                              ? {
                                  background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                                  color: '#FFFFFF',
                                  borderRadius: '20px 20px 6px 20px',
                                  boxShadow: '0 4px 15px rgba(124, 58, 237, 0.25)'
                                }
                              : {
                                  background: '#FFFFFF',
                                  color: '#1F2937',
                                  borderRadius: '20px 20px 20px 6px',
                                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                                  border: '1px solid rgba(124, 58, 237, 0.08)',
                                }
                            )
                          }}
                        >
                          {chat.role === "thinking" ? (
                            <div className="flex items-center" style={{ gap: '7px', padding: '4px 8px' }}>
                              {[0, 1, 2].map((i) => (
                                <motion.span
                                  key={i}
                                  custom={i}
                                  variants={typingDotVariants}
                                  animate="animate"
                                  style={{ 
                                    width: '9px', 
                                    height: '9px', 
                                    borderRadius: '50%', 
                                    background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                                    display: 'inline-block'
                                  }} 
                                />
                              ))}
                            </div>
                          ) : (
                            chat.text
                          )}
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* FOOTER */}
              <footer 
                style={{ 
                  padding: '16px 18px 20px',
                  background: '#FFFFFF',
                  borderTop: '1px solid rgba(124, 58, 237, 0.06)'
                }}
              >
                {/* Chips de Sugestão */}
                <AnimatePresence>
                  {chatHistory.length === 1 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}
                    >
                      {sugestoes.map((texto, idx) => (
                        <motion.button
                          key={texto}
                          custom={idx}
                          variants={chipVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover={!enviandoSugestao ? "hover" : undefined}
                          whileTap={!enviandoSugestao ? "tap" : undefined}
                          onClick={() => enviarSugestao(texto)}
                          disabled={enviandoSugestao}
                          style={{ 
                            padding: '10px 18px',
                            fontSize: '13px',
                            fontWeight: 500,
                            color: enviandoSugestao ? '#9CA3AF' : '#7C3AED',
                            background: enviandoSugestao ? '#F3F4F6' : 'linear-gradient(135deg, #EDE9FE 0%, #F5F3FF 100%)',
                            border: `1.5px solid ${enviandoSugestao ? '#E5E7EB' : '#A78BFA'}`,
                            borderRadius: '25px',
                            cursor: enviandoSugestao ? 'not-allowed' : 'pointer',
                            opacity: enviandoSugestao ? 0.6 : 1,
                          }}
                        >
                          {texto}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <MensagemForm setChatHistory={setChatHistory} chatHistory={chatHistory} />
                
                {/* Powered by */}
                <motion.div 
                  className="flex items-center justify-center gap-2" 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  style={{ marginTop: '14px' }}
                >
                  <div style={{ width: '6px', height: '6px', background: '#10B981', borderRadius: '50%' }} />
                  <span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 500 }}>
                    Powered by <span style={{ color: '#7C3AED', fontWeight: 600 }}>CRIA</span>
                  </span>
                </motion.div>
              </footer>
            </div>
          </motion.div>
        ) : (
          /* BOTÃO FLUTUANTE CRIA */
          <motion.button 
            key="fab"
            onClick={() => setAberto(true)} 
            aria-label="Abrir chat"
            className="relative flex items-center justify-center"
            style={{ width: '68px', height: '68px' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            {/* Anel de pulse */}
            <motion.div 
              className="absolute"
              variants={pulseVariants}
              animate="animate"
              style={{ 
                inset: '-6px',
                background: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
                borderRadius: '50%',
              }}
            />
            
            {/* Botão principal */}
            <motion.div 
              className="relative flex items-center justify-center"
              variants={fabVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              style={{ 
                width: '64px', 
                height: '64px',
                background: 'linear-gradient(145deg, #A78BFA 0%, #8B5CF6 40%, #7C3AED 100%)',
                borderRadius: '50%',
                boxShadow: '0 8px 30px rgba(124, 58, 237, 0.4), inset 0 1px 1px rgba(255,255,255,0.25)',
              }}
            >
              <ChatBubbleIcon size={30} />
              
              {/* Bolinha online */}
              <div 
                style={{ 
                  position: 'absolute',
                  top: '2px', 
                  right: '2px',
                  width: '14px',
                  height: '14px',
                  background: '#10B981',
                  borderRadius: '50%',
                  border: '2px solid white',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
                }}
              />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
