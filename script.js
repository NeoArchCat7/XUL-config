function setupInputLimits(inputId, min, max) {
  const input = document.getElementById(inputId);

  input.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
    if (this.value === "") return;
    let num = parseInt(this.value);

    if (num > max) num = max;
    if (num < min) num = min;
    this.value = num;

    // Update fader position based on pre-limited input value
    const faderKnob = document.getElementById(
      `fader-knob-${inputId.split("-")[1]}`
    );
    const faderRect = faderKnob.parentElement.getBoundingClientRect();
    const newY = (1 - num / 127) * faderRect.height;
    faderKnob.style.top = `${newY}px`;
  });
}

// Theme Switching
const themeSwitch = document.getElementById("theme-switch");
document.body.classList.add("dark-mode"); // Set dark mode as default
themeSwitch.checked = false; // Ensure checkbox is unchecked by default
themeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode");
});

// Configuration Sending
document
  .getElementById("send-config")
  .addEventListener("click", sendConfiguration);

async function sendConfiguration() {
  console.log("Attempting to send configuration...");

  if ("serial" in navigator) {
    console.log("Web Serial API is supported in this browser.");
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });

      const encoder = new TextEncoder();
      const writer = port.writable.getWriter();

      const cc1 = document.getElementById("cc-1").value;
      const cc2 = document.getElementById("cc-2").value;
      const cc3 = document.getElementById("cc-3").value;

      const config = {
        cc: [parseInt(cc1), parseInt(cc2), parseInt(cc3)],
      };

      const data = JSON.stringify(config);
      console.log("Sending configuration:", data);

      await writer.write(encoder.encode(data));

      writer.releaseLock();
      await port.close();

      console.log("Configuration successfully sent!");
      alert("Configuration successfully sent to X.U.L!");
    } catch (error) {
      console.error("Error in sending configuration:", error);
      alert(
        "Failed to connect to X.U.L - Make sure it's connected and try again. If the problem persists, try using a different USB port or cable."
      );
    }
  } else {
    console.log("Web Serial API is not supported in this browser.");
    alert(
      "Web Serial API is not supported in this browser. Please use a desktop version of Chrome or other compatible browser to configure X.U.L."
    );
  }
}

// Check for WebSerialAPI support

document.addEventListener("DOMContentLoaded", (event) => {
  if ("serial" in navigator) {
    console.log("Web Serial API IS supported in this browser.");
    document.getElementById("send-config").style.display = "block";
  } else {
    console.log("Web Serial API is NOT supported in this browser.");
    const warningElement = document.createElement("p");
    warningElement.textContent =
      "Web Serial API is not supported in this browser. Please use a desktop version of Chrome, Edge, or Opera to configure your MIDI controller.";
    warningElement.style.color = "red";
    warningElement.style.fontWeight = "bold";
    warningElement.style.textAlign = "center";
    warningElement.style.width = "100%";
    warningElement.style.padding = "10px 0";
    document.querySelector(".button-container").appendChild(warningElement);
    document.getElementById("send-config").style.display = "none";
  }
  // Initialize fader positions based on input values
  updateFaderPosition("cc-1");
  updateFaderPosition("cc-2");
  updateFaderPosition("cc-3");
});

function updateFaderPosition(inputId) {
  const input = document.getElementById(inputId);
  const faderKnob = document.getElementById(
    `fader-knob-${inputId.split("-")[1]}`
  );
  const faderRect = faderKnob.parentElement.getBoundingClientRect();
  const num = parseInt(input.value);
  const newY = (1 - num / 127) * faderRect.height;
  faderKnob.style.top = `${newY}px`;
}

// Make faders movable
function makeFaderMovable(faderId, inputId) {
  const faderKnob = document.getElementById(faderId);
  const input = document.getElementById(inputId);
  let isDragging = false;

  faderKnob.addEventListener("mousedown", (e) => {
    isDragging = true;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  function onMouseMove(e) {
    if (!isDragging) return;
    const faderRect = faderKnob.parentElement.getBoundingClientRect();
    let newY = e.clientY - faderRect.top;
    newY = Math.max(0, Math.min(newY, faderRect.height));
    faderKnob.style.top = `${newY}px`;
    const value = Math.round((1 - newY / faderRect.height) * 127);
    input.value = value;
  }

  function onMouseUp() {
    isDragging = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }
}

setupInputLimits("cc-1", 0, 127);
setupInputLimits("cc-2", 0, 127);
setupInputLimits("cc-3", 0, 127);

makeFaderMovable("fader-knob-1", "cc-1");
makeFaderMovable("fader-knob-2", "cc-2");
makeFaderMovable("fader-knob-3", "cc-3");
