let index = 0;
let clicked = null;
let events = [];
let cust = false;

const calendar = document.getElementById('calendar');
const eventM = document.getElementById('newEventModal');
const deleteM = document.getElementById('deleteEventModal');
const bDrop = document.getElementById('modalBackDrop');
const title = document.getElementById('eventTitleInput');
let weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const openButtons = document.querySelectorAll('[data-modal-target]');
const closeButtons = document.querySelectorAll('[data-close-button]');
const customizeModal = document.getElementById('customizeModal');

const footer = document.getElementById('footer')

let numberOfMonths = 6;
let todayYear = 100;
let todayD = 18;
let todayMonth = 3;
let lastDays = [14, 14, 14, 25, 25, 25];
let currMonth = todayMonth;
let currYear = todayYear;

let months = [];

function openModal(date) {
    clicked = date;

    const eventForDay = events.find(e => e.date === clicked);

    if (eventForDay) {
        document.getElementById('eventText').innerText = eventForDay.title;
        deleteM.style.display = 'block';
    } else {
        eventM.style.display = 'block';
    }

    bDrop.style.display = 'block';
}

function openModal1(modal1){
    if (modal1 == null) return
    modal1.classList.add('active')
    customizeModal.style.display = 'block';
    footer.classList.add('active')
    load()
}



function load() {

    if(cust === false){
        const dt = new Date();

        if (index !== 0) {
            dt.setMonth(new Date().getMonth() + index);
        }

        const day = dt.getDate();
        const month = dt.getMonth();
        const year = dt.getFullYear();

        const firstDayOfMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
            weekday: 'long',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        });
        const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

        document.getElementById('monthDisplay').innerText =
            `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year} `;

        calendar.innerHTML = '';

        for(let i = 1; i <= paddingDays + daysInMonth; i++) {
            const daySquare = document.createElement('div');
            daySquare.classList.add('day');

            const dayString = `${month + 1}/${i - paddingDays}/${year}`;

            if (i > paddingDays) {
                daySquare.innerText = i - paddingDays;
                const eventForDay = events.find(e => e.date === dayString);

                if (i - paddingDays === day && index === 0) {
                    daySquare.id = 'currentDay';
                }

                if (eventForDay) {
                    const eventDiv = document.createElement('div');
                    eventDiv.classList.add('event');
                    eventDiv.innerText = eventForDay.title;
                    daySquare.appendChild(eventDiv);
                }

                daySquare.addEventListener('click', () => openModal(dayString));
            } else {
                daySquare.classList.add('padding');
            }

            calendar.appendChild(daySquare);
        }
    } else {
      
        const day = todayD;
        let month;
        if(currMonth <=11){
            month = currMonth;
        }
        else {
            month = 11;
        }

        const firstDayOfMonth = new Date(currYear, month, 1);
        // const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInMonth = lastDays[currMonth];


        const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
            weekday: 'long',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        });

        const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

        document.getElementById('monthDisplay').innerText =
            `${months[currMonth]} ${currYear} `;

        calendar.innerHTML = '';

        for(let i = 1; i <= paddingDays + daysInMonth; i++) {
            const daySquare = document.createElement('div');
            daySquare.classList.add('day');

            const dayString = `${month + 1}/${i - paddingDays}/${todayYear}`;

            if (i > paddingDays) {
                daySquare.innerText = i - paddingDays;
                const eventForDay = events.find(e => e.date === dayString);

                if (i - paddingDays === day && currMonth === todayMonth && currYear === todayYear) {
                    daySquare.id = 'currentDay';
                }

                if (eventForDay) {
                    const eventDiv = document.createElement('div');
                    eventDiv.classList.add('event');
                    eventDiv.innerText = eventForDay.title;
                    daySquare.appendChild(eventDiv);
                }

                daySquare.addEventListener('click', () => openModal(dayString));
            } else {
                daySquare.classList.add('padding');
            }

            calendar.appendChild(daySquare);
        }
    }
}

function closeModal() {
    title.classList.remove('error');
    eventM.style.display = 'none';
    deleteM.style.display = 'none';
    bDrop.style.display = 'none';
    title.value = '';
    clicked = null;
    load();
}

function ggg() {
  cust = true;
  clicked = null;

  var input = document.getElementById('quantity2').value;
  todayD = parseInt(input);

  input = document.getElementById('quantity1').value;
  todayYear = parseInt(input);

  input = document.getElementById('quantity3').value;
  numberOfMonths = parseInt(input);

  input = document.getElementById('quantity9').value;
  todayMonth = parseInt(input) - 1;

  var texts = document.getElementById('text1').value;
  var tx = texts.toString();
  var gg = "";
  for(let i = 0; i < tx.length; i++){
      if(tx.charAt(i) === ',' || i === tx.length - 1){
          months.push(gg.toString());
          gg = "";
          i++;
      } else {
          gg += tx.charAt(i);
      }
  }

  texts = document.getElementById('text2').value;
  tx = texts.toString();
  gg = "";
  for(let i = 0; i < tx.length; i++){
      if(tx.charAt(i) === ',' || i === tx.length - 1){
          lastDays.push(parseInt(gg));
          gg = "";
          i++;
      } else {
          gg += tx.charAt(i);
      }
  }
  currMonth = todayMonth;
  currYear = todayYear;

  const cb = document.getElementById('check1').checked;
  if(cb === true){
      weekdays = [];
      texts = document.getElementById('text3').value;
      tx = texts.toString();
      gg = "";
      for(let i = 0; i < tx.length; i++){
          if(tx.charAt(i) === ',' || i === tx.length - 1){
              weekdays.push(gg.toString());
              gg = "";
              i++;
          } else {
              gg += tx.charAt(i);
          }
      }
      document.getElementById('sun').innerHTML = weekdays[0];
      document.getElementById('mon').innerHTML = weekdays[1];
      document.getElementById('tue').innerHTML = weekdays[2];
      document.getElementById('wed').innerHTML = weekdays[3];
      document.getElementById('thu').innerHTML = weekdays[4];
      document.getElementById('fri').innerHTML = weekdays[5];
      document.getElementById('sat').innerHTML = weekdays[6];


  }

  load();
}

function closeModal1(modal1){
    if (modal1 == null) return
    modal1.classList.remove('active')
    customizeModal.style.display = 'none';
    footer.classList.remove('active')
    load();
}

function saveEvent() {
    if (title.value) {
        title.classList.remove('error');

        events.push({
            date: clicked,
            title: title.value,
        });
      
        closeModal();
    } else {
        title.classList.add('error');
    }
}

function deleteEvent() {
    events = events.filter(e => e.date !== clicked);
    closeModal();
}

function initButtons() {
   
document.getElementById('closeCalButton').addEventListener('click', () => {
        openCloseWindow(1, 'calendarWindow');
    });  
  
  document.getElementById('nextButton').addEventListener('click', () => {
        if(cust === false){
            index++;
        } else {
            if(currMonth === numberOfMonths - 1){
                currMonth = 0;
                currYear += 1;
            } else {
                currMonth += 1;
            }
        }
        load();
    });

    document.getElementById('backButton').addEventListener('click', () => {
        if(cust === false){
            index--;

        } else {
            if(currMonth === 0){
                currMonth = numberOfMonths - 1;
                currYear -= 1;
            } else {
                currMonth -= 1;
            }
        }
        load();
    });

    openButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal1 = document.querySelector(button.dataset.modalTarget)
            openModal1(modal1)
        })
    })

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal1 = button.closest('.customizeModal')
            closeModal1(modal1)
        })
    })

    document.getElementById('saveButton1').addEventListener('click', saveEvent);
    document.getElementById('cancelButton').addEventListener('click', closeModal);
    document.getElementById('deleteButton').addEventListener('click', deleteEvent);
    document.getElementById('closeButton').addEventListener('click', closeModal);
    document.getElementById('fff').addEventListener('click', ggg);
}

initButtons();
load();