// Check date
function checkDate(val) {
  var date = Date.parse(val);
  if (!isNaN(date)) {
    return true;
  } else {
    return false
  }
}

// Get timestamp date
function formatDate() {
  var dt = new Date();

  var year = dt.getFullYear();
  var month = dt.getMonth() + 1;
  var day = dt.getDate();
  var hour = dt.getHours();
  var minute = dt.getMinutes();
  var second = dt.getSeconds();

  if (month.toString().length < 2) { month = '0' + month; }
  if (day.toString().length < 2) { day = '0' + day; }
  if (hour.toString().length < 2) { hour = '0' + hour; }
  if (minute.toString().length < 2) { minute = '0' + minute; }
  if (second.toString().length < 2) { second = '0' + second; }

  return year + '-' + month + '-' + day + '_' + hour + '-' + minute + '-' + second;
}

// Generate filename
function generateFilename() {
  var timestamp = formatDate();
  var targetFolder = './output/'
  var outputFile = 'T136_' + timestamp + '.xlsx';
  var output = targetFolder + outputFile;
  return {
    filename: outputFile,
    fullpath: output
  };
}

module.exports = { checkDate, formatDate, generateFilename };
