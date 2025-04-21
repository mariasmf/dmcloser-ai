import React, { useState, useEffect } from "react";
import axios from "axios";

const mockUser = {
  email: "cliente@teste.com",
  plano: "Pro",
};

export default function DMCloser() {
  const [input, setInput] = useState("");
  const [resposta, setResposta] = useState("");
  const [loading, setLoading] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(mockUser);
  }, []);

  const handleResponder = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const r = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Responda como se fosse um vendedor experiente a seguinte mensagem recebida no Instagram ou WhatsApp: ${input}`
          }
        ]
      }, {
        headers: {
          Authorization: `Bearer SEU_API_KEY_DA_OPENAI`,
          "Content-Type": "application/json"
        }
      });

      const texto = r.data.choices[0].message.content;
      setResposta(texto);
      setHistorico((prev) => [...prev, { pergunta: input, resposta: texto }]);
    } catch (e) {
      setResposta("Erro ao gerar resposta. Verifique sua API Key.");
    }
    setLoading(false);
  };

  if (!user) {
    return <div className="text-center p-10">Carregando usuário...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">DMCloser AI</h1>
      <p className="text-gray-600 mb-4">Logado como: {user.email} | Plano: {user.plano}</p>

      <textarea
        className="w-full border p-3 mb-4 rounded"
        rows="4"
        placeholder="Cole aqui a mensagem recebida do cliente..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>

      <button
        onClick={handleResponder}
        disabled={!input || loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Gerando resposta..." : "Responder com IA"}
      </button>

      {resposta && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="font-semibold mb-2">Resposta sugerida:</h2>
          <p>{resposta}</p>
        </div>
      )}

      {historico.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">Histórico</h3>
          <ul className="space-y-3">
            {historico.map((item, index) => (
              <li key={index} className="bg-white border p-3 rounded">
                <p className="text-sm text-gray-500 mb-1"><strong>Pergunta:</strong> {item.pergunta}</p>
                <p><strong>Resposta:</strong> {item.resposta}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}