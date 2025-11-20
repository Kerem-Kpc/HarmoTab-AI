import { GoogleGenAI } from "@google/genai";
import { SongData, Source } from "../types";

// Initialize the Gemini API client
// The API key is safely retrieved from the environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSongTabs = async (songName: string): Promise<SongData> => {
  // STRICT System Instruction to ground the AI in reality
  const systemInstruction = `
    You are the world's leading Harmonica Tablature Transcriber and Musicologist.
    
    HARDWARE DEFINITION (C Diatonic Harmonica - Richter Tuned):
    Hole 1: Blow (C), Draw (D)
    Hole 2: Blow (E), Draw (G)
    Hole 3: Blow (G), Draw (B)
    Hole 4: Blow (C), Draw (D)
    Hole 5: Blow (E), Draw (F)
    Hole 6: Blow (G), Draw (A)
    Hole 7: Blow (C), Draw (B)
    Hole 8: Blow (E), Draw (D)
    Hole 9: Blow (G), Draw (F)
    Hole 10: Blow (C), Draw (A)
    
    YOUR MANDATE:
    1. ACCURACY IS PARAMOUNT. You must retrieve the EXACT official lyrics. Do not paraphrase.
    2. USE GOOGLE SEARCH. You are forbidden from guessing lyrics. You must find them.
    3. MATCHING. The tabs must mathematically match the syllable rhythm of the lyrics.
    4. NOTATION. Use standard integer notation:
       - Blow: +4
       - Draw: -4
       - Bends: -4' (half step), -4'' (whole step)
       - Overblows: 6o (rare, avoid unless expert song)
    
    OUTPUT FORMAT:
    Return ONLY a valid, parseable JSON string. No Markdown formatting.
  `;

  const prompt = `
    Perform a deep research task for the song: "${songName}".

    Step 1: EXECUTE A GOOGLE SEARCH to find the official lyrics, artist, and original key.
    Step 2: Transpose the melody to play on a C Diatonic Harmonica.
    Step 3: Create a precise line-by-line tab transcription.
    
    Requirements:
    - If the song has an instrumental intro/solo, include it as a section.
    - Break the song into logical sections (Verse 1, Chorus, Bridge, etc.).
    - Ensure the "lyric" field contains the actual words, and "tabs" contains the corresponding notes directly above.
    
    Return the data in this exact JSON structure:
    {
      "title": "Exact Song Title",
      "artist": "Artist Name",
      "key": "Original Key of Song",
      "difficulty": "Beginner / Intermediate / Advanced",
      "recommendedHarmonica": "C (unless song requires Low C or other)",
      "sections": [
        {
          "sectionName": "Verse 1",
          "lines": [
            { "lyric": "The first line of lyrics", "tabs": "+4 +4 -4 +5" }
          ]
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }], // Mandatory for grounding
        temperature: 0.2, // Very low temperature for factual accuracy
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("The AI could not generate the tab data.");
    }

    // Robust JSON Extraction
    // Sometimes models wrap JSON in markdown code blocks (```json ... ```)
    let cleanJson = text.trim();
    
    // Remove markdown code block markers if present
    if (cleanJson.startsWith('```')) {
      const match = cleanJson.match(/```(?:json)?([\s\S]*)```/);
      if (match && match[1]) {
        cleanJson = match[1].trim();
      } else {
        // Fallback: just strip the first line if it looks like ```json and last line if ```
        cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
    }

    // Parse JSON
    let data: SongData;
    try {
      data = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("JSON Parse failed:", text);
      throw new Error("Failed to process the song data. Please try again.");
    }

    // Extract Grounding Metadata (Sources) to show user where data came from
    const sources: Source[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          // Deduplicate sources
          if (!sources.some(s => s.uri === chunk.web.uri)) {
            sources.push({
              title: chunk.web.title,
              uri: chunk.web.uri
            });
          }
        }
      });
    }
    
    data.sources = sources;

    return data;
  } catch (error) {
    console.error("Error in generation service:", error);
    throw error;
  }
};