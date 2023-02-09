function doGet(e) {

  const sheet = SpreadsheetApp.getActive().getSheetByName("Items");
  const rows = sheet.getDataRange().getValues();

  const indexes = rows.slice(1,2)[0].slice(1)

  let output = {}

  rows.slice(2).forEach((i)=>{
    let value = {}

    for (let j in i.slice(1)) {
      value[indexes[j]] = i.slice(1)[j]
      
      if (indexes[j] == 'nbt'){
        value['nbt'] = JSON.parse(i.slice(1)[j])
      }

    };

    output[i[0]] = value

  });


  const json = JSON.stringify(output);
  const type = ContentService.MimeType.JSON;

  console.log(json)

  return ContentService.createTextOutput(json).setMimeType(type);
}
