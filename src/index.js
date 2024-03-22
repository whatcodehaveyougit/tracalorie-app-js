import '@fortawesome/fontawesome-free/js/all';
import './css/style.css';
import './css/bootstrap.css';
import CalorieTracker from './Tracker'
import { Meal, Workout } from './Item'


class App {
  constructor(){
    this._tracker = new CalorieTracker();
    this._loadEventListeners();
    this._tracker.loadItems();
  }

  _loadEventListeners(){
    document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'));
    document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));
    document.getElementById('meal-items').addEventListener('click', this._removeItem.bind(this, 'meal'));
    document.getElementById('workout-items').addEventListener('click', this._removeItem.bind(this, 'workout'));
    document.getElementById('filter-meals').addEventListener('keyup', this._filterItems.bind(this, 'meal'));
    document.getElementById('filter-workouts').addEventListener('keyup', this._filterItems.bind(this, 'workout'));
    document.getElementById('reset').addEventListener('click', this._reset.bind(this));
  }

  _reset(){
    this._tracker.reset()
    document.getElementById('meal-items').innerHTML = '';
    document.getElementById('workout-items').innerHTML = '';
    document.getElementById('filter-meals').value = '';
    document.getElementById('filter-workouts').value = '';
  }

  _removeItem(type, e){
    if(e.target.classList.contains('delete') | e.target.classList.contains('fa-xmark')){
      const id = e.target.closest('.card').getAttribute('data-id');
      const item = e.target.closest(".card")
      if(type === 'meal'){
        this._tracker.removeMeal(id);
      } else if (type === 'workout'){
        console.log('removing workout')
        this._tracker.removeWorkout(id);
      }
      item.remove(); // This takes item out of the dom
      this._tracker._render();
    }
  }

  _filterItems(type, e){
    const text = e.target.value.toLowerCase();
    const items = document.querySelectorAll(`#${type}-items .card`);
    if(items.length > 0) {
      items.forEach(item => {
        const itemName = item.querySelector('h4').innerHTML.toLowerCase();
        if(itemName.indexOf(text) !== -1){
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      })
    }
  }


  _newItem(type, e){
    e.preventDefault();
    // Without binding this, the this keyword would refer to the form element (the element it is on)
    // With bind this is the App instance
    const name = document.getElementById(`${type}-name`).value;
    const calories = document.getElementById(`${type}-calories`).value;
    if (name === '' || calories === ''){
      alert('Please fill in the fields');
      return;
    }
    let item
    if(type === 'meal'){
      item = new Meal(name, +calories); // Putting a plus sign inf front of calories converts it to a number!! Wild
      this._tracker.addMeal(item);
    } else if (type === 'workout'){
      item = new Workout(name, +calories); // Putting a plus sign inf front of calories converts it to a number!! Wild\    this._tracker.addMeal(meal);
      this._tracker.addWorkout(item);
    }
    document.getElementById(`${type}-name`).value = '';
    document.getElementById(`${type}-calories`).value = '';

    this._addItemToDom(type, item);
    // Bootstrap not working
    // const collapseMeal = document.getElementById('collapse-meal');
    // const bsCollapseMeal = new bootstrap.Collapse(collapseMeal, {
    //   toggle: true
    // });
  }

  _addItemToDom(type, item){
    const element = document.createElement('div');
    element.setAttribute('data-id', item.id);
    element.classList.add('card', 'my-2');
    // item.setAttribute('data-id', `${type}-${name}`);
    element.innerHTML = `
    <div class="card-body">
      <div class="d-flex align-items-center justify-content-between">
        <h4 class="mx-1">${item.name}</h4>
        <div
          class="fs-1 bg-${type === 'meal' ? 'primary' : 'secondary'} text-white text-center rounded-2 px-2 px-sm-5"
        >
          ${item.calories}
        </div>
        <button class="delete btn btn-danger btn-sm mx-2">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>`
    document.getElementById(`${type}-items`).appendChild(element);
  }



}

const app = new App();
const tracker = new CalorieTracker();

// const meal1 = new Meal('Lunch', 600);
// const meal2 = new Meal('Lunch', 6000);

// const run = new Workout('Run', 300);
// tracker.addMeal(meal1);
// tracker.addMeal(meal2)
// tracker.addWorkout(run);
