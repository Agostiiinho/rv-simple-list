const item = document.getElementById("item");
const groceries = document.getElementById("grocery-content");
const list = document.getElementById("list");
const submitValue = document.getElementById("input-text");
const submitButton = document.getElementById("submit-button");

let editElement;
let editFlag = false;
let editID = "";

window.addEventListener("DOMContentLoaded", setupItems);

let submitItem = () => {
  const value = submitValue.value;
  const id = new Date().getTime().toString();

  if (value && !editFlag) {
    createListItem(id, value);
    groceries.style.visibility = "visible";

    addToLocalStorage(id, value);
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    editLocalStorage(editID, value);
    setBackToDefault();
  }
};

let addToLocalStorage = (id, value) => {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
};

let removeFromLocalStorage = (id) => {
  let items = getLocalStorage();
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
};

let editLocalStorage = (id, value) => {
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
};

let getLocalStorage = () => {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
};

let setBackToDefault = () => {
  submitValue.value = "";
  editFlag = false;
  editID = "";
  submitButton.textContent = "Submit";
};

let clearList = () => {
  const items = document.querySelectorAll(".item");
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  groceries.style.visibility = "hidden";
  localStorage.removeItem("list");
  setBackToDefault();
};

let editItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  submitValue.value = editElement.innerHTML;

  editFlag = true;
  editID = element.dataset.id;
  submitButton.textContent = "Edit";
};

let deleteItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);

  if (list.children.length === 0) {
    groceries.style.visibility = "hidden";
  }
  setBackToDefault();
  removeFromLocalStorage(id);
};

function setupItems() {
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    groceries.style.visibility = "visible";
  }
}

let createListItem = (id, value) => {
  const element = document.createElement("article");
  element.classList.add("item");
  const attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `
    <p class="item-title">${value}</p> 
    <div class="button-container"> 
        <button class="edit-button">V</button> 
        <button class="delete-button">X</button> 
    </div>`;

  const deleteBtn = element.querySelector(".delete-button");
  const editBtn = element.querySelector(".edit-button");
  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);

  list.appendChild(element);
};
