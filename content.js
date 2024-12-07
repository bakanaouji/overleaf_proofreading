import { completion } from "./completion.js";

document.addEventListener('mouseup', function (event) {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0) {
    const range = window.getSelection().getRangeAt(0);
    const rect = range.getBoundingClientRect();
    showIcon(selectedText, rect.left + window.scrollX, rect.bottom + window.scrollY);
  } else {
    removeIcon();
  }
});

function showIcon(selectedText, x, y) {
  let icon = document.getElementById('selection-icon');
  if (!icon) {
    icon = document.createElement('img');
    icon.src = chrome.runtime.getURL('./images/icon32.png');
    icon.id = 'selection-icon';
    icon.style.position = 'absolute';
    icon.style.cursor = 'pointer';
    icon.style.zIndex = '1000';
    document.body.appendChild(icon);
    icon.addEventListener('click', () => {
      onIconClick(selectedText);
      removeIcon();
    });
  }
  icon.style.left = `${x}px`;
  icon.style.top = `${y}px`;
}

function removeIcon() {
  const icon = document.getElementById('selection-icon');
  if (icon) {
    icon.remove();
  }
}

function onIconClick(selectedText) {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  const x = rect.left + window.pageXOffset;
  const y = rect.bottom + window.pageYOffset;

  const processing = showProcessing(x, y);
  completion(selectedText)
    .then((result) => {
      popupOutput(result, x, y);
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      document.body.removeChild(processing);
    });
}

function showProcessing(x, y) {
  const div = document.createElement("div");
  div.style.position = "absolute";
  div.style.left = `${x}px`;
  div.style.top = `${y}px`;
  div.style.backgroundColor = "#292A31";
  div.style.border = "1px solid black";
  div.style.padding = "10px";
  div.style.zIndex = "1000";
  div.style.color = "#E6E1E7";
  div.style.fontSize = "12px";
  div.innerText = "Processing...";
  document.body.appendChild(div);
  return div;
}

function popupOutput(output, x, y) {
  const div = document.createElement("div");
  div.style.position = "absolute";
  div.style.left = `${x}px`;
  div.style.top = `${y}px`;
  div.style.backgroundColor = "#292A31";
  div.style.border = "1px solid black";
  div.style.padding = "10px";
  div.style.zIndex = "1000";
  div.style.color = "#E6E1E7";
  div.style.fontSize = "12px";
  div.innerText = output;
  div.appendChild(document.createElement("br"));

  // Close button
  const closeButton = document.createElement("button");
  closeButton.style.backgroundColor = "grey";
  closeButton.style.borderRadius = "5px";
  closeButton.style.color = "black";
  closeButton.style.padding = "5px";
  closeButton.innerText = "Close";
  closeButton.addEventListener("click", () => {
    document.body.removeChild(div);
  });
  div.appendChild(closeButton);

  // Copy to clipboard button
  const copyButton = document.createElement("button");
  copyButton.style.backgroundColor = "grey";
  copyButton.style.borderRadius = "5px";
  copyButton.style.color = "black";
  copyButton.style.padding = "5px";
  copyButton.innerText = "Copy to clipboard";
  copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(output);
  });
  div.appendChild(copyButton);
  document.body.appendChild(div);

  // Adjust the position of the popup
  // If the popup is out of the window, move it inside
  const rect = div.getBoundingClientRect();
  if (rect.right > window.innerWidth) {
    div.style.left = `${window.innerWidth - rect.width}px`;
  }
  if (rect.bottom > window.innerHeight) {
    div.style.top = `${window.innerHeight - rect.height}px`;
  }
}
