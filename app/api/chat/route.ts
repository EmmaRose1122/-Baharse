import { NextRequest, NextResponse } from "next/server";
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_SETTINGS } from "@/lib/supabase/mock-data";

// Rich system prompt providing comprehensive store knowledge in English & Roman Urdu
const SYSTEM_PROMPT = `You are "BaharSe AI Assistant", the official luxury e-commerce sales and customer support concierge for "BaharSe Foreign Imports" (https://theselfcare.online/ or baharse.pk).

### Store Overview:
- Name: BaharSe Foreign Imports (BaharSe PK).
- Business Model: A boutique store in Pakistan selling 100% original, brand-new foreign products personally brought by the store owner from international journeys (Dubai, Istanbul Turkey, London UK, USA, Thailand, etc.).
- Location: Liberty Market, Gulberg III, Lahore, Pakistan.
- Nationwide Delivery: All cities across Pakistan (Lahore, Karachi, Islamabad, Rawalpindi, Peshawar, Quetta, Multan, Faisalabad, Sialkot, etc.) via TCS & Leopards Courier.
- Delivery Timelines: 1-2 days for Lahore/Islamabad, 2-3 days for Karachi/major cities, 3-4 days for other regions.
- Shipping Fee: Standard delivery is Rs. 250 flat nationwide. FREE Delivery on orders of Rs. 5,000 or more!

### STRICT PAYMENT POLICY - ADVANCE PAYMENT ONLY:
- Note: We DO NOT offer Cash on Delivery (COD). Every order is processed strictly via Verified Advance Payment.
- Supported Channels:
  1. JazzCash Mobile Account: 0300 1234567 (Title: Muhammad Mateen)
  2. EasyPaisa Mobile Account: 0321 7654321 (Title: Muhammad Mateen)
  3. Bank Transfer / Raast: Meezan Bank Limited (A/C: 01020304050607, IBAN: PK64MEZN0001020304050607, Title: Muhammad Mateen, Raast ID: 03001234567)
- How Advance Payment Works: Customer places order on checkout, copies receiving account details, transfers funds, enters Transaction ID (TID / Ref #), and uploads payment receipt screenshot. Our finance desk verifies TID within 2-4 working hours and dispatches parcel.
- Order Tracking: Customers can track live verification and parcel status anytime on our website tracking page: /track-order.

### Product Categories & Catalog:
1. Kitchen Spices (Masalay):
   - Pure Royal Super Negin Saffron (5g Sealed Tin) - Rs. 6,450 (Dubai/Iran import, Grade 1 certified)
   - Kashmiri Shahi Zeera / Black Cumin (250g Jar) - Rs. 1,450 (High aromatic oil content)
   - Green Cardamom Jumbo Pods 8mm (100g) - Rs. 2,850 (Imported from Dubai souks)
2. Perfumes & Attars (100% Authentic Factory Sealed):
   - Lattafa Khamrah Eau De Parfum (100ml Original) - Rs. 8,950 (Dubai UAE)
   - Club De Nuit Intense Man Pure Parfum Armaf (150ml) - Rs. 11,500 (France/UAE)
   - Afnan 9 PM Pour Homme EDP (100ml) - Rs. 7,450 (Dubai UAE)
   - Royal Dehn Al Oud Cambodi Attar (6ml Crystal Bottle) - Rs. 5,800
3. Medicines & Health Supplements:
   - Kirkland Signature Glucosamine with MSM 1500mg (375 Tablets) - Rs. 7,800 (USA import)
   - Nature Made Fish Oil 1200mg Omega-3 (200 Softgels) - Rs. 5,600 (USA import)
   - Seven Seas JointCare Max with Omega-3 & Collagen (30+30 Pack) - Rs. 6,950 (UK import)
   - Tiger Balm White Ointment Extra Strength (30g Jar) - Rs. 1,250 (Thailand import)
4. Ladies Suits & Luxury Pret:
   - Turkish Hand-Embroidered Luxury Pret 3-Piece Silk Suit - Rs. 18,500 (Istanbul Turkey)
   - Dubai Boutique Pure Nidha Fabric Abaya with Sheila - Rs. 9,750 (Dubai UAE)
   - Kashmiri Hand-Woven Pashmina Jacquard Shawl - Rs. 14,200 (Kashmir)
5. Gents Pants & Trousers:
   - Imported Premium 4-Way Stretch Chino Pant - Rs. 4,250 (Thailand/UAE import)
   - European Cut Non-Iron Formal Dress Trouser - Rs. 5,450 (Turkey/UK import)
   - Japanese High-Density Cotton Cargo Pant - Rs. 4,850 (Imported)

### Personality & Tone:
- Professional, hospitable, courteous, honest Pakistani boutique host.
- Greet with "Assalam-o-Alaikum" or "Salam".
- BILINGUAL: If the customer talks in Roman Urdu (e.g., "saffron ki price kya hai", "order kaisay karun?"), reply warmly in fluent Roman Urdu. If they speak in English or Urdu script, reply in that language.
- Mention prices clearly in Pakistani Rupees (Rs. / PKR).
- Emphasize authenticity: All items are handpicked personally by the store owner with genuine batch codes.
- Guide them directly to browse (/shop), add items to cart, or check order status (/track-order).
- NEVER mention WhatsApp or external chat links. All orders and tracking happen right here on the website!`;

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// Fallback response generator if API keys are not provided or error occurs
function generateFallbackResponse(userQuery: string): string {
  const query = userQuery.toLowerCase();

  if (query.includes("saffron") || query.includes("zafran") || query.includes("masala") || query.includes("spice") || query.includes("zeera") || query.includes("ilaichi") || query.includes("cardamom")) {
    return `Assalam-o-Alaikum! BaharSe PK par humara **Pure Royal Super Negin Saffron (5g sealed tin)** Rs. 6,450 ka hai, jo Dubai & Iran se direct handpicked grade-1 saffron hai.

Humare paas **Green Cardamom Jumbo 8mm** (Rs. 2,850) aur **Kashmiri Shahi Zeera** (Rs. 1,450) bhi 100% original available hain. Aap hamari [Kitchen Spices](/category/kitchen-spices) collection browse kar saktay hain!`;
  }

  if (query.includes("perfume") || query.includes("fragrance") || query.includes("oud") || query.includes("lattafa") || query.includes("armaf") || query.includes("khamrah") || query.includes("attar") || query.includes("khushbu")) {
    return `Walaikum Assalam! BaharSe par tamam perfumes 100% original factory sealed batch hain:

• **Lattafa Khamrah EDP (100ml):** Rs. 8,950 (Dubai UAE)
• **Club De Nuit Intense Man Pure Parfum (150ml):** Rs. 11,500 (Armaf)
• **Afnan 9 PM (100ml):** Rs. 7,450
• **Royal Dehn Al Oud Cambodi Attar (6ml):** Rs. 5,800

Tamam bottles verified barcode aur batch code ke sath aati hain. Aap [Perfumes Catalog](/category/perfumes) check kar saktay hain!`;
  }

  if (query.includes("medicine") || query.includes("supplement") || query.includes("vitamin") || query.includes("glucosamine") || query.includes("fish oil") || query.includes("kirkland") || query.includes("jointcare") || query.includes("tiger balm")) {
    return `Assalam-o-Alaikum! Hamari health & supplements collection direct USA & UK se imported hai:

• **Kirkland Glucosamine with MSM 1500mg (375 Tabs):** Rs. 7,800 (USA)
• **Nature Made Fish Oil Omega-3 (200 Softgels):** Rs. 5,600 (USA)
• **Seven Seas JointCare Max Collagen:** Rs. 6,950 (UK)
• **Tiger Balm White Extra Strength (30g):** Rs. 1,250 (Thailand)

Aap [Medicines & Supplements](/category/medicines) page par detail dekh saktay hain.`;
  }

  if (query.includes("suit") || query.includes("abayas") || query.includes("abaya") || query.includes("ladies") || query.includes("shawl") || query.includes("pret")) {
    return `Assalam-o-Alaikum! Ladies collection mein humare paas exclusive imported boutique pieces hain:

• **Turkish Embroidered Pret 3-Piece Silk Suit:** Rs. 18,500 (Istanbul)
• **Dubai Boutique Pure Nidha Abaya with Sheila:** Rs. 9,750 (Dubai)
• **Kashmiri Hand-Woven Pashmina Jacquard Shawl:** Rs. 14,200

Har piece brand-new pristine condition mein aata hai. Check out: [Ladies Suits](/category/ladies-suits)!`;
  }

  if (query.includes("pant") || query.includes("chino") || query.includes("trouser") || query.includes("cargo") || query.includes("gents")) {
    return `Walaikum Assalam! Gents trousers mein hamaray paas European aur Asian high-quality imports hain:

• **Imported 4-Way Stretch Chino Pant:** Rs. 4,250 (Thailand/UAE)
• **European Non-Iron Formal Dress Trouser:** Rs. 5,450 (Turkey/UK)
• **Japanese High-Density Cargo Pant:** Rs. 4,850

Visit: [Gents Pants](/category/gents-pants)!`;
  }

  if (query.includes("payment") || query.includes("pay") || query.includes("cod") || query.includes("cash on delivery") || query.includes("jazzcash") || query.includes("easypaisa") || query.includes("bank") || query.includes("advance")) {
    return `Assalam-o-Alaikum! BaharSe Foreign Imports par Cash on Delivery (COD) nahi hai, hum strictly **Verified Advance Payment** par kaam kartay hain:

1. **JazzCash:** 0300 1234567 (Title: Muhammad Mateen)
2. **EasyPaisa:** 0321 7654321 (Title: Muhammad Mateen)
3. **Meezan Bank / Raast:** A/C 01020304050607 | IBAN: PK64MEZN0001020304050607 (Title: Muhammad Mateen)

**Order Process:**
Checkout par account details copy karein, amount transfer karein, Transaction ID (TID) aur screenshot enter karein. Hamari finance team 2-4 ghantay mein verify kar ke parcel dispatch karti hai!`;
  }

  if (query.includes("track") || query.includes("status") || query.includes("kahan hai") || query.includes("mera order") || query.includes("order number") || query.includes("delivery time") || query.includes("shipping")) {
    return `Assalam-o-Alaikum! Aap apna order kisi bhi waqt hamari website ke [Track Order Portal](/track-order) par apna Order Number (maslan IMP-54210) aur phone number enter kar ke check kar saktay hain.

• **Shipping Timelines:**
- Lahore / Islamabad: 1-2 business days
- Karachi / Faisalabad / Multan: 2-3 business days
- Peshawar / Quetta: 3-4 business days
• **Delivery Fee:** Flat Rs. 250 (Rs. 5,000 se upar ke order par 100% FREE Delivery)!`;
  }

  if (query.includes("original") || query.includes("fake") || query.includes("guarantee") || query.includes("authentic") || query.includes("copy")) {
    return `Ji bilkul 100% original! BaharSe ka asool yeh hai ke store owner khud foreign trips (Dubai, Turkey, UK, USA) ke doran authorized retail stores se authentic items khareed kar Pakistan latay hain. 

Hum koi local bulk copies ya third-party distributors use nahi kartay. Har product original sealed packaging aur verified batch code ke sath aata hai, plus 7-day checking warranty!`;
  }

  return `Assalam-o-Alaikum! Main BaharSe Foreign Imports ka AI Concierge hoon. 

Main aap ki kis cheez mein madad kar sakta hoon?
• **Kitchen Spices** (Royal Saffron, Cardamom, Zeera)
• **Original Perfumes** (Lattafa Khamrah, Armaf Club De Nuit)
• **Medicines & Supplements** (Kirkland Glucosamine, Omega-3 Fish Oil)
• **Ladies Pret & Abayas**
• **Gents Stretch Chinos & Formal Trousers**
• **Advance Payment & Order Tracking (/track-order)**

Aap apna sawal Urdu, Roman Urdu, ya English mein pooch saktay hain!`;
}

// Call Google Gemini API
async function callGemini(apiKey: string, messages: ChatMessage[], modelName = "gemini-1.5-flash") {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  // Convert messages to Gemini format
  const contents = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("No text response received from Gemini");
  }
  return text;
}

// Call xAI Grok API
async function callGrok(apiKey: string, messages: ChatMessage[], modelName = "grok-beta") {
  const url = "https://api.x.ai/v1/chat/completions";

  const formattedMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  ];

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelName,
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Grok API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("No text response received from Grok");
  }
  return text;
}

export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid or malformed JSON payload" },
        { status: 400 }
      );
    }
    const { messages } = (body || {}) as { messages?: ChatMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Valid messages array is required" },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage?.content || "";

    const geminiKey = process.env.GEMINI_API_KEY;
    const grokKey = process.env.GROK_API_KEY || process.env.XAI_API_KEY;
    const preferredProvider = (process.env.AI_PROVIDER || "").toLowerCase();

    let reply = "";
    let providerUsed = "fallback";

    // 1. If Grok is explicitly preferred or Gemini key is missing and Grok is present
    if (grokKey && (preferredProvider === "grok" || !geminiKey)) {
      try {
        const grokModel = process.env.GROK_MODEL || "grok-beta";
        reply = await callGrok(grokKey, messages, grokModel);
        providerUsed = "grok";
      } catch (err: any) {
        console.warn("Grok API failed, attempting Gemini or fallback:", err.message);
      }
    }

    // 2. Try Gemini if reply not yet generated and key is present
    if (!reply && geminiKey) {
      try {
        const geminiModel = process.env.GEMINI_MODEL || "gemini-1.5-flash";
        reply = await callGemini(geminiKey, messages, geminiModel);
        providerUsed = "gemini";
      } catch (err: any) {
        console.warn("Gemini API failed, attempting fallback:", err.message);
      }
    }

    // 3. Try Grok if reply not yet generated and grok key is present
    if (!reply && grokKey) {
      try {
        const grokModel = process.env.GROK_MODEL || "grok-beta";
        reply = await callGrok(grokKey, messages, grokModel);
        providerUsed = "grok";
      } catch (err: any) {
        console.warn("Grok API secondary call failed:", err.message);
      }
    }

    // 4. If neither key worked or no keys configured, use intelligent offline fallback
    if (!reply) {
      reply = generateFallbackResponse(userQuery);
      providerUsed = "offline-knowledge-base";
    }

    return NextResponse.json({
      reply,
      provider: providerUsed,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error: "Failed to process chat message",
        details: error?.message || "Unknown error",
        fallback: generateFallbackResponse("help"),
      },
      { status: 500 }
    );
  }
}
