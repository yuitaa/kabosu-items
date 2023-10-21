function generateAnsi(rawJson) {
  function findIndexOfMinNumber(numbers) {
    return numbers.reduce((minIndex, currentNumber, currentIndex, array) => {
      return currentNumber < array[minIndex] ? currentIndex : minIndex;
    }, 0);
  }

  function hexToRgb(hex) {
    hex = hex.replace(/^#/, "");
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    return [r, g, b];
  }

  function getAnsiCode(hex) {
    const ansiColor = [
      { rgb: [78, 80, 88], code: 30 },
      { rgb: [220, 50, 47], code: 31 },
      { rgb: [133, 153, 0], code: 32 },
      { rgb: [181, 137, 0], code: 33 },
      { rgb: [38, 139, 210], code: 34 },
      { rgb: [211, 54, 130], code: 35 },
      { rgb: [42, 161, 152], code: 36 },
      { rgb: [255, 255, 255], code: 37 },
    ];
    let rgb = hexToRgb(hex);
    let distanceToColor = [];
    ansiColor.forEach((color) => {
      let d = 0;
      d += (color["rgb"][0] - rgb[0]) ** 2;
      d += (color["rgb"][1] - rgb[1]) ** 2;
      d += (color["rgb"][2] - rgb[2]) ** 2;
      d = Math.sqrt(d);
      distanceToColor.push(d);
    });

    let nearestColorIndex = findIndexOfMinNumber(distanceToColor);
    return ansiColor[nearestColorIndex]["code"];
  }

  const COLORS = {
    black: "#4e5058",
    dark_blue: "#2aa198",
    dark_green: "#859900",
    dark_aqua: "#2aa198",
    dark_red: "#dc322f",
    dark_purple: "#d33682",
    gold: "#b58900",
    gray: "#4e5058",
    dark_gray: "#4e5058",
    blue: "#268bd2",
    green: "#859900",
    aqua: "#268bd2",
    red: "#dc322f",
    light_purple: "#d33682",
    yellow: "#b58900",
    white: "#ffffff",
  };

  if (Array.isArray(rawJson)) {
    let out = "";
    if (rawJson.length) {
      out += generateAnsi(rawJson[0]);
    }
    rawJson.shift();
    rawJson.forEach((i) => {
      out += generateAnsi(i);
    });
    return out;
  } else if (typeof rawJson == "object") {
    let out = "";
    let text = rawJson["text"] || rawJson["translate"] || "";

    if (rawJson["color"]) {
      let color = "";
      if (COLORS[rawJson["color"]]) {
        color = COLORS[rawJson["color"]];
      } else if (rawJson["color"].match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)) {
        color = rawJson["color"];
      }
      out += `[${getAnsiCode(color)}`;
    }

    if (rawJson["bold"]) {
      if (!out) {
        out += "[";
      }
      out += ";1";
    }

    if (rawJson["underlined"]) {
      if (!out) {
        out += "[";
      }
      out += ";4";
    }

    if (rawJson["color"] || rawJson["bold"] || rawJson["underlined"]) {
      out += "m";
    }
    out += text;
    if (rawJson["extra"]) {
      out += generateAnsi(rawJson["extra"]);
    }
    return out;
  } else {
    let out = rawJson;
    return out;
  }
}

function enchantToAnsi(data) {
  if (!data) {
    return "";
  }
  let out = "";
  let enchants = {};
  data.forEach((i) => {
    if (!i["id"]) {
      return;
    }
    enchant_id = i["id"].replace("minecraft:", "");
    if (!ENCHANT_NAMES[enchant_id]) {
      return;
    }
    enchants[ENCHANT_NAMES[enchant_id]] = i["lvl"];
    out = "\nエンチャント\n";
  });
  for (let i in enchants) {
    out += ` - ${i} ${enchants[i]}\n`;
  }
  return out;
}

function attributeToAnsi(data) {
  if (!data) {
    return "";
  }
  let out = "";
  let attributes = {};
  data.forEach((i) => {
    attribute_id = i["Name"].replace("minecraft:", "");
    if (!ATTRIBUTE_NAMES[attribute_id]) {
      return;
    }
    let slot = ATTRIBUTE_SLOT[i["Slot"]] || "";
    attributes[ATTRIBUTE_NAMES[attribute_id]] = [i["Amount"], slot];
    out = "\n追加効果\n";
  });
  for (let i in attributes) {
    out += ` - ${i} ${attributes[i][0]}${attributes[i][1]}\n`;
  }
  return out;
}

function potionToAnsi(data) {
  if (!data) {
    return "";
  }
  let out = "";
  let effects = {};
  data.forEach((i) => {
    effect_id = i["Id"];
    if (!EFFECT_NAME[effect_id]) {
      return;
    }
    let duration = i["Duration"];

    duration = Math.floor(duration / 20);

    let min = Math.floor(duration / 60);
    let rem = Math.floor(duration % 60);
    rem = ("00" + rem).slice(-2);

    effects[EFFECT_NAME[effect_id]] = [i["Amplifier"], `${min}分 ${rem}秒`];
    out = "\nポーション効果\n";
  });
  for (let i in effects) {
    out += ` - ${i} ${effects[i][0]} (${effects[i][1]})\n`;
  }
  return out;
}
