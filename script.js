"use strict";

import {
  removeDraggingClassFromColumns,
  addDraggingClassToTargetColumn,
  getCardDetails,
  getParentByStatus,
  randomIdGenerator,
  createNewCard,
} from "./utils.js";

const modal = document.querySelector(".modal");
const modalTitle = document.querySelector(".form__title");
const overlay = document.querySelector(".overlay");
const closeModalBtn = document.querySelector(".close-modal");
const openModalBtn = document.querySelector(".show-modal");

const taskName = document.getElementById("task-name");
const taskStatus = document.getElementById("task-status");
const taskDescription = document.getElementById("task-description");

const taskSubmit = document.querySelector(".form__create");
const taskCancel = document.querySelector(".form__cancel");

const todoColumnElement = document.getElementById("col__to-do");
const progressColumnElement = document.getElementById("col__prog");
const completeColumnElement = document.getElementById("col__comp");

const totalTaskElement = document.getElementById("total-task");

const columnsElement = [
  todoColumnElement,
  progressColumnElement,
  completeColumnElement,
];

let cards = [];

const cardStatus = {
  ToDo: 1,
  Progress: 2,
  Completed: 3,
};

let draggedItem = {};
let targetLocation = null;

const toggleModal = (action) => {
  if (action === "closeModal") {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  } else {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
  }
};

const resetForm = () => {
  taskName.value = "";
  taskStatus.value = cardStatus.ToDo;
  taskDescription.value = "";
};

const onCloseModalHandler = (e) => {
  e.preventDefault();
  resetForm();
  toggleModal("closeModal");
};

const onSubmitHandler = (e) => {
  console.clear();
  setCardToState();
  onCloseModalHandler(e);
};

const getNewCard = () => {
  const cardTaskName = " " + taskName.value;
  const cardTaskStatus = +taskStatus.value;
  const cardTaskDescription = taskDescription.value;
  const cardDetails = getCardDetails(cardTaskStatus);
  validateCardTitle(cardTaskName);
  return {
    id: randomIdGenerator("card"),
    cardTitle: cardTaskName,
    cardStatus: cardTaskStatus,
    cardDesc: cardTaskDescription,
    order: cards.length + 1,
    ...cardDetails,
  };
};

function validateCardTitle(cardTaskName) {
  if (!cardTaskName.trim()) {
    alert("Add a task title!");
    return;
  }
}

function setCardToState() {
  const card = getNewCard();
  const updatedCard = getUpdatedCard(card, card.cardStatus);
  cards.push(updatedCard);
  updateTotalTasks();
  appendCardToColumn(card.cardStatus, updatedCard);
}

const appendCardToColumn = (status, card) => {
  const parent = getParentByStatus(status);
  parent.appendChild(card.cardElement);
  addDragEventListeners(card);
  clickEventOnCardForEditModal(card);
};

const removeCardFromPreviousParent = (currentCard) => {
  const oldParentColumn = getParentByStatus(currentCard.cardStatus);
  oldParentColumn.removeChild(currentCard.cardElement);
};

const updateCardAfterDragging = (currentCard, newParentColumn) => {
  cards = cards.map((card) => {
    if (isSelectedCard(card, currentCard)) {
      return selectedCardHandler(card, newParentColumn);
    } else {
      return { ...card };
    }
  });
};

function selectedCardHandler(card, parent) {
  const updatedCard = getUpdatedCard(card, targetLocation);
  addDragEventListeners(updatedCard);
  clickEventOnCardForEditModal(updatedCard);
  parent.appendChild(updatedCard.cardElement);
  return updatedCard;
}

function getUpdatedCard(card, status) {
  const cardDetails = getCardDetails(status);
  const updatedCard = {
    ...card,
    ...cardDetails,
    cardStatus: status,
  };
  const newCardElement = getCardNodeElement(updatedCard);
  return { ...updatedCard, cardElement: newCardElement };
}

function getCardNodeElement(card) {
  return createNewCard(card);
}

function isSelectedCard(card, currentCard) {
  return card.id === currentCard.id;
}

const addEventListenersToParentColumns = (columnsElement) => {
  columnsElement[0].addEventListener("dragover", (e) => {
    removeDraggingClassFromColumns(columnsElement);
    addDraggingClassToTargetColumn(todoColumnElement);
    targetLocation = cardStatus.ToDo;
  });

  columnsElement[1].addEventListener("dragover", (e) => {
    removeDraggingClassFromColumns(columnsElement);
    addDraggingClassToTargetColumn(progressColumnElement);
    targetLocation = cardStatus.Progress;
  });

  columnsElement[2].addEventListener("dragover", (e) => {
    removeDraggingClassFromColumns(columnsElement);
    addDraggingClassToTargetColumn(completeColumnElement);
    targetLocation = cardStatus.Completed;
  });
};

const dragStartHandler = (card) => {
  card.cardElement.addEventListener("dragstart", () => {
    draggedItem = card;
  });
};

const dragEndHandler = (card) => {
  card.cardElement.addEventListener("dragend", () => {
    const currentCard = { ...card };
    const newParentColumn = getParentByStatus(targetLocation);

    removeCardFromPreviousParent(currentCard);
    removeDraggingClassFromColumns(columnsElement);
    updateCardAfterDragging(currentCard, newParentColumn);
    draggedItem = {};
    targetLocation = null;
    updateTotalTasks();
  });
};

const clickEventOnCardForEditModal = (card) => {
  card.cardElement.addEventListener("click", () => {
    toggleModal("openModal");
    modalTitle.innerHTML = "Edit Task";
    taskName.value = card.cardTitle;
    taskStatus.value = card.cardStatus;
    taskDescription.value = card.cardDesc;
    taskSubmit.innerHTML = "Update";
    taskSubmit.removeEventListener("click", onSubmitHandler);
    taskSubmit.addEventListener("click", (e) => {
      console.log(taskName.value, taskStatus.value, taskDescription.value);
      const parent = getParentByStatus(card.cardStatus);
      parent.removeChild(card.cardElement);
      setCardToState();

      cards = cards.filter((cardEl) => cardEl.id !== card.id);

      updateTotalTasks();
      modalEventListeners(openModalBtn, closeModalBtn, overlay);

      onCloseModalHandler(e);
    });
  });
};

function updateTotalTasks() {
  let total = 0;
  for (const card of cards)
    if (!isCompleted(card, cardStatus.Completed)) total += 1;
  totalTaskElement.innerText = total;
}

function isCompleted(card, cardStatus) {
  if (card.cardStatus === cardStatus) return true;
  return false;
}

const addDragEventListeners = (card) => {
  dragStartHandler(card);
  dragEndHandler(card);
};

const modalEventListeners = (openModal, closeModal, overlay) => {
  openModal.addEventListener("click", () => {
    toggleModal("openModal");
    modalTitle.innerHTML = "Create a New Task";
    taskSubmit.innerHTML = "Create";
  });

  closeModal.addEventListener("click", (e) => {
    onCloseModalHandler(e);
  });
  overlay.addEventListener("click", (e) => {
    onCloseModalHandler(e);
  });

  addEventListenersToParentColumns(columnsElement);
  taskSubmit.addEventListener("click", onSubmitHandler);

  taskCancel.addEventListener("click", onCloseModalHandler);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      onCloseModalHandler(e);
    }
  });
};
updateTotalTasks();
modalEventListeners(openModalBtn, closeModalBtn, overlay);
