//API call and append time to page

function displayTopTime() {
    var rightNow = moment().format('dddd MMMM DD YYYY [at] hh:mm a');
    $('#currentTime').text(rightNow);
    //console.log(rightNow);
  }

setInterval(displayTopTime, 1000);
displayTopTime();

// //Change background image if nighttime NOT WORKING
//     var currentHour = moment().format("HH");
//     var dayNight = document.getElementById("#weatherHead")

//     if (currentHour >= "18" && currentHour <= "09") {
//     dayNight.setAttribute("class", "night");
 //} 


$(document).ready(function () {

// openweather.org API Key
    const myAPI = "ae943f70020bf5c485600b4ddddb5e34"

    // LocalStorage cities array - for LHS
    var searchedCities = [];

    // Variable to track last searched cities
    var lastSearched = "";

    // Search button function
    $('#search-btn').on("click", function (event) {
        event.preventDefault();
        var currentCity = $('#city-search').val().trim();
        getWeather(currentCity);
        lastSearched = currentCity;
    });

    function getWeather(currentCity) {
       
    //Get weather data
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${myAPI}&units=imperial`,
            method: "GET"
        }).then( (response) => {

            //console.log(response);

            var latit = response.coord.lat;
            var longit = response.coord.lon;
    

           
            //console.log(latit, longit);

            saveToLocal()
            renderPrevious()
            renderWeather(response);
            getUV(latit, longit);
            getFive(latit, longit);
        });
    }
        //Get UV data
        function getUV(lat, lon,) {
            $.ajax({
                url: `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${myAPI}`,
                method: 'GET'
            }).then( (UVresponse) => {
                console.log(UVresponse);
               if(UVresponse.value < 4) {
                $("#weatherCurrent").append($("<p>").text("Today's UV Index: ").append($("<span class='badge badge-pill badge-success'>").text(UVresponse.value)));
            }
            else if(UVresponse.value >= 4 && UVresponse.value <= 7) {
                $("#weatherCurrent").append($("<p>").text("Today's UV Index: ").append($("<span class='badge badge-pill badge-warning'>").text(UVresponse.value)));
            }
            else {
                $("#weatherCurrent").append($("<p>").text("Today's UV Index: ").append($("<span class='badge badge-pill badge-danger'>").text(UVresponse.value)));
            }
            });
        }
            //Get 5 day data
        function getFive (lat, lon) {
            $.ajax({
                url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${myAPI}&units=imperial&exclude=current,minutely,hourly`,
                method: 'GET'
            }).then( (response) => {
                renderFive(response);
            })
            ;
            
        };    
    

        function renderWeather (response) {

            var currentWeather = $("#weatherCurrent");
            currentWeather.empty();
            var date = new Date();
            var todayDate = $("<div class='card-text'>").text(`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`)
            var title = $("<div class='card-title'>").text(`${response.name}`)
            var img = $("<img>").attr("src", `https://openweathermap.org/img/w/${response.weather[0].icon}.png`)
            var temp = $("<div class='card-text'>").text(`Temperature: ${response.main.temp} °F`);
            var humid = $("<div class='card-text'>").text(`Humidity: ${response.main.humidity}%`);
            var wind = $("<div class='card-text'>").text(`Wind Speed: ${response.wind.speed} MPH`);

            var card = $("<div class='card'>");
            var cardB = $("<div class='card-body'>");

            card.append(cardB);
            cardB.append(title, todayDate, temp, humid, wind);
            title.append(img);
            currentWeather.append(card);    

            
        }

          // Create 5 day forecast cards
        function renderFive (response) {
            $("#weatherForecast").empty();
            console.log(response);
      
        $("#weatherForecast").append($("<h3>").text("5-Day Forecast:"), $("<div class='forecast-cards'>")); 

            for (var i = 1; i <= 5; i++) {
                var d = new Date();
                console.log(d);
                d.setDate(d.getDate() + i);
                $(".forecast-cards").append($("<div class='card text-white bg-primary card-body'>").append($("<h5>").text(`${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`), 
                $("<p>").append($("<img>").attr("src", `https://openweathermap.org/img/w/${response.daily[i].weather[0].icon}.png`)),
                $("<p>").text(`Temp: ${response.daily[i].temp.day} °F`),
                $("<p>").text(`Humidity: ${response.daily[i].humidity}%`),
                $("<p>").text(`Wind Speed: ${response.daily[i].wind_speed}%`)
                ));

            }
        }

        // Saving searches to local storage
        function saveToLocal() {
            if (searchedCities.includes($("#city-search").val()) === false && $("#city-search").val().trim() != "") {
                searchedCities.push($('#city-search').val());
                localStorage.setItem("searchedCities", JSON.stringify(searchedCities));

                localStorage.setItem("lastSearhed", lastSearched);
            }
        }
        // Display previous searches as clickable list
        function renderPrevious() {
            $(".list-group").empty();
            var storedSearches = JSON.parse(localStorage.getItem("searchedCities"));
            if (storedSearches !== null) {
                searchedCities = storedSearches;
            }

            searchedCities.forEach(function (element) {
                $(".list-group").append($("<button type='button' class='list-group-item list-group-item-action'>").text(element));
                });
            }
            
            $(".list-group").on("click", ".list-group-item", function(event) {
                getWeather($(this).text());

            });

          renderPrevious();

          if(localStorage.getItem("searchedCities") !== null) {
                getWeather(localStorage.getItem("searchedCities"));
          } 
          
          var storageClear = document.getElementById("clear-storage");
          storageClear.addEventListener("click", function (event) {
            event.preventDefault();
            localStorage.clear();
            $(".list-group").empty();
            searchedCities = null;
            location.reload();
            //localStorage.setItem("searchedCities", "");
            //localStorage.setItem("storedSearced", "");
            
          });
        
    
});


