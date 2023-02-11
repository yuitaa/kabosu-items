// https://script.google.com/macros/s/AKfycbwv5_oOOSN-YhI9_ZvdG4Webfd9vrOCrhoGuw7dPB90oXhLpqt3xx-Kye73a6EB1ZnrAQ/exec
function doGet(e) {

  const sheet = SpreadsheetApp.getActive().getSheetByName("Items");
  const rows = sheet.getDataRange().getValues();

  const indexes = rows.slice(1, 2)[0].slice(1)

  let output = {}

  rows.slice(2).forEach((i) => {
    let value = {}

    for (let j in i.slice(1)) {
      value[indexes[j]] = i.slice(1)[j]

      if (indexes[j] == 'nbt') {
        value['nbt'] = JSON.parse(i.slice(1)[j])
      }

      if (indexes[j] == 'tags') {
        value['tags'] = i.slice(1)[j].split(',')

        value['tags'] = value['tags'].filter((i) => {
          return Boolean(i)
        })

      }

    };

    output[i[0]] = value

  });


  const json = JSON.stringify(output);
  const type = ContentService.MimeType.JSON;

  console.log(output)

  return ContentService.createTextOutput(json).setMimeType(type);
}
