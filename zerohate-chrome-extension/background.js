chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SEND_POST_DATA") {
    const payload = message.data;

    console.log("Sending payload to webhook:", payload);

    fetch("https://hook.eu2.make.com/dq9d4ac5sh8g4oth0bqow3gmc1f9sd63", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      console.log(`✅ POST completed with status: ${response.status}`);
      return response.json(); // <-- parse the JSON
    })
    .then(data => {
      sendResponse({ success: true, ...data });
    })
    .catch(error => {
      console.error("❌ POST failed:", error);
      sendResponse({ success: false });
    });

    return true; // Keeps sendResponse async
  }
});
