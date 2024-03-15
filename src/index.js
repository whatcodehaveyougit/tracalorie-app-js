import './css/style.css';
import './css/bootstrap.css'

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
      const item = e.target.closest(".card-body")
      if(type === 'meal'){
        this._tracker.removeMeal(id);
      } else if (type === 'workout'){
        this._tracker.removeWorkout(id);
      }
      item.remove(); // This takes item out of the dom
      this._tracker._render();
    }
  }

  _filterItems(type, e){
    console.log(e.target.value)
    const text = e.target.value.toLowerCase();
    const items = document.querySelectorAll(`#${type}-items .card`);
    items.forEach(item => {
      console.log(item)
      const itemName = item.querySelector('h4').textContent.toLowerCase();
      console.log(itemName)
      if(itemName.indexOf(text) !== -1){
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    })
  }


  _newItem(type, e){
    e.preventDefault();
    console.log(e)
    // Without binding this, the this keyword would refer to the form element (the element it is on)
    // With bind this is the App instance
    console.log(this)
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
      item = new Workout(name, -calories); // Putting a plus sign inf front of calories converts it to a number!! Wild\    this._tracker.addMeal(meal);
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

class CalorieTracker {
  constructor(){
    this._calorieLimit = Storage.getCalorieLimit(); // As this is a static method we don't need to instantiate the class
    this._totalCalories = Storage.getTotalCalories();
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();
    this._displayCaloriesTotal();
    this._displayCaloriesLimit()
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining()
    this._updateProgressBar();
    document.getElementById('limit-form').addEventListener('submit', this.setLimitFormSubmit.bind(this));
  }

  // Public methods
  reset(){
    this._calorieLimit = 2000;
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    Storage.clearAll();
    this._render();

  }

  addMeal(meal){
    this._meals.push(meal);
    const newTotalCalories = this._totalCalories + meal.calories;
    Storage.setTotalCalories(newTotalCalories);
    Storage.setMeal(meal);
    this._render(); // As this is not a "reactive" framework, we need to manually call the render method
  }

  addWorkout(workout){
    this._workouts.push(workout);
    const newTotalCalories = this._totalCalories - workout.calories;
    Storage.setTotalCalories(newTotalCalories);
    Storage.setWorkout(workout);
    this._render();
  }

  setWorkouts(workouts){
    this._workouts = workouts;
  }

  setMeals(meals){
    this._meals = meals;
    Storage.setMeals(meals);
  }

  // setTotalCalories(calories){
  //   this._totalCalories = calories;
  // }

  removeMeal(id){
    console.log(id)
    console.log(this._meals)
    const meal = this._meals.find(meal => meal.id == id);
    const res = this._meals.filter(meal => meal.id !== id);
    const totalCaloriesUpdated = this._totalCalories - meal.calories;
    Storage.setMeals(res);
    Storage.setTotalCalories(totalCaloriesUpdated);

  }

  removeWorkout(id){
    const workout = this._workouts.find(workout => workout.id == id);
    const res = this._workouts.filter(workout => workout.id !== id);
    this.setWorkouts(res);
    const totalCaloriesUpdated = this._totalCalories + workout.calories;
    Storage.setTotalCalories(totalCaloriesUpdated);
    Storage.setWorkouts(res);
  }

  // Private methods

  _displayNewMeal(meal){
    // const mealItems = this._meals.forEach(meal => {
      console.log(meal)
      console.log('display  meals')
    }

  _displayCaloriesLimit(){
    const caloriesLimit = document.querySelector('#calories-limit');
    caloriesLimit.textContent = this._calorieLimit;
  }

  _displayCaloriesTotal(){
    console.log('displaying calories total')
    const caloriesTotal = document.querySelector('#calories-total');
    caloriesTotal.textContent = this._totalCalories;
  }

  _displayCaloriesConsumed(){
    const caloriesConsumed = document.querySelector('#calories-consumed');
    console.log(this._meals)
    const consumed = this._meals.reduce((acc, meal) => acc + meal.calories, 0);
    caloriesConsumed.textContent = consumed;
  }

  _displayCaloriesBurned(){
    const caloriesBurned = document.querySelector('#calories-burned');
    const burned = this._workouts.reduce((acc, workout) => acc + workout.calories, 0);
    caloriesBurned.textContent = burned;
  }

  _displayCaloriesRemaining(){
    const caloriesRemaining = document.querySelector('#calories-remaining');
    const remaining = this._calorieLimit - this._totalCalories;
    console.log(remaining)
    caloriesRemaining.textContent = remaining;
    if(remaining < 0){
      caloriesRemaining.parentElement.classList.add('bg-danger');
    } else {
      caloriesRemaining.parentElement.classList.remove('bg-danger');
    }
  }

  _updateProgressBar(){
    const progress = document.querySelector('#calorie-progress');
    const percentage = Math.floor((this._totalCalories / this._calorieLimit) * 100);
    progress.style.width = `${percentage}%`;
    if(percentage > 100){
      progress.classList.add('bg-danger');
    }
  }

  _render(){
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._updateProgressBar()
  }

  // Needed to copy and paste this function into here.. not the best way to do it - should refactor
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

  setLimit(limit) {
    console.log('calling set limit')
    this._calorieLimit = +limit; // Again, the plus sign converts the value to a number
    Storage.setCalorieLimit(this._calorieLimit);
    this._displayCaloriesLimit();
    this._render();
    const modalEl = document.getElementById('limit-modal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }

  setLimitFormSubmit(e){
    e.preventDefault()
    console.log(e)
    const limit = document.getElementById('limit');
    console.log(limit.value);
    if(limit.value === ''){
      alert('Please enter a value');
      return;
    } else {
      this.setLimit(limit.value);
    }
  }
  loadItems(){
    console.log(this._workouts)
    this._meals.forEach(meal => this._addItemToDom('meal', meal));
    this._workouts.forEach(workout => this._addItemToDom('workout', workout));

  }
}

class Meal {
  constructor(name, calories){
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class Workout {
  constructor(name, calories){
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class Storage {

  // These methods are static as we do not need to instantiate the class many times
  static getCalorieLimit(defaultLimit = 2010){
    console.log('calling thi s')
    let calorieLimit;
    if(localStorage.getItem('calorieLimit') === null){
      calorieLimit = defaultLimit;
    } else {
      calorieLimit = JSON.parse(localStorage.getItem('calorieLimit'));
    }
    return calorieLimit;
  }

  static setCalorieLimit(limit){
    localStorage.setItem('calorieLimit', JSON.stringify(limit));
  }

  static getTotalCalories(defaultCalories = 0){
    let totalCalories;
    if(localStorage.getItem('totalCalories') === null){
      totalCalories = defaultCalories;
    } else {
      totalCalories = JSON.parse(localStorage.getItem('totalCalories'));
    }
    return totalCalories;
  }

  static setTotalCalories(calories){
    localStorage.setItem('totalCalories', calories);
  }

  static getMeals(){
    let meals;
    if(localStorage.getItem('meals') === null){
      meals = [];
    } else {
      meals = JSON.parse(localStorage.getItem('meals'));
    }
    return meals;
  }

  static setMeal(meal){
    const meals = Storage.getMeals();
    meals.push(meal);
    localStorage.setItem('meals', JSON.stringify(meals));
  }

  static setMeals(meals){
    localStorage.setItem('meals', JSON.stringify(meals));
  }

  static getWorkouts(){
    let workouts;
    if(localStorage.getItem('workouts') === null){
      workouts = [];
    } else {
      workouts = JSON.parse(localStorage.getItem('workouts'));
    }
    return workouts;
  }

  static setWorkouts(workouts){
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }

  static setWorkout(workout){
    const workouts = Storage.getWorkouts();
    workouts.push(workout);
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }

  static clearAll(){
    console.log('calling clear all')
    localStorage.clear();
  }

}

// console.log(tracker);
const app = new App();
const tracker = new CalorieTracker();

// const meal1 = new Meal('Lunch', 600);
// const meal2 = new Meal('Lunch', 6000);

// const run = new Workout('Run', 300);
// tracker.addMeal(meal1);
// tracker.addMeal(meal2)
// tracker.addWorkout(run);
