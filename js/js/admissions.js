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

let ul = document.getElementById("checklist");
let saved = JSON.parse(localStorage.getItem("scholarpathChecklist")) || [];

items.forEach((text, index) => {
  let li = document.createElement("li");
  let isChecked = saved.includes(index) ? "checked" : "";
  li.innerHTML = `<input type="checkbox" ${isChecked} onchange="saveData()"> ${text}`;
  ul.appendChild(li);
});

function saveData() {
  let checks = document.querySelectorAll("#checklist input");
  let checkedList = [];
  checks.forEach((box, i) => {
    if (box.checked) checkedList.push(i);
  });
  localStorage.setItem("scholarpathChecklist", JSON.stringify(checkedList));
  
  // progress update
  document.getElementById("progress").innerText = checkedList.length + " of " + items.length + " completed";
}

// first time progress show
saveData();