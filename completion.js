import { fetchConfig } from "./config.js";

function buildMessages(prompt, selection) {
  let messages = [
    {
      role: "system",
      content: "Answer in Japanese",
    },
    {
      role: "user",
      content: prompt + "\n\n```\n" + selection + "\n```",
    }
  ];
  return messages;
}

async function completionByAzure(endpoint, apiKey, model, messages, parameters = {}) {
  const apiVersion = "2023-05-15";
  const response = await fetch(
    `${endpoint}/openai/deployments/${model}/chat/completions?api-version=${apiVersion}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json; utf-8",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        messages: messages,
        ...parameters,
      }),
    }
  );

  if (!response.ok) {
    alert(`Error: ${response.statusText}`);
  }
  const data = await response.json();
  const content = data.choices[0].message.content;
  return content;
}

export async function completion(selection) {
  const config = await fetchConfig();
  const apiKey = config.apiKey;
  if (apiKey === "") {
    alert("Please set your OpenAI API key in the options page.");
    return;
  }

  const prompt = config.prompt;
  if (!prompt || prompt === "") {
    alert("Please set an prompt message in the options page.");
  }

  const messages = buildMessages(prompt, selection);
  let result = null;
  result = await completionByAzure(
    config.endpoint,
    apiKey,
    config.model,
    messages,
    { top_p: 0.8 }
  );
  return result;
}