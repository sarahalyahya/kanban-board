//column vars
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

export const getParentById = (parentId) => {
  switch (parentId) {
    case "col__to-do":
      return todoColumnElement;
    case "col__prog":
      return progressColumnElement;
    case "col__comp":
      return completeColumnElement;
    default:
      return null;
  }
};

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

export const getCardTemplate = (cardDet) => {
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
        badgeLabel: "To-do",
        cardId: "to-do",
        badgeClassName: "badge--to-do",
      };
  }
};

export const isTargetCard = (card, status) => card.cardStatus === status;
