import { useState, useEffect, useRef } from "react";
import { BotAvatarIcon, AISparkleIcon, ChatBubbleIcon, CloseIcon, OnlineIcon } from "./components/Icons";
import MensagemForm from "./mensagemForm";
import { sendMessageToMistral } from "./services/mistralApi";

export default function App() {
  const [aberto, setAberto] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      role: "bot",
      text: "Olá! 👋 Sou a cint.ia, sua assistente do CRIA. Estou aqui para te ajudar com redações, dúvidas sobre a plataforma ou dicas para arrasar no ENEM. Como posso te ajudar hoje?",
    },
  ]);
  const [animando, setAnimando] = useState(false);
  const mensagensRef = useRef(null);

  const handleClose = () => {
    setAnimando(true);
    setTimeout(() => {
      setAberto(false);
      setChatHistory([
        {
          role: "bot",
          text: "Olá! 👋 Sou a cint.ia, sua assistente do CRIA. Estou aqui para te ajudar com redações, dúvidas sobre a plataforma ou dicas para arrasar no ENEM. Como posso te ajudar hoje?",
        },
      ]);
      setAnimando(false);
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
    // constrói histórico para a API sem o marcador de pensamento
    const historyForApi = [...chatHistory, { role: "user", text: texto }];
    // mostra imediatamente no chat com indicador de pensando
    setChatHistory([...historyForApi, { role: "thinking", text: "" }]);

    try {
      const resposta = await sendMessageToMistral(historyForApi, texto);

      setChatHistory((history) => {
        const novaLista = [...history];
        novaLista.pop(); // remove "thinking"
        novaLista.push({ role: "bot", text: resposta });
        return novaLista;
      });
    } catch (error) {
      setChatHistory((history) => {
        const novaLista = [...history];
        novaLista.pop(); // remove "thinking"
        novaLista.push({
          role: "bot",
          text: "Ops! 😅 Tive um probleminha. Pode tentar de novo?",
        });
        return novaLista;
      });
      console.error("Erro ao enviar sugestão:", error);
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
        bottom: '18px', 
        right: '18px',
        fontFamily: "'Inter', system-ui, sans-serif"
      }}
    >
      {aberto ? (
        <div
          style={{
            opacity: animando ? 0 : 1,
            transform: animando ? 'scale(0.96) translateY(10px)' : 'scale(1) translateY(0)',
            transition: 'all 0.3s cubic-bezier(0.33, 1, 0.68, 1)',
            transformOrigin: 'bottom right'
          }}
        >
          {/* CONTAINER */}
          <div 
            className="flex flex-col bg-white overflow-hidden"
            style={{ 
              width: 'min(400px, calc(100vw - 36px))',
              height: 'min(600px, calc(100vh - 100px))',
              borderRadius: '24px',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04)'
            }}
          >
            
            {/* HEADER */}
            <header 
              className="shrink-0 flex items-center justify-between"
              style={{ 
                background: 'linear-gradient(135deg, #7A2FF2 0%, #5A18D6 100%)',
                padding: '14px 16px',
              }}
            >
              <div className="flex items-center gap-3">
                {/* Avatar premium */}
                <div className="relative">
                  <div 
                    className="flex items-center justify-center overflow-hidden"
                    style={{ 
                      width: '46px', 
                      height: '46px', 
                      borderRadius: '14px',
                      background: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <BotAvatarIcon size={40} />
                  </div>
                  <div 
                    className="absolute flex items-center justify-center"
                    style={{ 
                      bottom: '-3px', 
                      right: '-3px',
                      background: 'white',
                      borderRadius: '50%',
                      padding: '2px'
                    }}
                  >
                    <OnlineIcon size={14} />
                  </div>
                </div>
                
                <div className="text-white">
                  <div className="flex items-center gap-2">
                    <h1 style={{ fontSize: '17px', fontWeight: 600 }}>cint.ia</h1>
                    <span 
                      className="flex items-center gap-1"
                      style={{ 
                        background: 'rgba(255,255,255,0.2)', 
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '10px',
                        fontWeight: 600
                      }}
                    >
                      <AISparkleIcon size={10} /> IA
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', opacity: 0.85, marginTop: '2px' }}>
                    Assistente Virtual
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleClose}
                aria-label="Fechar chat"
                className="flex items-center justify-center text-white"
                style={{ 
                  width: '38px', height: '38px', 
                  borderRadius: '12px',
                  background: 'transparent',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <CloseIcon size={20} />
              </button>
            </header>

            {/* MENSAGENS */}
            <div 
              className="flex-1 overflow-y-auto cria-scrollbar"
              ref={mensagensRef}
              style={{ background: '#F5F5F7', padding: '16px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {chatHistory.map((chat, index) => (
                  <div
                    key={index}
                    className={`animate-message-in flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}
                    style={{ 
                      alignItems: 'flex-end', 
                      gap: '8px',
                      animationDelay: `${index * 0.05}s`
                    }}
                  >
                    {/* Avatar Bot */}
                    {chat.role !== "user" && (
                      <div 
                        style={{ 
                          width: '34px', height: '34px',
                          opacity: shouldShowAvatar(index) ? 1 : 0,
                          transition: 'opacity 0.25s ease',
                          flexShrink: 0
                        }}
                      >
                        <div 
                          className="w-full h-full flex items-center justify-center overflow-hidden"
                          style={{ 
                            background: 'linear-gradient(135deg, #F5EDFF 0%, #EDE4FF 100%)', 
                            borderRadius: '12px',
                            boxShadow: '0 1px 3px rgba(122, 47, 242, 0.1)'
                          }}
                        >
                          <BotAvatarIcon size={28} />
                        </div>
                      </div>
                    )}
                    
                    {/* Balão */}
                    <div
                      style={{
                        maxWidth: '78%',
                        padding: '12px 16px',
                        fontSize: '15px',
                        lineHeight: '1.5',
                        ...(chat.role === "user" 
                          ? {
                              background: 'linear-gradient(135deg, #7A2FF2 0%, #5A18D6 100%)',
                              color: '#FFFFFF',
                              borderRadius: '20px 20px 6px 20px',
                              boxShadow: '0 2px 12px rgba(122, 47, 242, 0.2)'
                            }
                          : {
                              background: '#FFFFFF',
                              color: '#1F1F1F',
                              borderRadius: '20px 20px 20px 6px',
                              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
                              border: '1px solid rgba(0, 0, 0, 0.06)',
                            }
                        )
                      }}
                    >
                      {chat.role === "thinking" ? (
                        <div className="flex items-center" style={{ gap: '5px', padding: '4px 6px' }}>
                          <span className="typing-dot" style={{ 
                            width: '8px', height: '8px', 
                            borderRadius: '50%', 
                            background: '#7A2FF2' 
                          }} />
                          <span className="typing-dot" style={{ 
                            width: '8px', height: '8px', 
                            borderRadius: '50%', 
                            background: '#7A2FF2' 
                          }} />
                          <span className="typing-dot" style={{ 
                            width: '8px', height: '8px', 
                            borderRadius: '50%', 
                            background: '#7A2FF2' 
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
                padding: '14px 16px 18px',
                background: '#FFFFFF',
                borderTop: '1px solid rgba(0, 0, 0, 0.06)'
              }}
            >
              {/* Chips */}
              {chatHistory.length === 1 && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                  {sugestoes.map((texto) => (
                    <button
                      key={texto}
                      onClick={() => {
                        enviarSugestao(texto);
                      }}
                      style={{ 
                        padding: '10px 16px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#5A18D6',
                        background: '#F5F0FF',
                        border: '1.5px solid #7A2FF2',
                        borderRadius: '22px',
                        cursor: 'pointer',
                        transition: 'all 0.35s ease',
                        transform: 'translateY(0)',
                        boxShadow: 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#7A2FF2';
                        e.currentTarget.style.color = '#FFFFFF';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(122, 47, 242, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#F5F0FF';
                        e.currentTarget.style.color = '#5A18D6';
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
              
              <div className="flex items-center justify-center gap-1.5" style={{ marginTop: '14px' }}>
                <div style={{ width: '6px', height: '6px', background: '#10B981', borderRadius: '50%' }} />
                <span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 500 }}>
                  Powered by CRIA
                </span>
              </div>
            </footer>
          </div>
        </div>
      ) : (
        /* BOTÃO FLUTUANTE PREMIUM */
        <button 
          onClick={() => setAberto(true)} 
          aria-label="Abrir chat"
          className="relative flex items-center justify-center group"
          style={{ width: '66px', height: '66px' }}
        >
          {/* Anel de pulse */}
          <div 
            className="absolute animate-pulse-soft"
            style={{ 
              inset: '-4px',
              background: 'linear-gradient(135deg, #9D5CFF 0%, #7A2FF2 100%)',
              borderRadius: '50%',
              opacity: 0.4
            }}
          />
          
          {/* Botão principal */}
          <div 
            className="relative flex items-center justify-center"
            style={{ 
              width: '62px', 
              height: '62px',
              background: 'linear-gradient(145deg, #8B3DFF 0%, #7A2FF2 50%, #5A18D6 100%)',
              borderRadius: '50%',
              boxShadow: '0 8px 28px rgba(122, 47, 242, 0.45), inset 0 1px 1px rgba(255,255,255,0.2)',
              transition: 'all 0.35s cubic-bezier(0.34, 1.2, 0.64, 1)',
              transform: 'scale(1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08) translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 36px rgba(122, 47, 242, 0.55), inset 0 1px 1px rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 28px rgba(122, 47, 242, 0.45), inset 0 1px 1px rgba(255,255,255,0.2)';
            }}
          >
            <ChatBubbleIcon size={32} />
            
            {/* Indicador online */}
            <div 
              style={{ 
                position: 'absolute',
                top: '1px', 
                right: '1px',
                background: 'white',
                borderRadius: '50%',
                padding: '2px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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
