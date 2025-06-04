chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ accounts: [] });
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fillLogin") {
      chrome.scripting.executeScript({
        target: { tabId: message.tabId },
        func: fillLoginForm,
        args: [message.account]
      });
    }
  });
  
  function fillLoginForm(account) {

    const usernameField = document.getElementById("UserLogin_username");
    const passwordField = document.getElementById("UserLogin_password");
    
    if (usernameField && passwordField) {
      usernameField.value = account.username;
      passwordField.value = account.password;
    } else {
      console.error("Login form fields not found.");
    }
  }
  