// In renderer process (web page).
const { ipcRenderer } = require('electron');

console.log("Dev Tools");

function addLog(text) {
  var ul = document.getElementById("logs");
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(text));
  ul.appendChild(li);
}

function addIsLoading() {
  var btn = document.querySelectorAll('.button');
  btn.forEach((item, i) => {
    item.classList.add("is-loading");
  });
}

function removeIsLoading() {
  var btn = document.querySelectorAll('.button');
  btn.forEach((item, i) => {
    item.classList.remove("is-loading");
  });
}

function disableSaveButton() {
  document.querySelector('#save-to-target').disabled = true;
}

function enableSaveButton() {
  document.querySelector('#save-to-target').disabled = false;
}

window.addEventListener('DOMContentLoaded', () => {

  removeIsLoading();
  disableSaveButton();

  ipcRenderer.send('connect-to-sql-ask', 'nothing');

  ipcRenderer.on('connect-to-sql-reply', (event, arg) => {
    if (arg === 'connected' || arg === 'authenticated') {
      addLog("MySQL'e bağlandı.")
    } else {
      addLog("MySQL bağlantı hatası !");
    }
  });

  ipcRenderer.on('write-to-excel-reply', (event, arg) => {
    addLog(arg);
    removeIsLoading();
    enableSaveButton();
  });

  ipcRenderer.on('save-to-target-reply', (event, arg) => {
    addLog(arg);
    removeIsLoading();
  });


  document.querySelector('#write-to-excel').addEventListener('click', function() {
    document.querySelector('#logs').innerHTML = '';
    addIsLoading();
    ipcRenderer.send('check-connection-ask', 'nothing');
    ipcRenderer.send('write-to-excel-ask', 'nothing');
  });


  document.querySelector('#save-to-target').addEventListener('click', function() {
    addIsLoading();
    ipcRenderer.send('save-to-target-ask', 'nothing');
  });

});
