function search() {
  let table = document.getElementById("table");

  table.childNodes.forEach((i) => {
    let word = i.getAttribute("search-word");
    let index = word
      .toLowerCase()
      .indexOf(document.getElementById("search").value.toLowerCase());

    let tr = document.getElementById(i.getAttribute("id"));

    if (index == -1) {
      let hideStyle = document.createAttribute("style");
      hideStyle.value = "display: none";

      tr.setAttributeNode(hideStyle);
    } else {
      let showStyle = document.createAttribute("style");
      showStyle.value = "display: table-row";

      tr.setAttributeNode(showStyle);
    }
  });
}

window.addEventListener("load", () => {
  fetchDataWithCache(DATABASE_URL).then((data) => {
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

      let searchWord = document.createAttribute("search-word");
      searchWord.value = data[i]["name"] + " | " + data[i]["alias"] + " | " + data[i]["minecraft_id"];

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
  document.getElementById("search").addEventListener("input", search);
});
