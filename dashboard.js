const STORAGE_KEY = "atlas_content";
const DEFAULT_JSON_URL = "content.json";

const editor = document.getElementById("contentEditor");

async function loadDefault() {
  const response = await fetch(DEFAULT_JSON_URL);
  const json = await response.json();
  editor.value = JSON.stringify(json, null, 2);
}

function loadStored() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    editor.value = stored;
    return true;
  }
  return false;
}

async function init() {
  const hasStored = loadStored();
  if (!hasStored) {
    await loadDefault();
  }
}

function save() {
  try {
    JSON.parse(editor.value);
    localStorage.setItem(STORAGE_KEY, editor.value);
    alert("Saved! Open public.html to see changes.");
  } catch (error) {
    alert("Invalid JSON. Please fix errors before saving.");
  }
}

async function reset() {
  localStorage.removeItem(STORAGE_KEY);
  await loadDefault();
  alert("Reset to default JSON.");
}

document.getElementById("saveContent").addEventListener("click", save);
document.getElementById("loadDefault").addEventListener("click", reset);

init();
