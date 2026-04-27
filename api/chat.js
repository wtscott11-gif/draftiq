export const config = {
runtime: “edge”,
};

export default async function handler(req) {
if (req.method === “OPTIONS”) {
return new Response(null, {
status: 204,
headers: {
“Access-Control-Allow-Origin”: “*”,
“Access-Control-Allow-Methods”: “POST, OPTIONS”,
“Access-Control-Allow-Headers”: “Content-Type”,
},
});
}

if (req.method !== “POST”) {
return new Response(JSON.stringify({ error: “Method not allowed” }), {
status: 405,
headers: { “Content-Type”: “application/json” },
});
}

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
return new Response(JSON.stringify({ error: “API key not configured” }), {
status: 500,
headers: { “Content-Type”: “application/json” },
});
}

let body;
try {
body = await req.json();
} catch {
return new Response(JSON.stringify({ error: “Invalid JSON body” }), {
status: 400,
headers: { “Content-Type”: “application/json” },
});
}

const { system, messages } = body;

if (!messages || !Array.isArray(messages)) {
return new Response(JSON.stringify({ error: “messages array required” }), {
status: 400,
headers: { “Content-Type”: “application/json” },
});
}

// Convert messages array to Gemini’s contents format.
// Gemini uses “user” and “model” roles (not “assistant”).
const contents = messages.map((m) => ({
role: m.role === “assistant” ? “model” : “user”,
parts: [{ text: m.content }],
}));

const geminiBody = {
system_instruction: system
? { parts: [{ text: system }] }
: undefined,
contents,
generationConfig: {
maxOutputTokens: 1024,
temperature: 0.7,
},
};

try {
const model = “gemini-2.0-flash”;
const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

```
const upstream = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(geminiBody),
});

const geminiData = await upstream.json();

if (!upstream.ok) {
  return new Response(
    JSON.stringify({ error: "Gemini API error", detail: geminiData }),
    {
      status: upstream.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}

// Normalize Gemini response to the same shape App.jsx expects:
// { content: [{ text: "..." }] }
const geminiText =
  geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
  "Sorry, I couldn't generate a response.";

const normalized = {
  content: [{ type: "text", text: geminiText }],
};

return new Response(JSON.stringify(normalized), {
  status: 200,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});
```

} catch (err) {
return new Response(
JSON.stringify({ error: “Upstream request failed”, detail: err.message }),
{
status: 502,
headers: { “Content-Type”: “application/json” },
}
);
}
}
