// Ícones CRIA - Design alinhado com a marca

// Avatar do Bot CRIA
export const BotAvatarIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <defs>
      <linearGradient id="criaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A78BFA"/>
        <stop offset="50%" stopColor="#8B5CF6"/>
        <stop offset="100%" stopColor="#7C3AED"/>
      </linearGradient>
      <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="white" stopOpacity="0.5"/>
        <stop offset="100%" stopColor="white" stopOpacity="0"/>
      </linearGradient>
    </defs>
    {/* Fundo circular */}
    <circle cx="20" cy="20" r="18" fill="url(#criaGradient)"/>
    {/* Brilho sutil */}
    <ellipse cx="14" cy="12" rx="8" ry="6" fill="url(#shineGradient)"/>
    {/* Rosto do bot */}
    <rect x="10" y="14" width="20" height="14" rx="5" fill="white"/>
    {/* Olhos - estilo CRIA */}
    <circle cx="15" cy="20" r="2.5" fill="#7C3AED"/>
    <circle cx="25" cy="20" r="2.5" fill="#7C3AED"/>
    {/* Reflexo nos olhos */}
    <circle cx="14" cy="19" r="0.8" fill="white"/>
    <circle cx="24" cy="19" r="0.8" fill="white"/>
    {/* Sorriso sutil */}
    <path d="M16 24C16 24 17.5 25.5 20 25.5C22.5 25.5 24 24 24 24" stroke="#7C3AED" strokeWidth="1.2" strokeLinecap="round"/>
    {/* Antena */}
    <circle cx="20" cy="7" r="2.5" fill="white"/>
    <rect x="19" y="7" width="2" height="6" rx="1" fill="white"/>
  </svg>
);

// Ícone de Chat - Estilo CRIA
export const ChatBubbleIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* Bolha principal */}
    <path 
      d="M16 4C8.82 4 3 9.056 3 15.294c0 3.458 1.686 6.564 4.356 8.666L6 27l5.148-2.25c1.5.5 3.13.779 4.852.779 7.18 0 13-5.056 13-11.294C29 8.056 23.18 4 16 4z" 
      fill="white"
    />
    {/* Pontos de digitação - cores CRIA */}
    <circle cx="11" cy="15" r="2" fill="#7C3AED"/>
    <circle cx="16" cy="15" r="2" fill="#8B5CF6"/>
    <circle cx="21" cy="15" r="2" fill="#A78BFA"/>
  </svg>
);

// Badge IA - Sparkle CRIA
export const AISparkleIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0L9.4 5.4L14.5 6L9.4 6.6L8 12L6.6 6.6L1.5 6L6.6 5.4L8 0Z" fillOpacity="0.95"/>
    <circle cx="13" cy="2.5" r="1.5" fillOpacity="0.7"/>
    <circle cx="2.5" cy="12" r="1" fillOpacity="0.5"/>
  </svg>
);

// Ícone de Enviar - Avião CRIA
export const SendIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="sendGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="white"/>
        <stop offset="100%" stopColor="rgba(255,255,255,0.85)"/>
      </linearGradient>
    </defs>
    <path 
      d="M3.4 20.4L21 12L3.4 3.6C2.8 3.3 2.2 3.9 2.4 4.5L4.5 11H11C11.6 11 12 11.4 12 12C12 12.6 11.6 13 11 13H4.5L2.4 19.5C2.2 20.1 2.8 20.7 3.4 20.4Z" 
      fill="url(#sendGradient)"
    />
  </svg>
);

// Loader CRIA
export const LoaderIcon = ({ size = 18 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none"
    className="animate-spin"
  >
    <circle 
      cx="12" cy="12" r="9" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeOpacity="0.25"
      fill="none"
    />
    <path 
      d="M12 3C7.029 3 3 7.029 3 12" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round"
    />
  </svg>
);

// Botão fechar
export const CloseIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path 
      d="M18 6L6 18M6 6L18 18" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
    />
  </svg>
);

// Indicador online
export const OnlineIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" fill="#10B981"/>
    <path 
      d="M5 8L7 10L11 6" 
      stroke="white" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// Avatar minimalista alternativo
export const BotMinimalIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <defs>
      <linearGradient id="botMinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A78BFA"/>
        <stop offset="100%" stopColor="#7C3AED"/>
      </linearGradient>
    </defs>
    <rect x="6" y="10" width="20" height="16" rx="5" fill="url(#botMinGrad)"/>
    <rect x="10" y="15" width="4" height="5" rx="2" fill="white"/>
    <rect x="18" y="15" width="4" height="5" rx="2" fill="white"/>
    <rect x="15" y="4" width="2" height="6" rx="1" fill="url(#botMinGrad)"/>
    <circle cx="16" cy="4" r="2.5" fill="url(#botMinGrad)"/>
    <path d="M12 22C12 22 13.5 24 16 24C18.5 24 20 22 20 22" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
