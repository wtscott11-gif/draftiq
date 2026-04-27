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

const apiKey = process.env.ANTHROPIC_API_KEY;
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

const { system, messages, model, max_tokens } = body;

if (!messages || !Array.isArray(messages)) {
return new Response(JSON.stringify({ error: “messages array required” }), {
status: 400,
headers: { “Content-Type”: “application/json” },
});
}

try {
const upstream = await fetch(“https://api.anthropic.com/v1/messages”, {
method: “POST”,
headers: {
“Content-Type”: “application/json”,
“x-api-key”: apiKey,
“anthropic-version”: “2023-06-01”,
},
body: JSON.stringify({
model: model || “claude-sonnet-4-20250514”,
max_tokens: max_tokens || 1024,
system: system || “”,
messages,
}),
});

```
const data = await upstream.json();

return new Response(JSON.stringify(data), {
  status: upstream.status,
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
