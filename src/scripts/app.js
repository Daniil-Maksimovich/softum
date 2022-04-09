import { fadeIn, fadeOut, generateCardItem } from './helpers.js';


// getting array of cards list

let storageCardsList = JSON.parse(window.localStorage.getItem('cardsList'));

storageCardsList = storageCardsList.map(card => ({
    ...card,
    loaded: false
}));

let cardsList = storageCardsList || [];


// history button

const openHistoryBtn = document.querySelector('._history');

const makeOpenHistoryBtnVisible = () => {
    if (!openHistoryBtn.className.includes('visible')) {
        openHistoryBtn.classList.add('visible');
    }
}


// deleted cards

let deletedCardsList = [];


// clean cards list button

const removeCardListBtn = document.querySelector('._clean');


const cardsContainer = document.querySelector('.cards__content');

// generate html markup for cards

const generateCardHtml = (card, index, cardList) => {

    if (!card.loaded) {
        setTimeout(() => {
            cardsList = cardsList.map((item, index) => {
                if (item.id === card.id) {
                    document.querySelectorAll('.cards__item')[index].classList.remove('loading');
                }
                return (item.id === card.id ? {
                    ...card,
                    loaded: true
                } : item);
            });
            // generateCardsList();
        }, 3000);
    }

    return `
        <div class="cards__item ${card.loaded ? '' : 'loading'}">
            <div class="cards__item__content">
                <div class='cards__item__trash'>
                    <a href='#' class="_deleteCard" data-id="${card.id}">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 7H6.5H18.5" stroke="#1A141F" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8.75 7V5.5C8.75 5.10218 8.90804 4.72064 9.18934 4.43934C9.47064 4.15804 9.85218 4 10.25 4H13.25C13.6478 4 14.0294 4.15804 14.3107 4.43934C14.592 4.72064 14.75 5.10218 14.75 5.5V7M17 7V17.5C17 17.8978 16.842 18.2794 16.5607 18.5607C16.2794 18.842 15.8978 19 15.5 19H8C7.60218 19 7.22064 18.842 6.93934 18.5607C6.65804 18.2794 6.5 17.8978 6.5 17.5V7H17Z" stroke="#1A141F" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10.25 10.75V15.25" stroke="#1A141F" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M13.25 10.75V15.25" stroke="#1A141F" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </a>
                </div>
                <div class="cards__item__image">
                    <img src='${card.img}'/>
                </div>

                <div class="cards__item__text">
                    <div class="cards__item__heading">
                        <h3>${card.id + ' ' + card.heading}</h3>
                    </div>
                    <div class="cards__item__info">
                        ${card.text}
                    </div>
                    <div class="cards__item__open-modal">
                        <a href="#" class="_openCardModal">$499,99</a>
                    </div>
                </div>
            </div>
            <div class="cards__item__preloader">
                <div></div>
            </div>
            <div class="modal">
                <div class="modal-wrapper">
                    <div class="modal__content">
                        <div class="modal__close"></div>
                        <div class="modal__logo"></div>
                        <div class="modal__heading">
                            <h3>Hero modal ${card.id}</h3>
                        </div>
                        <div class="modal__text">
                            <p>Do you have an idea you’d like to see one of our models perform?</p>
                            <p>Do you have a particular set of poses, theme, or fetish you want one of our models to bring to life?</p>
                            <p>Send us your ideas via the contact form and we will get back to you with details and prices on how to make your visual dreams come true.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}


// cards events

const addCardsEvents = () => {

    // remove certain card

    const removeCertainCardBtns = document.querySelectorAll('._deleteCard');

    const removeCertainCard = e => {
        e.preventDefault();

        let deletedCard;

        const newCardList = cardsList.filter(card => {
            if (+card.id !== +e.currentTarget.dataset.id) {
                return card
            } else {
                deletedCard = card;
            }
        });

        cardsList.splice(0, cardsList.length);
        deletedCardsList.push(deletedCard);
        cardsList = newCardList;

        generateCardsList();
        makeOpenHistoryBtnVisible();
    }

    removeCertainCardBtns.forEach(btn => {
        btn.addEventListener('click', removeCertainCard);
    });



    // open modal

    const cardsItems = document.querySelectorAll('.cards__item');

    const openModal = e => {
        if (e.target.className === '_openCardModal') {
            e.preventDefault();
            fadeIn(e.currentTarget.querySelector('.modal'));
        }
    }

    cardsItems.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    // close card modal

    const modalWindows = document.querySelectorAll('.modal');

    const closeModal = e => {
        if (e.target.className === 'modal__close' || e.target.parentElement.className === 'modal__close') {
            fadeOut(e.currentTarget);
        }
    }

    modalWindows.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
}


// sorting and pushing cards list into cards container

const generateCardsList = () => {
    removeCardListBtn.className = cardsList.length > 1 ? '_clean' : '_clean disabled';

    cardsContainer.innerHTML = cardsList ? cardsList.map(generateCardHtml).join('') : '';

    window.localStorage.setItem('cardsList', JSON.stringify(cardsList));

    addCardsEvents();
}

generateCardsList();


// add card to the list

const addCardItemBtn = document.querySelector('._add');

const addCardItem = e => {
    if (e) e.preventDefault();
    cardsList.push(generateCardItem(deletedCardsList.concat(cardsList)));
    generateCardsList();
}

addCardItemBtn.addEventListener('click', addCardItem);


// open history

const historyModal = document.querySelector('.history-modal');
const historyModalList = document.querySelector('.history-modal .modal__text');

const generateHistoryList = () => {
    historyModalList.innerHTML = deletedCardsList[0] ? deletedCardsList.map(deletedCard => `
        <p>${deletedCard.id} Card <a href="#" data-deleteditem="${deletedCard.id}">Востановить</a></p>
    `).join('') : '<p>Список удаленных карточек пуст</p>'
};

const openHistory = () => {

    generateHistoryList();

    if (historyModal.style.display !== 'block') {
        fadeIn(historyModal);
    }

    const returnCardItemBtns = document.querySelectorAll('.history-modal .modal__text a');

    const returnCardItem = e => {
        const cardToReturn = deletedCardsList.find(el => el.id === +e.target.dataset.deleteditem);
        const newDeletedCardsList = deletedCardsList.filter(card => card.id !== cardToReturn.id);

        deletedCardsList.splice(0, deletedCardsList.length);
        deletedCardsList = newDeletedCardsList;
        cardsList.push(cardToReturn);

        generateCardsList();
        generateHistoryList();
        openHistory();
    }

    returnCardItemBtns.forEach(btn => {
        btn.addEventListener('click', returnCardItem);
    });
}

openHistoryBtn.addEventListener('click', openHistory);


// remove last card from the list

const deleteCardItemBtn = document.querySelector('._delete');

const removeCardItem = e => {
    e.preventDefault();

    const deletedCard = cardsList.pop();
    deletedCardsList.push(deletedCard);

    generateCardsList();
    makeOpenHistoryBtnVisible();
}

deleteCardItemBtn.addEventListener('click', removeCardItem);


// remove all cards

const removeCardList = e => {
    e.preventDefault();

    const deletedCards = cardsList.splice(1, cardsList.length);

    deletedCardsList = deletedCardsList.concat(deletedCards);

    generateCardsList();
    makeOpenHistoryBtnVisible();

    if (!fillCardListBtn.className.includes('disabled')) fillCardListBtn.click();

}

removeCardListBtn.addEventListener('click', removeCardList);


// fill card list


const fillCardListBtn = document.querySelector('._fill');

const scrollHandler = (e = window) => {
    const target = e.currentTarget || e;
    while (Math.round(target.pageYOffset + target.innerHeight) >= Math.round(cardsContainer.offsetTop + cardsContainer.offsetHeight)) {
        addCardItem();
    }
}

const fillCardList = e => {
    e.preventDefault();
    const { target } = e;
    if (target.className.includes('disabled')) {
        scrollHandler();
        window.addEventListener('scroll', scrollHandler);
    } else {
        window.removeEventListener('scroll', scrollHandler);
    }

    Array.from(target.parentElement.children).forEach(btn => {
        if (target.className.includes('disabled')) {
            btn.classList.add('disabled');
        } else {
            btn.classList.remove('disabled');
        }
    });
    target.classList.toggle('disabled');
}

fillCardListBtn.addEventListener('click', fillCardList);