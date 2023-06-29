var itemData;

function search() {
  let table = document.getElementById("table");
  let foundItems = 0;
  const targetEnchant = document.getElementById("enchant-type").value;
  const enchantMax = new Number(document.getElementById("enchant-max").value);
  const enchantMin = new Number(document.getElementById("enchant-min").value);

  const targetAttribute = document.getElementById("attribute-type").value;
  const attributeMax = new Number(document.getElementById("attribute-max").value);
  const attributeMin = new Number(document.getElementById("attribute-min").value);

  if (!targetEnchant) {
    document.getElementById("enchant-max").value = "";
    document.getElementById("enchant-min").value = "";
  }
  if (!targetAttribute) {
    document.getElementById("attribute-max").value = "";
    document.getElementById("attribute-min").value = "";
  }

  table.childNodes.forEach((i) => {
    // 最初に隠す
    let tr = document.getElementById(i.getAttribute("id"));
    let hideStyle = document.createAttribute("style");
    hideStyle.value = "display: none";

    tr.setAttributeNode(hideStyle);

    let word = i.getAttribute("data-search-word");
    let index = word
      .toLowerCase()
      .replace(/\s/g, "")
      .indexOf(
        document.getElementById("search").value.toLowerCase().replace(/\s/g, "")
      );

    // ワード検索
    if (index == -1) {
      return;
    }

    // エンチャント検索
    let enchants = itemData[i.id]["nbt"]["Enchantments"] || [{}];
    if (enchants.length == 0) {
      enchants = [{}];
    }
    if (
      !enchants.find((enchant) => {
        if (!targetEnchant) {
          return true;
        }
        if (!enchant["id"]) {
          return false;
        }
        if (enchant["id"].replace("minecraft:", "") != targetEnchant) {
          return false;
        }
        if (enchantMax != 0 && enchant["lvl"] > enchantMax) {
          return false;
        }
        if (enchantMin != 0 && enchant["lvl"] < enchantMin) {
          return false;
        }
        return true;
      })
    ) {
      return;
    }

        // モディファイア検索
        let attributes = itemData[i.id]["nbt"]["AttributeModifiers"] || [{}];
        if (attributes.length == 0) {
          attributes = [{}];
        }
        if (
          !attributes.find((attribute) => {
            if (!targetAttribute) {
              return true;
            }
            if (!attribute["AttributeName"]) {
              return false;
            }
            if (attribute["AttributeName"].replace("minecraft:", "") != targetAttribute) {
              return false;
            }
            if (attributeMax != 0 && attribute["Amount"] > attributeMax) {
              return false;
            }
            if (attributeMin != 0 && attribute["Amount"] < attributeMin) {
              return false;
            }
            return true;
          })
        ) {
          return;
        }

    let showStyle = document.createAttribute("style");
    showStyle.value = "display: table-row";

    tr.setAttributeNode(showStyle);
    foundItems += 1;
  });
  document.getElementById("found-items-count").textContent = foundItems;

  const searchInputs = document.getElementsByClassName("search-input");
  let searchInputsData = {};

  for (let i = 0; i < searchInputs.length; i++) {
    let inputElement = searchInputs[i];
    let inputId = inputElement.id;
    let inputValue = inputElement.value;
    if (inputValue) {
      searchInputsData[inputId] = inputValue;
    }
  }

  const queryParams = new URLSearchParams(searchInputsData);

  if (`${queryParams}`) {
    const url = `${location.origin}${location.pathname}?${queryParams}`;
    history.replaceState(null, "", url);
  } else {
    const url = `${location.origin}${location.pathname}`;
    history.replaceState(null, "", url);
  }
}

window.addEventListener("load", () => {
  for (let i in ENCHANT_NAMES) {
    let selectElement = document.getElementById("enchant-type");

    let optionElement = document.createElement("option");
    optionElement.value = i;
    optionElement.textContent = ENCHANT_NAMES[i];

    selectElement.appendChild(optionElement);
  }
  for (let i in ATTRIBUTE_NAMES) {
    let selectElement = document.getElementById("attribute-type");

    let optionElement = document.createElement("option");
    optionElement.value = i;
    optionElement.textContent = ATTRIBUTE_NAMES[i];

    selectElement.appendChild(optionElement);
  }

  for (let [key, value] of new URLSearchParams(location.search)) {
    let inputElement = document.getElementById(key);
    if (
      inputElement != null &&
      inputElement.classList.contains("search-input")
    ) {
      inputElement.value = value;
    }
  }

  fetchDataWithCache(DATABASE_URL).then((data) => {
    itemData = data;
    let table = document.createElement("table");

    let classes = document.createAttribute("class");
    classes.value = "table table-hover";

    let id = document.createAttribute("id");
    id.value = "table";

    table.innerHTML =
      '<thead><tr><th scope="col">アイテム名</th><th scope="col">入手方法</th></tr></thead>';

    table.setAttributeNode(classes);

    let tbody = document.createElement("tbody");
    tbody.setAttributeNode(id);

    for (let i in data) {
      let tr = document.createElement("tr");

      let tdName = document.createElement("td");
      let tdNameLink = document.createElement("a");
      tdNameLink.textContent = data[i]["name"];

      let href = document.createAttribute("href");
      href.value = "view.html#" + i;

      tdNameLink.setAttributeNode(href);

      tdName.insertAdjacentElement("beforeend", tdNameLink);

      let tdSource = document.createElement("td");
      tdSource.textContent = data[i]["source"];

      tdNameLink.setAttributeNode(href);

      tdName.insertAdjacentElement("beforeend", tdNameLink);

      tr.insertAdjacentElement("beforeend", tdName);
      tr.insertAdjacentElement("beforeend", tdSource);

      let searchWord = document.createAttribute("data-search-word");
      searchWord.value =
        data[i]["name"] +
        " | " +
        data[i]["alias"] +
        " | " +
        data[i]["minecraft_id"];

      let trId = document.createAttribute("id");
      trId.value = i;

      tr.setAttributeNode(searchWord);
      tr.setAttributeNode(trId);

      tbody.insertAdjacentElement("beforeend", tr);
    }

    table.insertAdjacentElement("beforeend", tbody);

    loading = document.getElementById("loading");
    let hideStyle = document.createAttribute("style");
    hideStyle.value = "display: none";
    loading.setAttributeNode(hideStyle);

    document
      .getElementById("container")
      .insertAdjacentElement("beforeend", table);

    search();
  });
  let searchInputs = document.getElementsByClassName("search-input");
  for (let i = 0; i < searchInputs.length; i++) {
    searchInputs[i].addEventListener("input", search);
  }
});
