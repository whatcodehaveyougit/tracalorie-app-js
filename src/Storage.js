

class Storage {

  // These methods are static as we do not need to instantiate the class many times
  static getCalorieLimit(defaultLimit = 2010){
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
    localStorage.clear();
  }

}

export default Storage;