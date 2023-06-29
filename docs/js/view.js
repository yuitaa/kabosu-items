function enchant(data) {
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
  });

  let tbody = document.getElementById("tbody-enchant");

  for (let i in enchants) {
    let tr = document.createElement("tr");

    let th = document.createElement("th");

    let a = document.createElement("a");

    let wiki_enchant_page = "https://minecraft.fandom.com/ja/wiki/" + i;

    if (ENCHANTS_AMBIGUOUS.includes(i)) {
      wiki_enchant_page += "_(エンチャント)";
    }

    a.setAttribute("href", wiki_enchant_page);
    a.textContent = i;

    th.appendChild(a);

    let td = document.createElement("td");
    td.textContent = enchants[i];

    tr.insertAdjacentElement("beforeend", th);
    tr.insertAdjacentElement("beforeend", td);
    tbody.insertAdjacentElement("beforeend", tr);

    document.getElementById("table-enchant").removeAttribute("style");
  }
}

function attribute(data) {
  console.log(data);
  let attributes = {};
  data.forEach((i) => {
    attribute_id = i["Name"].replace("minecraft:", "");
    if (!ATTRIBUTE_NAMES[attribute_id]) {
      return;
    }
    let slot = ATTRIBUTE_SLOT[i["Slot"]] || "";
    attributes[ATTRIBUTE_NAMES[attribute_id]] = [i["Amount"], slot];
  });

  let tbody = document.getElementById("tbody-attribute");

  for (let i in attributes) {
    let tr = document.createElement("tr");

    let th = document.createElement("th");
    th.textContent = i + attributes[i][1];

    let td = document.createElement("td");
    td.textContent = attributes[i][0];

    tr.insertAdjacentElement("beforeend", th);
    tr.insertAdjacentElement("beforeend", td);
    tbody.insertAdjacentElement("beforeend", tr);

    document.getElementById("table-attribute").removeAttribute("style");
  }
}

function potion(data) {
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
  });
  console.log(effects);

  let tbody = document.getElementById("tbody-potion");

  for (let i in effects) {
    let tr = document.createElement("tr");

    let th = document.createElement("th");

    let a = document.createElement("a");

    let wiki_effect_page = "https://minecraft.fandom.com/ja/wiki/" + i;

    if (EFFECTS_AMBIGUOUS.includes(i)) {
      wiki_effect_page += "_(ステータス効果)";
    }

    a.setAttribute("href", wiki_effect_page);
    a.textContent = i;

    th.appendChild(a);

    let tdLevel = document.createElement("td");
    tdLevel.textContent = effects[i][0];

    let tdDuration = document.createElement("td");
    tdDuration.textContent = effects[i][1];

    tr.insertAdjacentElement("beforeend", th);
    tr.insertAdjacentElement("beforeend", tdLevel);
    tr.insertAdjacentElement("beforeend", tdDuration);
    tbody.insertAdjacentElement("beforeend", tr);

    document.getElementById("table-potion").removeAttribute("style");
  }
}

function hideLoadingIcon() {
  loading = document.getElementById("loading");
  let hideStyle = document.createAttribute("style");
  hideStyle.value = "display: none";
  loading.setAttributeNode(hideStyle);
}

function updateTooltipArea(input) {
  const outputArea = document.getElementById("output-area");

  let itemLore = [];
  input["display"]["Lore"].forEach((i) => {
    lore = convertRawJson(JSON.parse(i));
    itemLore.push(lore);
  });

  let itemName = JSON.parse(input["display"]["Name"]);
  itemName = convertRawJson(itemName);

  let classes = document.createAttribute("class");
  classes.value = "item-name";

  itemName.setAttributeNode(classes);

  outputArea.textContent = "";
  outputArea.insertAdjacentElement("afterbegin", itemName);
  itemLore.forEach((i) => {
    outputArea.insertAdjacentElement("beforeend", document.createElement("br"));
    outputArea.insertAdjacentElement("beforeend", i);
  });
}

function convertRawJson(rawJson) {
  const COLORS = {
    black: "#000000",
    dark_blue: "#0000aa",
    dark_green: "#00aa00",
    dark_aqua: "#00aaaa",
    dark_red: "#aa0000",
    dark_purple: "#aa00aa",
    gold: "#ffaa00",
    gray: "#aaaaaa",
    dark_gray: "#555555",
    blue: "#5555ff",
    green: "#55ff55",
    aqua: "#55ffff",
    red: "#ff5555",
    light_purple: "#ff55ff",
    yellow: "#ffff55",
    white: "#ffffff",
  };

  if (Array.isArray(rawJson)) {
    let out = document.createElement("span");
    if (rawJson.length) {
      out.appendChild(convertRawJson(rawJson[0]));
    }
    rawJson.shift();
    rawJson.forEach((i) => {
      out.appendChild(convertRawJson(i));
    });
    return out;
  } else if (typeof rawJson == "object") {
    let out = document.createElement("span");

    text = document.createTextNode(
      rawJson["text"] || rawJson["translate"] || ""
    );
    out.appendChild(text);

    style = document.createAttribute("style");
    if (rawJson["color"]) {
      if (COLORS[rawJson["color"]]) {
        style.value = `color: ${COLORS[rawJson["color"]]};`;
        out.setAttributeNode(style);
      } else if (rawJson["color"].match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)) {
        // カラーコードにマッチ
        style.value = `color: ${rawJson["color"]};`;
        out.setAttributeNode(style);
      }
    }

    if (rawJson["strikethrough"]) {
      out.setAttribute("class", "text-decoration-line-through");
    }

    if (rawJson["extra"]) {
      out.appendChild(convertRawJson(rawJson["extra"]));
    }
    return out;
  } else {
    let out = document.createElement("span");
    out.appendChild(document.createTextNode(rawJson));
    return out;
  }
}

window.addEventListener("load", () => {
  fetchDataWithCache(DATABASE_URL).then((itemData) => {
    data = itemData[location.hash.slice(1)];
    console.log(data);

    if (!data) {
      updateTooltipArea(NOT_FOUND_FALLBACK);
      hideLoadingIcon();
      return;
    }

    updateTooltipArea(data["nbt"]);

    hideLoadingIcon();

    document.getElementById("minecraft-id").textContent =
      "minecraft:" + data["minecraft_id"];

    if (data["nbt"]["Unbreakable"]) {
      document.getElementById("unbreakable").textContent = "あり";
    } else {
      document.getElementById("unbreakable").textContent = "なし";
    }

    document.getElementById("raw-nbt").textContent = JSON.stringify(
      data["nbt"],
      null,
      4
    );
    document.getElementById("give-command").textContent =
      "/give @p minecraft:" +
      data["minecraft_id"] +
      JSON.stringify(data["nbt"]) +
      " 1";

    document
      .getElementById("give-copy-button")
      .addEventListener("click", () => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(
            "/give @p minecraft:" +
              data["minecraft_id"] +
              JSON.stringify(data["nbt"]) +
              " 1"
          );
        }
      });

    if (data["nbt"]["Enchantments"]) {
      enchant(data["nbt"]["Enchantments"]);
    } else if (data["nbt"]["StoredEnchantments"]) {
      enchant(data["nbt"]["StoredEnchantments"]);
    }

    if (data["nbt"]["AttributeModifiers"]) {
      attribute(data["nbt"]["AttributeModifiers"]);
    }

    if (data["nbt"]["CustomPotionEffects"]) {
      potion(data["nbt"]["CustomPotionEffects"]);
    }

    document.getElementById("table-1").removeAttribute("style");
    document.getElementById("table-2").removeAttribute("style");

    for (let i in itemData) {
      let related = itemData[i]["tags"].some((tag) => {
        return data["tags"].includes(tag);
      });

      related = related || itemData[i]["minecraft_id"] == data["minecraft_id"];

      if (related) {
        let isThisItem = i == location.hash.slice(1);
        let li = document.createElement("li");
        li.setAttribute("class", "list-group-item");

        if (isThisItem) {
          li.textContent = itemData[i]["name"];
        } else {
          let a = document.createElement("a");
          a.setAttribute("href", "view.html#" + i);
          a.textContent = itemData[i]["name"];
          li.insertAdjacentElement("beforeend", a);

          document.getElementById("related-items").removeAttribute("style");
        }

        document
          .getElementById("related-items-list")
          .insertAdjacentElement("beforeend", li);
      }
    }

    document.getElementById("copy-button").addEventListener("click", () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(`${data["name"]} <${location.href}>\n`);
      }
    });

    document.title = data["name"] + " | Kabosu Items";
    hljs.highlightAll();
  });
});

window.addEventListener(
  "hashchange",
  function () {
    location.reload();
  },
  false
);
