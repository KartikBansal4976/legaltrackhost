import { NextResponse } from 'next/server';

// Predefined legal responses for common questions
const legalResponses = {
  greeting: "Hello! I'm your Legal Track assistant. I can help you with information about filing FIRs, understanding IPC sections, and general legal guidance. How can I assist you today?",
  
  fir_what: "A First Information Report (FIR) is the first step in the criminal justice process. It's a written document prepared by the police when they receive information about a cognizable offense. Filing an FIR is crucial as it sets the criminal law in motion.",
  
  fir_how: "To file an FIR online:\n1. Go to our 'File FIR' section\n2. Fill in your personal details\n3. Provide incident information\n4. Review and submit\n5. You'll receive a CID for tracking\n\nYou can also visit your local police station to file in person.",
  
  ipc_what: "The Indian Penal Code (IPC) is the main criminal code of India. It defines various offenses and their punishments. Common sections include:\n• IPC 420: Cheating and fraud\n• IPC 378: Theft\n• IPC 302: Murder\n• IPC 354: Assault on women\n• IPC 406: Criminal breach of trust",
  
  legal_advice: "I can provide general legal information, but for specific legal advice, please consult a qualified lawyer. I can help you understand legal procedures, IPC sections, and guide you through filing documents.",
  
  police_help: "The police are here to help you. If you're in immediate danger, call 100. For filing complaints, you can:\n• Visit the nearest police station\n• Use our online FIR filing system\n• Contact the police helpline in your area",
  
  evidence: "When filing an FIR, gather all available evidence:\n• Photographs of the incident\n• CCTV footage if available\n• Witness statements\n• Medical reports (if applicable)\n• Any documents related to the case\n• Preserve physical evidence",
  
  tracking: "To track your FIR:\n• Use the CID (Content Identifier) provided\n• Contact the police station where you filed\n• Check online status portals\n• Follow up with the investigating officer",
  
  rights: "As a citizen, you have the right to:\n• File an FIR for cognizable offenses\n• Get a copy of your FIR\n• Know the status of your case\n• Be treated with dignity by police\n• File complaints against police misconduct",
  
  emergency: "For emergencies:\n• Call 100 (Police)\n• Call 101 (Fire)\n• Call 102 (Ambulance)\n• Call 1091 (Women Helpline)\n• Call 1098 (Child Helpline)",
  
  cybercrime: "For cybercrime complaints:\n• File an FIR at your local police station\n• Report to cybercrime.gov.in\n• Contact the cybercrime helpline\n• Preserve digital evidence\n• Don't delete suspicious messages or emails",
  
  property_dispute: "For property disputes:\n• Gather all property documents\n• Collect evidence of ownership\n• File a complaint with the police\n• Consider mediation services\n• Consult a property lawyer",
  
  domestic_violence: "If you're experiencing domestic violence:\n• Call 1091 (Women Helpline)\n• Contact local women's organizations\n• File a complaint with the police\n• Seek medical attention if needed\n• Consider legal protection orders",
  
  traffic_violation: "For traffic violations:\n• Pay fines online through official portals\n• Contest violations in traffic court\n• Keep all related documents\n• Follow traffic rules to avoid future violations",
  
  consumer_rights: "Your consumer rights include:\n• Right to safety\n• Right to information\n• Right to choose\n• Right to be heard\n• Right to seek redressal\n\nFile complaints with consumer forums or the police if needed."
};

// Function to find the best response based on user input
function findBestResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return legalResponses.greeting;
  }
  
  if (lowerMessage.includes('fir') && (lowerMessage.includes('what') || lowerMessage.includes('mean'))) {
    return legalResponses.fir_what;
  }
  
  if (lowerMessage.includes('fir') && (lowerMessage.includes('how') || lowerMessage.includes('file'))) {
    return legalResponses.fir_how;
  }
  
  if (lowerMessage.includes('ipc') || lowerMessage.includes('penal code')) {
    return legalResponses.ipc_what;
  }
  
  if (lowerMessage.includes('legal advice') || lowerMessage.includes('lawyer')) {
    return legalResponses.legal_advice;
  }
  
  if (lowerMessage.includes('police') && (lowerMessage.includes('help') || lowerMessage.includes('contact'))) {
    return legalResponses.police_help;
  }
  
  if (lowerMessage.includes('evidence') || lowerMessage.includes('proof')) {
    return legalResponses.evidence;
  }
  
  if (lowerMessage.includes('track') || lowerMessage.includes('status')) {
    return legalResponses.tracking;
  }
  
  if (lowerMessage.includes('rights') || lowerMessage.includes('entitled')) {
    return legalResponses.rights;
  }
  
  if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
    return legalResponses.emergency;
  }
  
  if (lowerMessage.includes('cyber') || lowerMessage.includes('online') || lowerMessage.includes('internet')) {
    return legalResponses.cybercrime;
  }
  
  if (lowerMessage.includes('property') || lowerMessage.includes('land') || lowerMessage.includes('house')) {
    return legalResponses.property_dispute;
  }
  
  if (lowerMessage.includes('domestic') || lowerMessage.includes('abuse') || lowerMessage.includes('violence')) {
    return legalResponses.domestic_violence;
  }
  
  if (lowerMessage.includes('traffic') || lowerMessage.includes('driving') || lowerMessage.includes('vehicle')) {
    return legalResponses.traffic_violation;
  }
  
  if (lowerMessage.includes('consumer') || lowerMessage.includes('purchase') || lowerMessage.includes('buy')) {
    return legalResponses.consumer_rights;
  }
  
  // Default response for other queries
  return "I understand you have a legal question. While I can provide general information about legal procedures, IPC sections, and filing FIRs, for specific legal advice, please consult a qualified lawyer. What specific legal information are you looking for?";
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Debug: Check if API key is available
  console.log("GEMINI_API_KEY available:", !!process.env.GEMINI_API_KEY);
  console.log("GEMINI_API_KEY length:", process.env.GEMINI_API_KEY?.length || 0);

  try {
    // Get the last user message
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    
    // First, try to use predefined responses for common questions
    const predefinedResponse = findBestResponse(lastUserMessage);
    
    // If we have a good predefined response, use it
    if (predefinedResponse && predefinedResponse !== legalResponses.greeting) {
      return NextResponse.json({ 
        role: "assistant", 
        content: predefinedResponse 
      });
    }

    // For more complex queries, use Gemini API
    if (process.env.GEMINI_API_KEY) {
      // Convert messages to Gemini format
      const geminiMessages = messages.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      // Add context for legal assistance
      const systemPrompt = {
        role: 'user',
        parts: [{ text: `You are a helpful legal assistant for LegalTrack, an Indian legal services platform. You help users understand legal procedures, IPC sections, and filing FIRs. Always provide accurate, helpful information and suggest consulting a lawyer for specific legal advice. Keep responses concise and informative.` }]
      };

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [systemPrompt, ...geminiMessages],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API Error:", errorData);
        throw new Error(`Gemini API Error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Extract the response text from Gemini's response format
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
      
      return NextResponse.json({ 
        role: "assistant", 
        content: responseText 
      });
    } else {
      // Fallback to predefined response if no API key
      return NextResponse.json({ 
        role: "assistant", 
        content: predefinedResponse 
      });
    }
  } catch (error) {
    console.error("Chat API Error:", error);
    
    // Fallback to predefined response on error
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    const fallbackResponse = findBestResponse(lastUserMessage);
    
    return NextResponse.json({ 
      role: "assistant", 
      content: fallbackResponse 
    });
  }
}