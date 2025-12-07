// Ícones premium personalizados para o chatbot CRIA

// Avatar do Bot - Design premium com gradiente
export const BotAvatarIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <defs>
      <linearGradient id="botGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9D5CFF"/>
        <stop offset="100%" stopColor="#7A2FF2"/>
      </linearGradient>
      <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="white" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="white" stopOpacity="0"/>
      </linearGradient>
    </defs>
    {/* Fundo circular */}
    <circle cx="20" cy="20" r="18" fill="url(#botGradient)"/>
    {/* Brilho sutil */}
    <ellipse cx="14" cy="12" rx="8" ry="6" fill="url(#shineGradient)"/>
    {/* Rosto do bot */}
    <rect x="10" y="14" width="20" height="14" rx="4" fill="white"/>
    {/* Olhos */}
    <circle cx="15" cy="20" r="2.5" fill="#7A2FF2"/>
    <circle cx="25" cy="20" r="2.5" fill="#7A2FF2"/>
    {/* Reflexo nos olhos */}
    <circle cx="14" cy="19" r="0.8" fill="white"/>
    <circle cx="24" cy="19" r="0.8" fill="white"/>
    {/* Antena */}
    <circle cx="20" cy="8" r="2.5" fill="white"/>
    <rect x="19" y="8" width="2" height="6" fill="white"/>
  </svg>
);

// Ícone de Chat para botão flutuante - Bolha moderna
export const ChatBubbleIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <defs>
      <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur"/>
        <feOffset in="blur" dx="0" dy="1" result="offsetBlur"/>
        <feComposite in="SourceGraphic" in2="offsetBlur" operator="over"/>
      </filter>
    </defs>
    {/* Bolha principal */}
    <path 
      d="M16 4C8.82 4 3 9.056 3 15.294c0 3.458 1.686 6.564 4.356 8.666L6 27l5.148-2.25c1.5.5 3.13.779 4.852.779 7.18 0 13-5.056 13-11.294C29 8.056 23.18 4 16 4z" 
      fill="white"
    />
    {/* Pontos de digitação */}
    <circle cx="11" cy="15" r="2" fill="#7A2FF2"/>
    <circle cx="16" cy="15" r="2" fill="#9D5CFF"/>
    <circle cx="21" cy="15" r="2" fill="#7A2FF2"/>
  </svg>
);

// Badge IA - Sparkle elegante
export const AISparkleIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0L9.2 5.2L14.5 6L9.2 6.8L8 12L6.8 6.8L1.5 6L6.8 5.2L8 0Z" fillOpacity="0.95"/>
    <circle cx="13.5" cy="2.5" r="1.5" fillOpacity="0.7"/>
    <circle cx="2.5" cy="11.5" r="1" fillOpacity="0.5"/>
  </svg>
);

// Ícone de Enviar - Avião moderno e elegante
export const SendIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="sendGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="white"/>
        <stop offset="100%" stopColor="rgba(255,255,255,0.8)"/>
      </linearGradient>
    </defs>
    <path 
      d="M3.4 20.4L21 12L3.4 3.6C2.8 3.3 2.2 3.9 2.4 4.5L4.5 11H11C11.6 11 12 11.4 12 12C12 12.6 11.6 13 11 13H4.5L2.4 19.5C2.2 20.1 2.8 20.7 3.4 20.4Z" 
      fill="url(#sendGradient)"
    />
  </svg>
);

// Loader elegante
export const LoaderIcon = ({ size = 18 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none"
    className="animate-spin"
    style={{ animation: 'spin 1s linear infinite' }}
  >
    <circle 
      cx="12" cy="12" r="9" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeOpacity="0.2"
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

// Botão fechar - X refinado
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

// Ícone de verificado/online
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

// Ícone alternativo do bot - mais minimalista
export const BotMinimalIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <defs>
      <linearGradient id="botMinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9D5CFF"/>
        <stop offset="100%" stopColor="#6B21A8"/>
      </linearGradient>
    </defs>
    {/* Cabeça */}
    <rect x="6" y="10" width="20" height="16" rx="4" fill="url(#botMinGrad)"/>
    {/* Olhos */}
    <rect x="10" y="15" width="4" height="5" rx="1.5" fill="white"/>
    <rect x="18" y="15" width="4" height="5" rx="1.5" fill="white"/>
    {/* Antena */}
    <rect x="15" y="4" width="2" height="6" rx="1" fill="url(#botMinGrad)"/>
    <circle cx="16" cy="4" r="2.5" fill="url(#botMinGrad)"/>
    {/* Sorriso */}
    <path d="M12 22C12 22 13.5 24 16 24C18.5 24 20 22 20 22" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
