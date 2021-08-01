"use strict";

//imports modules
import {
  getParentById,
  getCardTemplate,
  removeDraggingClassFromColumns,
  addDraggingClassToTargetColumn,
  getCardDetails,
  isTargetCard,
  getParentByStatus,
  randomIdGenerator,
} from "./utils.js";

//modal vars
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".close-modal");
const openModalBtn = document.querySelector(".show-modal");

//form vars
const taskName = document.getElementById("task-name");
const taskStatus = document.getElementById("task-status");
const taskDescription = document.getElementById("task-description");

const taskSubmit = document.querySelector(".form__create");
const taskCancel = document.querySelector(".form__cancel");

//column vars
const todoColumnElement = document.getElementById("col__to-do");
const progressColumnElement = document.getElementById("col__prog");
const completeColumnElement = document.getElementById("col__comp");

//an array of all  columns
const columnsElement = [
  todoColumnElement,
  progressColumnElement,
  completeColumnElement,
];

// State
let cards = [];

//an object to reference status name, not number
const cardStatus = {
  ToDo: 1,
  Progress: 2,
  Completed: 3,
};

let draggedItem = {};
let targetLocation = null;
let parentId = null;

//close modal function
const toggleModal = (action) => {
  if (action === "closeModal") {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  } else {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
  }
};

//returns form to its initial state
const resetForm = () => {
  taskName.value = "";
  taskStatus.value = cardStatus.ToDo;
  taskDescription.value = "";
};

//creates and displays a card, resets form, closes modal
const onSubmitHandler = (e) => {
  e.preventDefault();
  setCardToState();
  resetForm();
  toggleModal("closeModal");
};

//card creator. Creates card, gets its details based on status and returns a card object
const getNewCard = () => {
  const cardTaskName = taskName.value;
  const cardTaskStatus = +taskStatus.value;
  const cardTaskDescription = taskDescription.value;
  const cardDetails = getCardDetails(taskStatus);
  return {
    id: randomIdGenerator("card"),
    cardTitle: cardTaskName,
    cardStatus: cardTaskStatus,
    cardDesc: cardTaskDescription,
    order: cards.length + 1,
    ...cardDetails,
  };
};

//creates the card variable and uses the card creator, pushes it into card array and displays
function setCardToState() {
  const card = getNewCard();
  cards.push(card);
  displayCards(cards);
}

//checks parent and inserts card in HTML based on that
const getParentToInsertCard = (status, cardDisplay) => {
  const parent = getParentByStatus(status);
  parent.insertAdjacentHTML("beforeend", cardDisplay);
};

//specifies the card location (which column, where HTML should be inserted)
const setCardToTargetedColumn = (item, cardDisplay) => {
  if (isTargetCard(item, cardStatus.ToDo)) {
    getParentToInsertCard(cardStatus.ToDo, cardDisplay);
  }
  if (isTargetCard(item, cardStatus.Progress)) {
    getParentToInsertCard(cardStatus.Progress, cardDisplay);
  }
  if (isTargetCard(item, cardStatus.Completed)) {
    getParentToInsertCard(cardStatus.Completed, cardDisplay);
  }
};

//loops through every item in card array, gets its template, sets it to specific column and inserts HTML (again?)
function displayCards(cards) {
  for (const item of cards) {
    const cardDisplay = getCardTemplate(item);
    setCardToTargetedColumn(item, cardDisplay);
  }

  addEventListenersForCards();
}

//adds a drag start to all card elements, sets its id and defines the dragged card
function addEventListenersForCards() {
  const cardElements = document.querySelectorAll(".card");

  for (const [index, cardElement] of cardElements.entries()) {
    cardElement.addEventListener("dragstart", (e) => {
      parentId = e.path[1].id;
      draggedItem = cards[index];
    });

    //saves old element into its own variable, and checks the parent
    cardElement.addEventListener("dragend", (e) => {
      const oldElement = document.querySelector(`.${draggedItem.id}`);
      const parent = getParentById(parentId);

      //remove from the old parent column
      if (parent) {
        parent.removeChild(oldElement);
      }

      cards.map((card) => {
        if (card.id === draggedItem.id) {
          const cardDetails = getCardDetails(targetLocation);
          return {
            ...card,
            ...cardDetails,
            cardStatus: targetLocation,
          };
        } else {
          return { ...card };
        }
      });

      displayCards(cards);

      removeDraggingClassFromColumns(columnsElement);
      parentId = null;
      draggedItem = {};
      targetLocation = null;
    });
  }
}

// add Event listener

todoColumnElement.addEventListener("dragover", (e) => {
  removeDraggingClassFromColumns(columnsElement);
  addDraggingClassToTargetColumn(todoColumnElement);
  targetLocation = cardStatus.ToDo;
});

progressColumnElement.addEventListener("dragover", (e) => {
  removeDraggingClassFromColumns(columnsElement);
  addDraggingClassToTargetColumn(progressColumnElement);
  targetLocation = cardStatus.Progress;
});

completeColumnElement.addEventListener("dragover", (e) => {
  removeDraggingClassFromColumns(columnsElement);
  addDraggingClassToTargetColumn(completeColumnElement);
  targetLocation = cardStatus.Completed;
});

openModalBtn.addEventListener("click", () => {
  toggleModal("openModal");
});

btnCloseModal.addEventListener("click", () => {
  toggleModal("closeModal");
});
overlay.addEventListener("click", () => {
  toggleModal("closeModal");
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    toggleModal("closeModal");
  }
});

taskSubmit.addEventListener("click", onSubmitHandler);

taskCancel.addEventListener("click", () => {
  toggleModal("closeModal");
});
