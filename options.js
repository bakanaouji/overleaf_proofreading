import { CONFIG_NAMES, MODELS } from "./constants.js";
import { fetchConfig } from "./config.js";

function validateConfig(config) {
  if (config.apiKey === "") {
    alert("Please set your OpenAI API key in the options page.");
    return false;
  }

  const models = MODELS;
  const model = config.model || "";
  if (models.indexOf(model) === -1) {
    alert("Please set your model in the options page.");
    return false;
  }

  if (config.endpoint === "") {
    alert("Please set your Azure endpoint in the options page.");
    return false;
  }

  return true;
}

function buildModelOptions(selected) {
  const elem = getInputElementById("model");
  if (!elem) return;

  const models = MODELS;

  elem.innerHTML = "";
  models.forEach((model) => {
    const option = document.createElement("option");
    option.value = model;
    option.text = model;
    elem.appendChild(option);
  });

  if (selected) {
    elem.value = selected;
  } else {
    elem.value = models[0];
  }
}

function getInputElementById(id) {
  return document.getElementById(id);
}

function initialize(config) {
  getInputElementById("apiKey").value = config.apiKey || "";
  getInputElementById("endpoint").value = config.endpoint || "";
  if (config.prompt && config.prompt !== "") {
    getInputElementById("prompt").value = config.prompt;
  }

  buildModelOptions(config.model);

  // Setup show and hide of the API key and endpoint
  getInputElementById("showApiKey").addEventListener("change", () => {
    const elem = getInputElementById("apiKey");
    if (elem.type === "password") {
      elem.type = "text";
    } else {
      elem.type = "password";
    }
  });
  getInputElementById("showEndpoint").addEventListener("change", () => {
    const elem = getInputElementById("endpoint");
    if (elem.type === "password") {
      elem.type = "text";
    } else {
      elem.type = "password";
    }
  });

  // Save the config when the "Save" button is clicked
  getInputElementById("saveButton").addEventListener("click", () => {
    const config = CONFIG_NAMES.reduce((obj, key) => {
      obj[key] = getInputElementById(key).value.toString() || "";
      return obj;
    }, {});

    if (validateConfig(config)) {
      chrome.storage.sync.set(config, () => {
        alert("Config saved.");
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const config = await fetchConfig();
  initialize(config);
});