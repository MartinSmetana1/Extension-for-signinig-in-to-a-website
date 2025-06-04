
document.addEventListener('DOMContentLoaded', () => {
  const accountsList = document.getElementById('accounts');
  const loadFromFileButton = document.getElementById('loadFromFile');
  const fileInput = document.getElementById('fileInput');

  function loadAccounts() {
    chrome.storage.sync.get('accounts', (data) => {
      let accounts = data.accounts || [];
      accounts = accounts.sort((a, b) => {
        const usernameA = getUsernameForSorting(a.username);
        const usernameB = getUsernameForSorting(b.username);
        return usernameA.localeCompare(usernameB);
      });
      accountsList.innerHTML = '';
      accounts.forEach((account, index) => {
        const li = document.createElement('li');
        li.textContent = account.username;

        const loginButton = document.createElement('button');
        loginButton.textContent = 'Login';
        loginButton.addEventListener('click', () => {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tabId = tabs[0].id;
            chrome.runtime.sendMessage({ action: 'fillLogin', account, tabId });
          });
        });

        li.appendChild(loginButton);
        accountsList.appendChild(li);
      });
    });
  }


  loadFromFileButton.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const content = e.target.result;
        const accounts = content.trim().split('\n').map(line => {
          const [username, password] = line.split(',');
          return { username, password };
        });
        chrome.storage.sync.set({ accounts }, loadAccounts);
      };
      reader.readAsText(file);
    }
  });

  function getUsernameForSorting(username) {
    const parts = username.split('.');
    return parts.length > 1 ? parts[1] : username;
  }

  loadAccounts();
});

