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

//column vars
let todoCol = document.getElementById("col__to-do");
let progCol = document.getElementById("col__prog");
let compCol = document.getElementById("col__comp");

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

/////////////////////////////////////////////////////////////

const getFieldValue = (e) => {
  e.preventDefault();
  let cardTaskName = taskName.value;
  let cardTaskStatus = taskStatus.value;
  let cardTaskDescription = taskDescription.value;
  createCard(cardTaskName, cardTaskStatus, cardTaskDescription);
  closeModal();
};

function createCard(taskName, taskStatus, taskDescription) {
  console.log(taskStatus);
  const cardDetails = getCardDetails(+taskStatus);
  console.log(cardDetails);
  let card = {
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
    console.log("Card", item);
    let cardDisplay = getCardTemplate(item);
    todoCol.insertAdjacentHTML("beforeend", cardDisplay);
  }
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
    <div class="card" id="${cardDet.cardId}" draggable="true">
    <div class="badge ${cardDet.badgeClassName}">${cardDet.badgeLabel}</div>
    <h3><i class="far fa-check-circle fa-sm"></i> ${cardDet.cardTitle}</h3>

    <p>
    ${cardDet.cardDesc}
    </p>
  </div>
  `;
  return template;
}

displayCards(cards);

taskSubmit.addEventListener("click", getFieldValue);
