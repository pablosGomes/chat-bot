// URL da API - usa caminho relativo quando no mesmo domínio (Vercel)
// ou URL completa para desenvolvimento local
const API_URL = import.meta.env.VITE_API_URL || "";

// Gera ou recupera ID da sessão
function getSessionId() {
  let sessionId = sessionStorage.getItem("cintia_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID?.() || `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem("cintia_session_id", sessionId);
  }
  return sessionId;
}

/**
 * Envia uma mensagem para o backend da cint.ia
 * @param {Array} chatHistory - Histórico de mensagens
 * @param {string} userMessage - Mensagem do usuário
 * @returns {Promise<string>} - Resposta da IA
 */
export async function sendMessageToMistral(chatHistory, userMessage) {
  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: chatHistory,
        userMessage: userMessage,
        sessionId: getSessionId()
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erro na API: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Erro ao chamar API da cint.ia:", error);
    throw error;
  }
}

/**
 * Verifica se a API está online
 * @returns {Promise<boolean>}
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_URL}/api/health`);
    const data = await response.json();
    return data.status === "ok";
  } catch {
    return false;
  }
}
