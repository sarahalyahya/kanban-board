  
'use strict';

//variables
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnsOpenModal = document.querySelector('.show-modal');

//close modal function
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

//open modal function
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

// Open Modal
  btnsOpenModal.addEventListener('click', openModal);


//closing upon clicking on 'X' or overlay
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

//closing upon hitting ESC
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});