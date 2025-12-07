import { useState, useEffect, useRef } from "react";
import { BotAvatarIcon, AISparkleIcon, ChatBubbleIcon, CloseIcon, OnlineIcon } from "./components/Icons";
import MensagemForm from "./mensagemForm";
import { sendMessageToMistral } from "./services/mistralApi";

export default function App() {
  const [aberto, setAberto] = useState(false);
  const [fechando, setFechando] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      role: "bot",
      text: "Oi! 👋 Sou a cint.ia, sua parceira do CRIA. Tô aqui pra te ajudar com redações, tirar dúvidas da plataforma ou dar aquelas dicas pra você arrasar no ENEM. Bora?",
    },
  ]);
  const [enviandoSugestao, setEnviandoSugestao] = useState(false);
  const mensagensRef = useRef(null);

  const handleOpen = () => {
    setAberto(true);
    setFechando(false);
  };

  const handleClose = () => {
    setFechando(true);
    setTimeout(() => {
      setAberto(false);
      setFechando(false);
      setChatHistory([
        {
          role: "bot",
          text: "Oi! 👋 Sou a cint.ia, sua parceira do CRIA. Tô aqui pra te ajudar com redações, tirar dúvidas da plataforma ou dar aquelas dicas pra você arrasar no ENEM. Bora?",
        },
      ]);
    }, 250);
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

  const getMessageAnimation = (role) => {
    if (role === "user") return "animate-message-user";
    if (role === "bot" || role === "thinking") return "animate-message-bot";
    return "animate-message-in";
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
      {aberto ? (
        <div
          className={fechando ? 'animate-chat-close' : 'animate-chat-open'}
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
                {/* Avatar com efeito */}
                <div className="relative animate-breathe">
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
                  <div 
                    className="absolute flex items-center justify-center animate-online"
                    style={{ 
                      bottom: '-2px', 
                      right: '-2px',
                      background: 'white',
                      borderRadius: '50%',
                      padding: '2px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    <OnlineIcon size={14} />
                  </div>
                </div>
                
                <div className="text-white">
                  <div className="flex items-center gap-2">
                    <h1 style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.01em' }}>cint.ia</h1>
                    <span 
                      className="flex items-center gap-1"
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
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', opacity: 0.9, marginTop: '2px', fontWeight: 400 }}>
                    Sua assistente do CRIA
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleClose}
                aria-label="Fechar chat"
                className="flex items-center justify-center text-white hover-scale"
                style={{ 
                  width: '40px', height: '40px', 
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
              >
                <CloseIcon size={18} />
              </button>
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
                {chatHistory.map((chat, index) => (
                  <div
                    key={index}
                    className={`${getMessageAnimation(chat.role)} flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}
                    style={{ 
                      alignItems: 'flex-end', 
                      gap: '10px',
                      animationDelay: `${Math.min(index * 0.08, 0.3)}s`
                    }}
                  >
                    {/* Avatar do Bot */}
                    {chat.role !== "user" && (
                      <div 
                        style={{ 
                          width: '36px', height: '36px',
                          opacity: shouldShowAvatar(index) ? 1 : 0,
                          transform: shouldShowAvatar(index) ? 'scale(1)' : 'scale(0.8)',
                          transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                          flexShrink: 0
                        }}
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
                      </div>
                    )}
                    
                    {/* Balão de Mensagem */}
                    <div
                      className="hover-lift"
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
                          <span className="typing-dot" style={{ 
                            width: '9px', height: '9px', 
                            borderRadius: '50%', 
                            background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' 
                          }} />
                          <span className="typing-dot" style={{ 
                            width: '9px', height: '9px', 
                            borderRadius: '50%', 
                            background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' 
                          }} />
                          <span className="typing-dot" style={{ 
                            width: '9px', height: '9px', 
                            borderRadius: '50%', 
                            background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' 
                          }} />
                        </div>
                      ) : (
                        chat.text
                      )}
                    </div>
                  </div>
                ))}
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
              {chatHistory.length === 1 && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  {sugestoes.map((texto, idx) => (
                    <button
                      key={texto}
                      onClick={() => enviarSugestao(texto)}
                      disabled={enviandoSugestao}
                      className="animate-chip-in"
                      style={{ 
                        padding: '10px 18px',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: enviandoSugestao ? '#9CA3AF' : '#7C3AED',
                        background: enviandoSugestao ? '#F3F4F6' : 'linear-gradient(135deg, #EDE9FE 0%, #F5F3FF 100%)',
                        border: `1.5px solid ${enviandoSugestao ? '#E5E7EB' : '#A78BFA'}`,
                        borderRadius: '25px',
                        cursor: enviandoSugestao ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        animationDelay: `${idx * 0.08}s`,
                        opacity: enviandoSugestao ? 0.6 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!enviandoSugestao) {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)';
                          e.currentTarget.style.color = '#FFFFFF';
                          e.currentTarget.style.border = '1.5px solid transparent';
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(124, 58, 237, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = enviandoSugestao ? '#F3F4F6' : 'linear-gradient(135deg, #EDE9FE 0%, #F5F3FF 100%)';
                        e.currentTarget.style.color = enviandoSugestao ? '#9CA3AF' : '#7C3AED';
                        e.currentTarget.style.border = `1.5px solid ${enviandoSugestao ? '#E5E7EB' : '#A78BFA'}`;
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {texto}
                    </button>
                  ))}
                </div>
              )}

              <MensagemForm setChatHistory={setChatHistory} chatHistory={chatHistory} />
              
              {/* Powered by */}
              <div className="flex items-center justify-center gap-2" style={{ marginTop: '14px' }}>
                <div 
                  className="animate-online"
                  style={{ width: '6px', height: '6px', background: '#10B981', borderRadius: '50%' }} 
                />
                <span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 500 }}>
                  Powered by <span style={{ color: '#7C3AED', fontWeight: 600 }}>CRIA</span>
                </span>
              </div>
            </footer>
          </div>
        </div>
      ) : (
        /* BOTÃO FLUTUANTE CRIA */
        <button 
          onClick={handleOpen} 
          aria-label="Abrir chat"
          className="relative flex items-center justify-center group"
          style={{ width: '68px', height: '68px' }}
        >
          {/* Anel de pulse */}
          <div 
            className="absolute animate-pulse-soft"
            style={{ 
              inset: '-6px',
              background: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
              borderRadius: '50%',
              opacity: 0.5
            }}
          />
          
          {/* Botão principal */}
          <div 
            className="relative flex items-center justify-center animate-glow"
            style={{ 
              width: '64px', 
              height: '64px',
              background: 'linear-gradient(145deg, #A78BFA 0%, #8B5CF6 40%, #7C3AED 100%)',
              borderRadius: '50%',
              boxShadow: '0 8px 30px rgba(124, 58, 237, 0.4), inset 0 1px 1px rgba(255,255,255,0.25)',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: 'scale(1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.12) translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 16px 45px rgba(124, 58, 237, 0.5), inset 0 1px 1px rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(124, 58, 237, 0.4), inset 0 1px 1px rgba(255,255,255,0.25)';
            }}
          >
            <ChatBubbleIcon size={30} />
            
            {/* Indicador online */}
            <div 
              className="animate-online"
              style={{ 
                position: 'absolute',
                top: '2px', 
                right: '2px',
                background: 'white',
                borderRadius: '50%',
                padding: '2px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
              }}
            >
              <OnlineIcon size={12} />
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
