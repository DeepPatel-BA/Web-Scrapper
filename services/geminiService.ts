import { GoogleGenAI, Tool } from "@google/genai";

const OUTPUT_TEMPLATE = `
[Page Title]

1. Header & Nav Bar
• Logo: [Text Name]
• Logo Images: [URL]
• Contact Button: [Text] linking to [URL]
• Primary Menu Items: [Item 1, Item 2, ...]

2. Hero section:
Title: [Main Headline]
[If hero has cards/features]
Card 1:
Header: [Title]
Description: [Text]
Image: [URL]
Button -> [Text](Link)

Section [N]: [Section Name]
Header: [Main Heading]
Sub-header: [Subtitle]
Description: [Body Text]
Image: [URL]
Video: [URL]
Button -> [Text](Link)

[For Lists/Grids/Testimonials/Services]
Card 1:
Header: [Title]
Description: [Text]
Image: [URL]

Card 2:
...

[For Image Carousels/Logos]
Slide 1:
Image: [URL]
Slide 2:
...

[For Forms]
Form: [Type of Form]
Step 1: [Field Label] (Type)
Step 2: ...

Footer:
Logo: [URL]
Description: [Text]
Address: [Text]
Quick Links:
* [Text](Link)
Social Media:
* [Platform](Link)
`;

export const parseWebContent = async (input: string, mode: 'url' | 'text'): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelId = 'gemini-2.5-flash';

  let prompt = "";
  let tools: Tool[] = [];

  const systemInstruction = `You are an expert web content parser and structurer.
  Your task is to analyze web content (URL or raw text) and extract it into a specific, clean text format.

  **STRICT OUTPUT FORMATTING RULES:**
  1. **Structure:** Follow the template below EXACTLY. Number the sections starting from "1. Header & Nav Bar".
  2. **Headers & Text:** Detect Hierarchy. Header = H1/H2. Sub-header = H3/H4 or subtitle. Description = P/Body.
  3. **Cards & Slides:**
     - Detect **Grids, Lists, Services, Testimonials** as "Card 1", "Card 2", etc.
     - Detect **Carousels, Image Sliders, Logo strips** as "Slide 1", "Slide 2", etc.
     - **CRITICAL:** Do not summarize. List **EVERY** single card or slide found.
  4. **Media:**
     - Extract **Image URLs** (img src, background-image). Format: \`Image: [URL]\`.
     - Extract **Video URLs**. Format: \`Video: [URL]\`.
  5. **Interactions:**
     - Buttons: \`Button -> [Text](Link)\`.
     - Forms: List input fields as "Step 1", "Step 2", etc.
  6. **Footer:** Detailed extraction of links, address, and social media.

  **TEMPLATE TO FOLLOW:**
  ${OUTPUT_TEMPLATE}
  `;

  if (mode === 'url') {
    prompt = `Visit and analyze the following URL: ${input}
    
    Task:
    1. Read the entire landing page.
    2. Break it down into numbered sections (1. Header, 2. Hero, Section 3, ...).
    3. Extract ALL content, including every item in carousels/lists.
    4. Extract all image/video URLs.
    5. Format the output strictly according to the TEMPLATE provided in system instructions.`;
    
    tools = [{ googleSearch: {} }];
  } else {
    prompt = `Analyze the following raw HTML/Text content:
    
    ${input}
    
    Task:
    1. Parse the structure into numbered sections.
    2. Extract Headers, Descriptions, Images, and Links.
    3. Identify repeating elements (cards, slides) and list them all.
    4. Format the output strictly according to the TEMPLATE provided in system instructions.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        tools: tools,
        temperature: 0.1, // Very low temperature for strict formatting
      },
    });

    if (response.text) {
      return response.text;
    } else {
      throw new Error("No text response generated from the model.");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
