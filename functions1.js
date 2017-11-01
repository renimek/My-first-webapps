const users = firebase.database().ref().child("users");

//AddButton
function addNew() {
	const firstName = document.getElementById("firstName").value;
	const lastName = document.getElementById("lastName").value;
	const age = document.getElementById("age").value;
	const animal = document.getElementById("animal").value;
	const form = document.getElementById("form");
	var counter = 0;

	if (firstName == "" || /[^a-zA-z]/.test(firstName)) {
		document.getElementById("firstName").parentNode.className += " is-invalid";
		counter++;
	}
	if (lastName == "" || /[^a-zA-z]/.test(lastName)) {
		document.getElementById("lastName").parentNode.className += " is-invalid";
		counter++;
	}
	if (age == "" || /[^0-9]/.test(age)) {
		document.getElementById("age").parentNode.className += " is-invalid";
		counter++;
	}
	if (animal == "" || /[^a-zA-z]/.test(animal)) {
		document.getElementById("animal").parentNode.className += " is-invalid";
		counter++;
	}

	if (counter == 0) {
		firebase.database().ref('users/' + firstName + lastName + age + animal).set({
			firstname: firstName,
			lastname: lastName,
			age: age,
			animal: animal
		});
		alert('added!');
		form.reset();  //form reset
		refresh();     //refresh table
	}
}


function refresh() {
	clean();  //clean current table
	users.on('value', function (snap) {
		const obj = snap.val();
		if (obj == null) {
			document.getElementById("emptyList").style.display = "block";
			document.getElementById("cont2").style.display = "none";
		} else {
			document.getElementById("emptyList").style.display = "none";
			document.getElementById("cont2").style.display="block";
			for (const i in obj) {
				createRow(obj[i].firstname, obj[i].lastname, obj[i].age, obj[i].animal);
			}
		}
	})
}

function clean() {
	while (document.getElementById("results").lastElementChild.lastElementChild.id != "perm") {
		const k = document.getElementById("results").lastElementChild.lastElementChild.rowIndex;
		document.getElementById("results").deleteRow(k);
	}
}

function deleteWork(kappa) {
	return function () {
		users.child(kappa).remove();
		refresh();
	}
}

function allowEditing(kappa) {
	return function () {
		const arr = document.getElementsByClassName(kappa);
		for (i = 0; i < arr.length; i++) {
			arr[i].setAttribute("contenteditable", "true");
			arr[i].style.border = "dashed black";
		}
		document.getElementById(kappa + "save").style.display = "inline";
	}
}

function saveEdited(kappa) {
	return function () {
		const firstName = document.getElementById(kappa).cells.item(0).innerHTML;
		const lastName = document.getElementById(kappa).cells.item(1).innerHTML;
		const age = document.getElementById(kappa).cells.item(2).innerHTML;
		const animal = document.getElementById(kappa).cells.item(3).innerHTML;
		var cont = 0;
		if (firstName == "" || /[^a-zA-z]/.test(firstName) || lastName == "" || /[^a-zA-z]/.test(lastName) || age == "" || /[^0-9]/.test(age) || animal == "" || /[^a-zA-z]/.test(animal)) {
			alert("wrong input");
			cont++;
		}
		if (cont == 0) {
			users.child(kappa).remove();
			firebase.database().ref('users/' + firstName + lastName + age + animal).set({
				firstname: firstName,
				lastname: lastName,
				age: age,
				animal: animal
			});
			const arr = document.getElementsByClassName(kappa);
			for (i = 0; i < arr.length; i++) {
				arr[i].setAttribute("contenteditable", "false");
			}
			document.getElementById(kappa + "save").style.display = "none";
			refresh();
		}
	}
}

function createRow(firstName, lastName, age, animal) {
	const key = firstName + lastName + age + animal;
	const arr = [];
	for (i = 0; i < 4; i++) {
		arr.push(document.createElement("td"));
	}
	for (j = 0; j < 3; j++) {
		arr.push(document.createElement("input"));
	}
	for (k = 0; k < 4; k++) {
		arr[k].setAttribute("contenteditable", "false")
		arr[k].className = key;
	}
	arr[0].innerHTML = firstName;
	arr[1].innerHTML = lastName;
	arr[2].innerHTML = age;
	arr[3].innerHTML = animal;
	arr[4].value = "Delete";
	arr[4].type = "button";
	arr[4].onclick = deleteWork(key);
	arr[4].className = "deleteButton"
	arr[5].value = "edit";
	arr[5].type = "button";
	arr[5].onclick = allowEditing(key);
	arr[5].className = "editButton";
	arr[6].className = "saveButton"
	arr[6].value = "save";
	arr[6].type = "button";
	arr[6].id = key + "save";
	arr[6].style.display = "none";
	arr[6].onclick = saveEdited(key);
	const table = document.getElementById("results");
	const row = table.insertRow();
	for (h = 0; h < 7; h++) {
		row.appendChild(arr[h]);
	}
	row.id = key;
}






