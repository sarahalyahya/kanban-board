"use strict";
// Modals //
//variables
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".close-modal");
const btnsOpenModal = document.querySelector(".show-modal");

//form vars
let taskName = document.getElementById("task-name");
let taskStatus = document.getElementById("task-status");
let taskDescription = document.getElementById("task-description");
const taskSubmit = document.querySelector(".form__create");
const taskCancel = document.querySelector(".form__cancel");

//column vars
let todoCol = document.getElementById("col__to-do");
let progCol = document.getElementById("col__prog");
let compCol = document.getElementById("col__comp");

//dragged item
let draggedItem = {};
let targetLocation = null;
let parentId = null;

//card array
let cards = [];

//close modal function
const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

//open modal function
const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

// Open Modal
btnsOpenModal.addEventListener("click", openModal);

//closing upon clicking on 'X' or overlay
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

//closing upon hitting ESC
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

function randomIdGenerator(suffix = "item", length = 1e9) {
  return `${suffix}-${Math.floor(Math.random() * length).toString(16)}`;
}

/////////////////////////////////////////////////////////////

const getFieldValue = (e) => {
  e.preventDefault();

  let cardTaskName = taskName.value;
  let cardTaskStatus = +taskStatus.value;
  let cardTaskDescription = taskDescription.value;

  createCard(cardTaskName, cardTaskStatus, cardTaskDescription);

  taskName.value = "";
  taskStatus.value = 1;
  taskDescription.value = "";
  closeModal();
};

function createCard(taskName, taskStatus, taskDescription) {
  const cardDetails = getCardDetails(taskStatus);
  let card = {
    id: randomIdGenerator(),
    cardTitle: taskName,
    cardStatus: taskStatus,
    cardDesc: taskDescription,
    ...cardDetails,
    order: cards.length + 1,
  };
  cards.push(card);
  displayCards(cards);
}

function getCardDetails(cardStatus) {
  switch (cardStatus) {
    case 2:
      return {
        badgeLabel: "In Progress",
        cardId: "in-prog",
        badgeClassName: "badge--in-prog",
      };
    case 3:
      return {
        badgeLabel: "Completed",
        cardId: "completed",
        badgeClassName: "badge--comp",
      };
    default:
      return {
        badgeLabel: "To-do",
        cardId: "to-do",
        badgeClassName: "badge--to-do",
      };
  }
}

function displayCards(cards) {
  for (const item of cards) {
    let cardDisplay = getCardTemplate(item);
    //check status
    if (isTodoCard(item)) {
      todoCol.insertAdjacentHTML("beforeend", cardDisplay);
    } else if (isProgressCard(item)) {
      progCol.insertAdjacentHTML("beforeend", cardDisplay);
    } else if (isCompleteCard(item)) {
      compCol.insertAdjacentHTML("beforeend", cardDisplay);
    }
  }
  addEventListenersForCards();
}

function isTodoCard(card) {
  return card.cardStatus === 1;
}

function isProgressCard(card) {
  return card.cardStatus === 2;
}

function isCompleteCard(card) {
  return card.cardStatus === 3;
}

function getCardTemplate(cardDet) {
  const template = `
    <div class="card ${cardDet.id}" id="${cardDet.cardId}" draggable="true">
    <div class="badge ${cardDet.badgeClassName}">${cardDet.badgeLabel}</div>
    <h3><i class="far fa-check-circle fa-sm"></i> ${cardDet.cardTitle}</h3>

    <p>
    ${cardDet.cardDesc}
    </p>
  </div>
  `;
  return template;
}

todoCol.addEventListener("dragover", (e) => {
  targetLocation = 1;
});

progCol.addEventListener("dragover", (e) => {
  targetLocation = 2;
});

compCol.addEventListener("dragover", (e) => {
  targetLocation = 3;
});

function getParent() {
  switch (parentId) {
    case "col__to-do":
      return todoCol;
    case "col__prog":
      return progCol;
    case "col__comp":
      return compCol;
    default:
      return null;
  }
}

function addEventListenersForCards() {
  const cardElements = document.querySelectorAll(".card");

  for (const [index, cardElement] of cardElements.entries()) {
    cardElement.addEventListener("dragstart", (e) => {
      parentId = e.path[1].id;
      draggedItem = cards[index];
    });

    cardElement.addEventListener("dragend", (e) => {
      const oldElement = document.querySelector(`.${draggedItem.id}`);
      const parent = getParent();
      if (parent) {
        parent.removeChild(oldElement);
      }

      cards = cards.map((card) => {
        if (card.id === draggedItem.id) {
          const cardDetails = getCardDetails(targetLocation);
          return {
            ...card,
            cardStatus: targetLocation,
            ...cardDetails,
          };
        } else {
          return { ...card };
        }
      });

      displayCards(cards);

      parentId = null;
      draggedItem = {};
      targetLocation = null;
    });
  }
}

taskSubmit.addEventListener("click", getFieldValue);
taskCancel.addEventListener("click", closeModal);
