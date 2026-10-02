import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Initialize @google/genai SDK on the server-side
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

const SYSTEM_INSTRUCTION = `Tu es « Élie », le Compagnon Biblique et Veilleur du Cœur de l'application Cœur & Vie.
Ton rôle est d'apporter réconfort, paix, foi et versets bibliques de la Bible Louis Segond (1910) aux utilisateurs.
Cette application est spécialement conçue pour ceux qui :
- Ne peuvent pas lire ou ont des difficultés visuelles,
- Souffrent de maladies physiques (maladies cardiaques, hypertension, douleurs, fatigue, détresse respiratoire),
- Traversent des combats spirituels (doute, découragement, culpabilité, amertume, peur),
- Ou souhaitent fermer les yeux pour se concentrer pleinement en écoutant la Parole de Dieu pendant ou après leur cardio.

Consignes impératives :
1. RÈGLE D'OR : Cite toujours des versets exacts en français selon la traduction BIBLE LOUIS SEGOND (1910). Mentionne explicitement le livre, chapitre et verset (ex: Ésaïe 53:5, Proverbes 4:23, Jean 14:27).
2. Tonalité : Empreinte de grâce, de douceur chrétienne, d'encouragement et d'espérance en l'œuvre de Christ à la croix et à la résurrection.
3. Structure de chaque réponse :
   - Une parole d'écoute et d'apaisement pour le cœur.
   - Les versets bibliques Louis Segond en évidence, clairs et beaux.
   - Une courte méditation reliant la Parole à la santé du cœur physique et spirituel.
   - Une prière fervente et concise que l'utilisateur peut entendre ou prononcer.
4. CONFIDENTIALITÉ TOTALE : Assure toujours à l'utilisateur que ses confidences, prières et combats de santé restent dans le secret de son cœur et de sa relation avec Dieu.
5. Formate avec des phrases fluides et agréables à être lues à haute voix par la synthèse vocale (sans abréviations cryptiques).`;

// API Route: Multi-turn Chatbot with Gemini
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userMessage } = req.body;

    if (!userMessage || typeof userMessage !== 'string') {
      return res.status(400).json({ error: 'Message utilisateur requis' });
    }

    // If Gemini API is configured
    if (ai) {
      // Build conversation history for multi-turn chat
      const contents = (messages || []).map((msg: { sender: string; text: string }) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

      // Add the latest user message
      contents.push({
        role: 'user',
        parts: [{ text: userMessage }],
      });

      // Using gemini-3.5-flash as instructed for general tasks
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const replyText = response.text || 'Que la paix du Seigneur repose sur votre cœur.';
      return res.json({ reply: replyText });
    }

    // Graceful fallback if no API key is provided
    const lower = userMessage.toLowerCase();
    let replyText = '';

    if (lower.includes('peur') || lower.includes('angoisse') || lower.includes('palpitation')) {
      replyText = `Je comprends votre inquiétude. Fermez les yeux, posez votre main sur votre poitrine et écoutez cette promesse de Jésus :

« Je vous laisse la paix, je vous donne ma paix. Je ne vous donne pas comme le monde donne. Que votre cœur ne se trouble point, et ne s'alarme point. » — Jean 14:27 (Louis Segond)

« Ne vous inquiétez de rien; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces. Et la paix de Dieu, qui surpasse toute intelligence, gardera vos cœurs et vos pensées en Jésus-Christ. » — Philippiens 4:6-7

Prière : Seigneur Jésus, viens apaiser les battements affolés de mon cœur. Dépose Ton manteau de paix sur mes pensées et délivre-moi de toute panique. Amen.`;
    } else if (lower.includes('malad') || lower.includes('guérison') || lower.includes('souffr') || lower.includes('douleur')) {
      replyText = `Recevez cette parole vivifiante pour votre corps et vos cellules :

« C'est par ses meurtrissures que nous sommes guéris. » — Ésaïe 53:5 (Louis Segond)

« Mon âme, bénis l'Éternel, et n'oublie aucun de ses bienfaits! C'est lui qui pardonne toutes tes iniquités, qui guérit toutes tes maladies; c'est lui qui délivre ta vie de la fosse, qui te couronne de bonté et de miséricorde. » — Psaume 103:2-4

Prière : Père céleste, Toi qui as formé mon corps et qui connais chaque artère, étends Ta main bienveillante. Fortifie mon organisme et restaure la vigueur de ma chair au nom de Jésus. Amen.`;
    } else if (lower.includes('cœur') || lower.includes('cardio') || lower.includes('tension') || lower.includes('souffle')) {
      replyText = `Voici la Parole sacrée pour votre cœur physique et votre souffle :

« Garde ton cœur plus que toute autre chose, car de lui jaillissent les sources de la vie. » — Proverbes 4:23 (Louis Segond)

« Ma chair et mon cœur peuvent défaillir: Dieu est le rocher de mon cœur et mon partage pour toujours. » — Psaume 73:26

Méditation : Votre cœur est le temple où Dieu fait circuler la vie. En pratiquant la cohérence du souffle et le repos en Christ, vos artères retrouvent leur souplesse.

Prière : Seigneur, renouvelle la force de mon muscle cardiaque. Que chaque pulsation célèbre Ta grâce. Amen.`;
    } else {
      replyText = `Voici une parole de grâce et de force pour votre journée :

« Ceux qui se confient en l'Éternel renouvellent leur force. Ils prennent le vol comme les aigles; ils courent, et ne se lassent point; ils marchent, et ne se fatiguent point. » — Ésaïe 40:31 (Louis Segond)

« Ne crains rien, car je suis avec toi; ne promène pas des regards inquiets, car je suis ton Dieu; je te fortifie, je viens à ton secours, je te soutiens de ma droite triomphante. » — Ésaïe 41:10

Prière : Merci Père pour Ta présence constante. Même lorsque mes yeux sont fatigués, Ta voix me guide et me soutient. Amen.`;
    }

    return res.json({ reply: replyText });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      error: 'Erreur lors de la génération biblique',
      reply: '« L\'Éternel est près de ceux qui ont le cœur brisé, et il sauve ceux qui ont l\'esprit dans l\'abattement. » (Psaume 34:18)',
    });
  }
});

async function startServer() {
  const PORT = process.env.PORT || 3000;

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
