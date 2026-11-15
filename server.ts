/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";

// Load environment configurations from .env
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

/**
 * Endpoint to report server configuration status back to the client safely.
 */
app.get("/api/status", (req, res) => {
  const hasKey =
    !!process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY" &&
    process.env.GEMINI_API_KEY.trim() !== "";
  res.json({ hasAPIKey: hasKey });
});

/**
 * Lazy-initializes the GoogleGenAI SDK client to prevent system crash
 * if the environment API key is missing.
 */
async function getGeminiClient(clientKey?: string) {
  const { GoogleGenAI } = await import("@google/genai");
  const rawKey = clientKey || process.env.GEMINI_API_KEY;
  if (!rawKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server or provided by the client.");
  }
  const key = rawKey.trim().replace(/^["'`]|["'`]$/g, "").replace(/\s+/g, "");
  return new GoogleGenAI({
    apiKey: key,
  });
}

/**
 * Endpoint to test the API Key and Model connection status.
 */
app.post("/api/gemini/test", async (req, res) => {
  try {
    const { apiKey, model } = req.body;
    const targetModel = model || "gemini-1.5-flash";
    
    const client = await getGeminiClient(apiKey);
    const response = await client.models.generateContent({
      model: targetModel,
      contents: "Respond with the single word READY if you can hear me. No other characters.",
    });

    if (response && response.text) {
      res.json({
        success: true,
        message: `Successfully connected to ${targetModel}! Server test output: ${response.text.trim()}`,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Gemini server responded with an empty body.",
      });
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    res.status(400).json({
      success: false,
      message: errorMsg,
    });
  }
});

/**
 * Endpoint to generate wave specifications. Uses structured JSON schemas
 * to guarantee that waves are parsed correctly without failure.
 */
app.post("/api/gemini/generate", async (req, res) => {
  try {
    const { apiKey, model, wave } = req.body;
    const targetModel = model || "gemini-1.5-flash";
    const waveNum = typeof wave === "number" ? wave : 1;

    const client = await getGeminiClient(apiKey);

    const { Type } = await import("@google/genai");

    const prompt = `You are the Tactical Ecosystem AI for an arcade shooter game "Feral Pig Hunt".
Generate tactical specs and pig battle cries for Wave ${waveNum}.`;

    const response = await client.models.generateContent({
      model: targetModel,
      contents: prompt,
      config: {
        systemInstruction: "You generate custom arcade pig wave parameters in strict JSON format. Wave Speed multiplier should stay moderate (1.0 to 1.8) and Aggression should stay balanced (1.0 to 2.4). Pig quotes must be short (under 12 words), funny, and have pig oinks or squeals.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            seedNumber: {
              type: Type.INTEGER,
              description: "A random seed number for procedural asset spawns.",
            },
            waveSpeedMultiplier: {
              type: Type.NUMBER,
              description: "Multiplier determining Hogs formation movement speeds.",
            },
            diveAggression: {
              type: Type.NUMBER,
              description: "Aggression factor of Hogs gravitational target descent.",
            },
            spottedRatio: {
              type: Type.NUMBER,
              description: "Ratio of Hogs spawned with spotted graphics.",
            },
            formationPattern: {
              type: Type.STRING,
              description: "Squadron visual deployment style.",
            },
            pigQuotes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of exactly 3 short humerous pig retro combat lines.",
            },
          },
          required: [
            "seedNumber",
            "waveSpeedMultiplier",
            "diveAggression",
            "spottedRatio",
            "formationPattern",
            "pigQuotes",
          ],
        },
      },
    });

    if (response && response.text) {
      const parsedSpecs = JSON.parse(response.text.trim());
      res.json(parsedSpecs);
    } else {
      res.status(500).json({ error: "No output received from Gemini." });
    }
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * Full-stack endpoint for Gemini Math & Science simulation & calculation.
 * Solves equations, projectile physics, or ecological population equations using the player's provided API key.
 */
app.post("/api/gemini/math-science", async (req, res) => {
  try {
    const { apiKey, model, problemType, parameters } = req.body;
    const targetModel = model || "gemini-1.5-flash";
    const client = await getGeminiClient(apiKey);
    const { Type } = await import("@google/genai");

    const prompt = `You are the Advanced Mathematical and Scientific Simulation Engine for "Feral Pig Hunt".
Compute and solve the following problem type: "${problemType || 'trajectory_physics'}" with parameters: ${JSON.stringify(parameters || {})}.
Provide precise mathematical derivations, numerical coefficients, and scientific insights in structured JSON format.`;

    const response = await client.models.generateContent({
      model: targetModel,
      contents: prompt,
      config: {
        systemInstruction: "You are a rigorous mathematical and physical science reasoning engine. Output strictly valid JSON with calculation results, formulas used, and scientific annotations.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            success: { type: Type.BOOLEAN },
            problemType: { type: Type.STRING },
            computedValues: {
              type: Type.OBJECT,
              properties: {
                resultFactor: { type: Type.NUMBER },
                trajectoryVelocity: { type: Type.NUMBER },
                ecosystemEquilibrium: { type: Type.NUMBER },
                precisionRating: { type: Type.NUMBER },
              },
              required: ["resultFactor", "trajectoryVelocity", "ecosystemEquilibrium", "precisionRating"],
            },
            formulaDescription: { type: Type.STRING },
            scientificExplanation: { type: Type.STRING },
          },
          required: ["success", "problemType", "computedValues", "formulaDescription", "scientificExplanation"],
        },
      },
    });

    if (response && response.text) {
      const mathResult = JSON.parse(response.text.trim());
      res.json(mathResult);
    } else {
      res.status(500).json({ error: "No output received from Gemini Math Engine." });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * Configure Vite middleware (Development) or serve compiled assets (Production)
 */
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode serving static assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Feral Pig Hunt server running at http://localhost:${PORT}`);
  });
}

setupViteOrStatic();
