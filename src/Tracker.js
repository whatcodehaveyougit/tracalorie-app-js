import Storage from './Storage'
import { Modal, Collapse } from 'bootstrap'
import '@fortawesome/fontawesome-free/js/all';
import './css/bootstrap.css';


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

  setWorkouts(workouts){
    this._workouts = workouts;
  }

  setMeals(meals){
    this._meals = meals;
    Storage.setMeals(meals);
  }


  addMeal(meal){
    this._meals.push(meal)
    const res = this._totalCalories + meal.calories
    this.setTotalCalories(res);
    Storage.setMeal(meal);
    this._render(); // As this is not a "reactive" framework, we need to manually call the render method
  }

  addWorkout(workout){
    this._workouts.push(workout)
    // this.setWorkouts(res) This does not work in vanilla JS it seems, just need to edit the state directly
    const res = this._totalCalories - workout.calories
    this.setTotalCalories(res);
    Storage.setWorkout(workout);
    this._render();
  }


  setTotalCalories(calories){
    this._totalCalories = calories;
    Storage.setTotalCalories(this._totalCalories);
  }

  removeMeal(id){
    const meal = this._meals.find(meal => meal.id == id);
    this._meals = this._meals.filter(meal => meal.id !== id);
    this._totalCalories = this._totalCalories - meal.calories;
    Storage.setTotalCalories(this._totalCalories);

  }

  removeWorkout(id){
    const workout = this._workouts.find(workout => workout.id == id);
    this._workouts = this._workouts.filter(workout => workout.id !== id);
    this._totalCalories = this._totalCalories + workout.calories;
    Storage.setTotalCalories(this._totalCalories);
  }

  // Private methods

  _displayNewMeal(meal){
    // const mealItems = this._meals.forEach(meal => {
    }

  _displayCaloriesLimit(){
    const caloriesLimit = document.querySelector('#calories-limit');
    caloriesLimit.textContent = this._calorieLimit;
  }

  _displayCaloriesTotal(){
    const caloriesTotal = document.querySelector('#calories-total');
    caloriesTotal.textContent = this._totalCalories;
  }

  _displayCaloriesConsumed(){
    const caloriesConsumed = document.querySelector('#calories-consumed');
    const consumed = this._meals.reduce((acc, meal) => acc + meal.calories, 0);
    caloriesConsumed.textContent = consumed;
  }

  _displayCaloriesBurned(){
    const caloriesBurned = document.querySelector('#calories-burned');
    console.log(this._workouts)
    const burned = this._workouts.reduce((acc, workout) => acc + workout.calories, 0);
    caloriesBurned.textContent = burned;
  }

  _displayCaloriesRemaining(){
    const caloriesRemaining = document.querySelector('#calories-remaining');
    const remaining = this._calorieLimit - this._totalCalories;
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
    const limit = document.getElementById('limit');
    if(limit.value === ''){
      alert('Please enter a value');
      return;
    } else {
      this.setLimit(limit.value);
    }
  }
  loadItems(){
    this._meals.forEach(meal => this._addItemToDom('meal', meal));
    this._workouts.forEach(workout => this._addItemToDom('workout', workout));
  }
}

export default CalorieTracker;