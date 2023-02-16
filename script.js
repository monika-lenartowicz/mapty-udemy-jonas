"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// let map, mapEvent;

////NOTE CLASSES///
class Workout {
	date = new Date();
	id = (Date.now() + "").slice(-10);

	constructor(coords, distance, duration) {
		this.coords = coords; //[lat, lng]
		this.distance = distance; //in km
		this.duration = duration; //in min
		this.calcPace();
	}

	calcPace() {
		//min/km
		this.pace = this.duration / this.distance;
		return;
	}
}

class Running extends Workout {
	constructor(coords, distance, duration, cadence) {
		super(coords, distance, duration);
		this.cadence = cadence;
	}
}

class Cycling extends Workout {
	constructor(coords, distance, duration, elevationGain) {
		super(coords, distance, duration);
		this.elevationGain = elevationGain;
	}

	calcSpeed() {
		this.speed = this.distance / (this.duration / 60);
		return this.speed;
	}
}

// const run1 = new Running([39, -12], 5.2, 24, 178);
// const cycle = new Cycling([39, -12], 27, 95, 524);
// console.log(run1, cycle);

/////////////////////////////////////
/////  APPLICATION ARCHITECTURE  ////
const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

class App {
	#map;
	#mapEvent;

	constructor() {
		this._getPosition(); //this na current object - zamiast: app._getPosition();
		form.addEventListener("submit", this._newWorkout.bind(this));
		inputType.addEventListener("change", this._toggleElevationField);
	}

	_getPosition() {
		if (navigator.geolocation)
			navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
				alert("Could not get your position");
			});
	}

	_loadMap(position) {
		const { latitude } = position.coords;
		const { longitude } = position.coords;
		console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

		const coords = [latitude, longitude];
		console.log(this);
		this.#map = L.map("map").setView(coords, 13); //("map") =  <div id="map"></div> id z diva z html-a

		L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(this.#map);

		//handling click on map
		this.#map.on("click", this._showForm.bind(this));
	}

	_showForm(mapE) {
		this.#mapEvent = mapE;
		form.classList.remove("hidden");
		inputDistance.focus();
	}

	_toggleElevationField() {
		inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
		inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
	}

	_newWorkout(e) {
		const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp));
		const allPositive = (...inputs) => inputs.every(inp => inp > 0);

		e.preventDefault();

		//get data from the form
		const type = inputType.value;
		const distance = +inputDistance.value;
		const duration = +inputDuration.value;

		//if workout running create running object
		if (type === "running") {
			const cadence = +inputCadence.value;
			//checked if data is valid
			if (
				// (!Number.isFinite(distance) || !Number.isFinite(duration) || !Number.isFinite(cadence))
				!validInputs(distance, duration, cadence) ||
				!allPositive(distance, duration, cadence)
			)
				return alert("Inputs have to be positive numbers!"); //jeśli dystans nie jest liczbą, przerywamy natychmiast i wyświetlamy alert
		}

		//if workout cycling create cycling object
		if (type === "cycling") {
			//checked if data is valid
			const elevation = +inputElevation.value;
			if (!validInputs(distance, duration, elevation) || !allPositive(distance, duration))
				return alert("Inputs have to be positive numbers!");
		}

		//add new object to activity array

		//render workout on map as a marker
		const { lat, lng } = this.#mapEvent.latlng;
		L.marker([lat, lng])
			.addTo(this.#map)
			.bindPopup(
				L.popup({ maxWidth: 250, minWidth: 100, autoClose: false, closeOnClick: false, className: "running-popup" })
			)
			.setPopupContent("Workout")
			.openPopup();

		//render new workout on the classList

		//hide form and clear input fields
		const clearInputs = () =>
			(inputCadence.value = inputDistance.value = inputDuration.value = inputElevation.value = "");
		clearInputs();
	}
}

const app = new App();
// app._getPosition();

//clear inputs fields
