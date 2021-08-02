const todoColumnElement = document.getElementById("col__to-do");
const progressColumnElement = document.getElementById("col__prog");
const completeColumnElement = document.getElementById("col__comp");

export const cardStatus = {
  ToDo: 1,
  Progress: 2,
  Completed: 3,
};

export const randomIdGenerator = (suffix = "item", length = 1e9) =>
  `${suffix}-${Math.floor(Math.random() * length).toString(16)}`;

export const getParentByStatus = (status) => {
  switch (status) {
    case cardStatus.ToDo:
      return todoColumnElement;
    case cardStatus.Progress:
      return progressColumnElement;
    case cardStatus.Completed:
      return completeColumnElement;
    default:
      return null;
  }
};

export const getCardTemplate = (cardDet) => createNewCard(cardDet);

export const createNewCard = (card) => {
  const divElement = document.createElement("div");
  divElement.classList.add("card", `${card.id}`);
  divElement.id = card.cardId;
  divElement.draggable = true;

  const badgeElement = document.createElement("div");
  badgeElement.classList.add("badge", `${card.badgeClassName}`);
  badgeElement.textContent = card.badgeLabel;

  const iconElement = document.createElement("i");
  iconElement.classList.add("far", "fa-check-circle", "fa-sm");

  const spanElement = document.createElement("span");
  spanElement.innerText = card.cardTitle;

  const headerElement = document.createElement("h3");
  headerElement.appendChild(iconElement);
  headerElement.appendChild(spanElement);

  const paragraphElement = document.createElement("p");
  paragraphElement.textContent = card.cardDesc;

  divElement.appendChild(badgeElement);
  divElement.appendChild(headerElement);
  divElement.appendChild(paragraphElement);

  return divElement;
};

export const removeDraggingClassFromColumns = (columns) => {
  for (const column of columns) {
    column.classList.remove("dragging");
  }
};

export const addDraggingClassToTargetColumn = (columName) => {
  columName.classList.add("dragging");
};

export const getCardDetails = (status) => {
  switch (status) {
    case cardStatus.Progress:
      return {
        badgeLabel: "In Progress",
        cardId: "in-prog",
        badgeClassName: "badge--in-prog",
      };
    case cardStatus.Completed:
      return {
        badgeLabel: "Completed",
        cardId: "completed",
        badgeClassName: "badge--comp",
      };
    default:
      return {
        badgeLabel: "To-Do",
        cardId: "to-do",
        badgeClassName: "badge--to-do",
      };
  }
};
