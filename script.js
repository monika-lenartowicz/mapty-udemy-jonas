"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

let map, mapEvent;

////NOTE CLASSES///
class App {
	#map;
	#mapEvent;

	constructor() {
		this._getPosition(); //this na current object - zamiast: app._getPosition();
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
		// console.log(map);

		L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(this.#map);

		//handling click on map
		this.#map.on("click", function (mapE) {
			this.#mapEvent = mapE;
			form.classList.remove("hidden");
			inputDistance.focus();
		});
	}

	_showForm() {}

	_toggleElevationField() {}

	_newWorkout() {}
}

const app = new App();
// app._getPosition();

//clear inputs fields
const clearInputs = () => (inputCadence.value = inputDistance.value = inputDuration.value = inputElevation.value = "");

form.addEventListener("submit", function (e) {
	e.preventDefault();
	//clear inputs
	clearInputs();

	// display marker
	console.log(mapEvent);
	const { lat, lng } = mapEvent.latlng;
	L.marker([lat, lng])
		.addTo(map)
		.bindPopup(
			L.popup({ maxWidth: 250, minWidth: 100, autoClose: false, closeOnClick: false, className: "running-popup" })
		)
		.setPopupContent("Workout")
		.openPopup();
});

inputType.addEventListener("change", function () {
	inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
	inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
});
