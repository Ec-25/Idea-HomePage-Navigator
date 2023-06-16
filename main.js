// Function to get and display the current date
function getCurrentDate() {
    var currentDate = new Date();
    document.getElementById("current-date").innerHTML = currentDate.toLocaleDateString();
}

// Function to get and display weather and temperature using the OpenWeatherMap API
function getCurrentWeather() {
    var weatherCookie = getCookie("weatherData");

    // If a cookie with weather data already exists and has not expired, use it
    if (weatherCookie) {
        var weatherData = JSON.parse(weatherCookie);
        document.getElementById("current-weather").innerHTML = weatherData.weather + " || " + weatherData.temperature + "°C";
    } else {
        console.log("Searching Weather");
        // If there is no valid cookie, make an API request
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                var apiKey = 'API_KEY';
                var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=' + apiKey;

                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        var weatherData = {
                            weather: data.weather[0].description,
                            temperature: Math.round(data.main.temp - 273.15) // Convert from Kelvin to Celsius and round
                        };

                        // Save weather data in a cookie with a validity of 3 hours
                        var expirationDate = new Date();
                        expirationDate.setTime(expirationDate.getTime() + (3 * 60 * 60 * 1000));
                        document.cookie = "weatherData=" + JSON.stringify(weatherData) + ";expires=" + expirationDate.toUTCString() + ";path=/";

                        document.getElementById("current-weather").innerHTML = weatherData.weather + " || " + weatherData.temperature + "°C";
                    })
                    .catch(error => {
                        console.log("Error al obtener el clima:", error);
                    });
            });
        } else {
            console.log("Geolocalización no soportada por el navegador.");
        }
    }
}

// Function to get the value of a cookie
function getCookie(name) {
    var cookieName = name + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(';');

    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) == 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return null;
}

getCurrentDate();
getCurrentWeather();

// End Fist Part

// Function to set the value of a cookie
function setCookie(name, value, days) {
    var expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = name + "=" + value + ";expires=" + expirationDate.toUTCString() + ";path=/";
}

// Function to get pending tasks stored in cookies
function getTasksFromCookies() {
    var tasksCookie = getCookie("taskData");
    if (tasksCookie) {
        return JSON.parse(tasksCookie);
    }
    return {};
}

// Function to save pending tasks in cookies
function saveTasksToCookies(tasks) {
    setCookie("taskData", JSON.stringify(tasks), 365);
}

// Function to show pending tasks in the list
function displayTasks(tasks) {
    var taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    for (var taskKey in tasks) {
        if (tasks.hasOwnProperty(taskKey)) {
            var taskItem = document.createElement("li");
            taskItem.textContent = tasks[taskKey];
            taskList.appendChild(taskItem);

            // Add edit button for each task
            var editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.type = "button";
            editButton.addEventListener("click", createEditTaskHandler(taskKey));
            taskItem.appendChild(editButton);

            // Add delete button for each task
            var deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.type = "button";
            deleteButton.addEventListener("click", createDeleteTaskHandler(taskKey));
            taskItem.appendChild(deleteButton);
        }
    }
}

// Function to add a new task
function addTask(task) {
    var tasks = getTasksFromCookies();
    var taskKey = "task_" + Date.now();
    tasks[taskKey] = task;
    saveTasksToCookies(tasks);
    displayTasks(tasks);
}

// Function to edit an existing task
function editTask(taskKey, updatedTask) {
    var tasks = getTasksFromCookies();
    tasks[taskKey] = updatedTask;
    saveTasksToCookies(tasks);
    displayTasks(tasks);
}

// Function to delete a task
function deleteTask(taskKey) {
    var tasks = getTasksFromCookies();
    delete tasks[taskKey];
    saveTasksToCookies(tasks);
    displayTasks(tasks);
}

// Function to create an event handler to edit a task
function createEditTaskHandler(taskKey) {
    return function () {
        var updatedTask = prompt("Update Task:", "");
        if (updatedTask !== null) {
            editTask(taskKey, updatedTask);
        }
    };
}

// Function to create an event handler to kill a task
function createDeleteTaskHandler(taskKey) {
    return function () {
        if (confirm("Are you sure you want to delete this task?")) {
            deleteTask(taskKey);
        }
    };
}

// Event handler for form submission
var taskForm = document.getElementById("taskForm");
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var taskInput = document.getElementById("taskInput");
    var task = taskInput.value.trim();
    if (task !== "") {
        addTask(task);
        taskInput.value = "";
    }
});

// Upload to-dos and show them in the list on page load
var tasks = getTasksFromCookies();
displayTasks(tasks);

// End Second Part

// Function to get shortcuts stored in cookies
function getShortcutsFromCookies() {
    var shortcutsCookie = getCookie("shortcutData");
    if (shortcutsCookie) {
        return JSON.parse(shortcutsCookie);
    }
    return {};
}

// Function to save shortcuts in cookies
function saveShortcutsToCookies(shortcuts) {
    setCookie("shortcutData", JSON.stringify(shortcuts), 365);
}

// Function to show the shortcuts in the horizontal section
function displayShortcuts(shortcuts) {
    var shortcutList = document.getElementById("shortcutList");
    shortcutList.innerHTML = "";

    for (var shortcutKey in shortcuts) {
        if (shortcuts.hasOwnProperty(shortcutKey)) {
            var shortcut = shortcuts[shortcutKey];
            var shortcutElement = document.createElement("div");
            shortcutElement.className = "shortcut";

            var nameElement = document.createElement("span");
            nameElement.textContent = shortcut.name;
            shortcutElement.appendChild(nameElement);

            var linkElement = document.createElement("a");
            linkElement.href = shortcut.url;
            linkElement.textContent = "Go Here..";
            linkElement.target = "_blank";
            shortcutElement.appendChild(linkElement);

            var editButton = document.createElement("button");
            editButton.textContent = "Update";
            editButton.type = "button";
            editButton.className = "none";
            editButton.addEventListener("click", createEditShortcutHandler(shortcutKey));
            shortcutElement.appendChild(editButton);

            var deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.type = "button";
            deleteButton.className = "none";
            deleteButton.addEventListener("click", createDeleteShortcutHandler(shortcutKey));
            shortcutElement.appendChild(deleteButton);

            shortcutList.appendChild(shortcutElement);
        }
    }
}

// Function to add a new shortcut
function addShortcut(name, url) {
    var shortcuts = getShortcutsFromCookies();
    var shortcutKey = "shortcut_" + Date.now();
    shortcuts[shortcutKey] = { name: name, url: url };
    saveShortcutsToCookies(shortcuts);
    displayShortcuts(shortcuts);
}

// Function to edit an existing shortcut
function editShortcut(shortcutKey, updatedName, updatedUrl) {
    var shortcuts = getShortcutsFromCookies();
    shortcuts[shortcutKey] = { name: updatedName, url: updatedUrl };
    saveShortcutsToCookies(shortcuts);
    displayShortcuts(shortcuts);
}

// Function to remove a shortcut
function deleteShortcut(shortcutKey) {
    var shortcuts = getShortcutsFromCookies();
    delete shortcuts[shortcutKey];
    saveShortcutsToCookies(shortcuts);
    displayShortcuts(shortcuts);
}

// Function to create an event handler to edit a shortcut
function createEditShortcutHandler(shortcutKey) {
    return function () {
        var shortcut = getShortcutsFromCookies()[shortcutKey];
        var updatedName = prompt("Edit Shortcut Name:", shortcut.name);
        var updatedUrl = prompt("Edit Website URL:", shortcut.url);
        if (updatedName !== null && updatedUrl !== null) {
            editShortcut(shortcutKey, updatedName, updatedUrl);
        }
    };
}

// Function to create an event handler to remove a shortcut
function createDeleteShortcutHandler(shortcutKey) {
    return function () {
        if (confirm("Are you sure you want to remove this Shortcut?")) {
            deleteShortcut(shortcutKey);
        }
    };
}

// Event handler for form submission
var shortcutForm = document.getElementById("shortcutForm");
shortcutForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var nameInput = document.getElementById("nameInput");
    var urlInput = document.getElementById("urlInput");
    var name = nameInput.value.trim();
    var url = urlInput.value.trim();
    if (name !== "" && url !== "") {
        addShortcut(name, url);
        nameInput.value = "";
        urlInput.value = "";
    }
});

// Load shortcuts and show them in the section on page load
var shortcuts = getShortcutsFromCookies();
displayShortcuts(shortcuts);

// End Three part

window.addEventListener("load", function () {
    var addButton = document.querySelector(".position button");
    var shortcutForm = document.getElementById("shortcutForm");
    var shortcutList = document.getElementById("shortcutList");

    addButton.addEventListener("click", function () {
        shortcutForm.classList.toggle("show");
        addButton.textContent = (shortcutForm.classList.contains("show")) ? "-" : "+";
        toggleButtons();
    });

    function toggleButtons() {
        var buttons = shortcutList.getElementsByTagName("button");
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].classList.toggle("none");
        }
    }
});
