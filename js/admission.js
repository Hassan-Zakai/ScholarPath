
let items = [
  "Matric Result",
  "Inter Result",
  "CNIC / B-Form",
  "Passport Photos",
  "Domicile",
  "Entry Test Result",
  "Fee Challan",
  "Application Form"
];

let ul = document.getElementById("admission-checklist");
let saved = JSON.parse(localStorage.getItem("scholarpathChecklist")) || [];

items.forEach((text, index) => {
  let li = document.createElement("li");
  let isChecked = saved.includes(index) ? "checked" : "";
  li.innerHTML = `<input type="checkbox" ${isChecked} onchange="saveData()"> ${text}`;
  ul.appendChild(li);
});

function saveData() {
  let checks = document.querySelectorAll("#admission-checklist input");
  let checkedList = [];
  checks.forEach((box, i) => {
    if (box.checked) checkedList.push(i);
  });
  localStorage.setItem("scholarpathChecklist", JSON.stringify(checkedList));
  
  // progress update
  document.getElementById("progress-label").innerText = checkedList.length + " of " + items.length + " completed";
document.getElementById("progress-fill").style.width=(checkedList.length/items.length)* 100 + "%";
}

document.getElementById("reset-checklist").addEventListener("click", function () {
  localStorage.removeItem("scholarpathChecklist");
  document.querySelectorAll("#admission-checklist input").forEach(function (box) {
    box.checked = false;
  });
  saveData();
});

saveData();