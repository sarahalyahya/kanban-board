//column vars
const todoColumnElement = document.getElementById("col__to-do");
const progressColumnElement = document.getElementById("col__prog");
const completeColumnElement = document.getElementById("col__comp");

//to reference status by name, not number
export const cardStatus = {
  ToDo: 1,
  Progress: 2,
  Completed: 3,
};

//random id gen.
export const randomIdGenerator = (suffix = "item", length = 1e9) =>
  `${suffix}-${Math.floor(Math.random() * length).toString(16)}`;

//getting parent column using its HTML id
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

//getting parent column by checking card status
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

//card template
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

//removes dragging styling for all cols
export const removeDraggingClassFromColumns = (columns) => {
  for (const column of columns) {
    column.classList.remove("dragging");
  }
};

//adds dragging styling to specific col (based on drag)
export const addDraggingClassToTargetColumn = (columName) => {
  columName.classList.add("dragging");
};

//card details based on status
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

//checks target location
export const isTargetCard = (card, status) => card.cardStatus === status;
