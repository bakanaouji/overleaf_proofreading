import { CONFIG_NAMES } from './constants.js';

export async function fetchConfig() {
  const config = await chrome.storage.sync.get(CONFIG_NAMES);
  return config;
}