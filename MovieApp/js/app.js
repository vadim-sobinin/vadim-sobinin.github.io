let apiKey = "k_h3125n64"; //This is the API key. Since I use a free tariff, there is a limit of 100 requests per day.
//Therefore, there is a spare key below if the limit of the first one is exhausted.
// apiKey = "k_sr9vbzey";
const apiUrlTop250 = "https://imdb-api.com/API/Top250Movies/"; //Link to the top 250 movies request from the API.
const apiUrlSearch = "https://imdb-api.com/API/SearchMovie/"; //Link to search movie request from the API.


getMovies(apiUrlTop250, apiKey);

async function getMovies(url, key) {//Here we send a request to the API and wait for a response,
  const resp = await fetch(url+key);//then we send the received response to a function that will create posters.
  const respData = await resp.json();
  showPosters(respData);
};

function getColorByRating(rate) {//This function evaluates the rating and colorizes it in the appropriate colors - green, orange, red.
  if (rate >= 9){
    return "Green"
  } else if (rate >= 8.5) {
    return "Orange"
  } else {
    return "Red"
  }
};

function showPosters(data) {
  const postersElement = document.querySelector(".posters");//This line of code finds in the html file where it will need to insert movie posters.

  data.items.forEach((poster) => { // This function creates a poster for each movie using an array received from the API.
    const posterElement = document.createElement("div");
    posterElement.classList.add("poster");
    //The code below creates a poster based on a template adding up-to-date information about the movie.
    posterElement.innerHTML = `
    <a href="https://www.imdb.com/title/${poster.id}/"><div class="poster"> 
        <div class="posterCoverInner">
          <img src="${poster.image}" alt="${poster.title}" class="posterCover">
          <div class="posterCoverDarkened"></div>
        </div>
        <div class="posterInfo">
          <div class="movieTitle">${poster.title}</div>
          <div class="movieYear">${poster.year}</div>
          <div class="movieRating ratingColor${getColorByRating(poster.imDbRating)}">${poster.imDbRating}</div> 
        </div> </a>
    `;
    postersElement.appendChild(posterElement); //Adding the created poster to the html code.
    
  })
}
//Since the format of the movie search information received from the API differs from the top 250 movies, I had to create a separate function that builds search results.
function showSearchResults(data) {
  const postersElement = document.querySelector(".posters");

  data.results.forEach((poster) => {
    const posterElement = document.createElement("div");
    posterElement.classList.add("poster");
    posterElement.innerHTML = `
    <a href="https://www.imdb.com/title/${poster.id}/">
      <div class="poster">
        <div class="posterCoverInner">
          <img src="${poster.image}" alt="${poster.title}" class="posterCover">
          <div class="posterCoverDarkened"></div>
        </div>
        <div class="posterInfo">
          <div class="movieTitle">${poster.title}</div>
          <div class="movieYear">${poster.description}</div> 
        </div>
      </a>
    `;
    postersElement.appendChild(posterElement);
    
  });
};

const form = document.querySelector("form"); //This line is looking for a form to further track submissions.
const search = document.querySelector(".headerSearch");//This line searches for the contents of the form that the user entered.

form.addEventListener("submit", (e) => {//The code in this line is waiting for the submit to be sent.
  e.preventDefault(); //With this line, I removed the page reload after submission, which is the default.

  const apiSearchUrl = apiUrlSearch + apiKey + "/" + search.value;//This line creates a request link to the API to search for the movie.
  if (search.value) {//If the user sent submit
    document.querySelector(".posters").innerHTML = "";//This line cleans up all previous posters.
  
    getSearch(apiSearchUrl);//This code calls a function that will send a request and wait for a response from the API.

    search.value = "";//This line cleans up search form.
  };

});


async function getSearch(url) {//This function sends a request and waits, then it sends the received response to another function that will create posters from this information.
  const response = await fetch(url);
  const responseData = await response.json();
  showSearchResults(responseData);};


let btns = document.querySelectorAll("*[data-modal-btn]");//This line searches for all buttons or links that are linked to modal windows.


for(let i = 0; i < btns.length; i++) {//This loop iterates through all the buttons found.
  btns[i].addEventListener('click', function() {//This function displays a modal window if a button or link has been clicked.
    let name = btns[i].getAttribute("data-modal-btn");
    let modal = document.querySelector(`[data-modal-window=${name}]`);
    modal.style.display = "block";
    

    let close = modal.querySelector(".closeModalWindow");//This line is looking for a cross to close the modal window.
    close.addEventListener('click', function() {//This function hides the modal window when the X was pressed to close.
      modal.style.display = "none";
    });
  });
};

window.onclick = function (e) {//This function hides the modal window when the user has clicked outside the modal window.
  if(e.target.hasAttribute("data-modal-window")) {
    let modals = document.querySelectorAll("*[data-modal-window]");
    for(let i = 0; i < modals.length; i++) {
      modals[i].style.display = "none";
    };
  };
};

