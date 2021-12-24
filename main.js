// Call libs
const fs = require('fs');
const path = require('path');
const {app, BrowserWindow, Menu, dialog } = require('electron');
const { ipcMain } = require('electron');
const xl = require('excel4node');
const MySQL_Connection = require('./lib/MySQL_Connection');
const template = require('./lib/Menu_Template');
const fn = require('./lib/Functions');


// Windows configs
function createWindow () {
  const mainWindow = new BrowserWindow({
    resizable: false,
    width: 400,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  mainWindow.loadFile('index.html');
  // mainWindow.webContents.openDevTools();
}


// Create custom menu
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// Create window when ready.
app.whenReady().then(() => {
  createWindow();
});


// Prepare filename
let filename = 'filename';

// Connect to SQL
const sql = new MySQL_Connection();


// Create output file
var outputFolder = './output/';
if (!fs.existsSync(outputFolder)) { fs.mkdirSync(outputFolder); }

// Connect to SQL
ipcMain.on('connect-to-sql-ask', (event, arg) => {

  sql.checkConnection(function(a) {
    console.log("Connection callback: ", a);
    event.reply('connect-to-sql-reply', sql.conn.state);
  });

});


// Check SQL connection
ipcMain.on('check-connection-ask', (event, arg) => {
  event.reply('connect-to-sql-reply', sql.conn.state);
});


// Write to Excel
ipcMain.on('write-to-excel-ask', (event, arg) => {

  sql.conn.query(sql.query, function (err, result) {
    if (err) throw err;

    var rows = sql.parseRows(result);
    var cols = sql.parseCols(rows);

    var wb = new xl.Workbook();
    var ws = wb.addWorksheet('Sheet1');

    for (var i = 0; i < cols.length; i++) {
      ws.cell(1, 1+i).string(cols[i]);
    }

    for (var r = 0; r < rows.length; r++) {
      for (var c = 0; c < cols.length; c++) {

        var val = rows[r][cols[c]];
        var type = typeof val;

        switch (type) {
          case 'number':
          ws.cell(2+r, 1+c).number(val);
          break;
          case 'string':

          if (fn.checkDate(val)) {
            ws.cell(2+r, 1+c).date(val).style({numberFormat: 'dd.mm.yyyy hh:mm:ss'});
          } else {
            ws.cell(2+r, 1+c).string(val);
          }

          break;
          case 'object':
          // Value is probably null.
          break;
          default:
          console.log("Error:", type, data);
        }
      }
    }

    filename = fn.generateFilename();
    wb.write(filename.fullpath);
    console.log('Excel written.');
    event.reply('write-to-excel-reply', "Veriler Excel'e yazıldı.");
  });

});


// Save Excel to target location
ipcMain.on('save-to-target-ask', (event, arg) => {
  dialog.showSaveDialog({
    title: 'Save file',
    defaultPath: filename.filename,
    buttonLabel: 'Save',
    filters: [
      {
        name: 'Excel Workbook',
        extensions: ['xlsx']
      }
    ],
    properties: []
  }).then(file => {
    console.log(file.canceled);
    if (!file.canceled) {
      var targetFile = file.filePath.toString().replace(/\\/g, '/');

      console.log("targetFile", targetFile);
      console.log("filename.filename", filename.filename);
      console.log("filename.fullpath", filename.fullpath);

      fs.copyFileSync(filename.fullpath, targetFile);
      event.reply('save-to-target-reply', "Kaydedildi.");
    } else {
      event.reply('save-to-target-reply', "İptal edildi.");
    }
  }).catch(err => {
    console.log(err);
  });
});
