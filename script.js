// API key: 81816879fd2d3541c56bc904bce4b7e3
// example URL: https://api.themoviedb.org/3/movie/550?api_key=81816879fd2d3541c56bc904bce4b7e3

// Gameplay scripting
// namespacing
// get the data, a random movie (we can randomize the genre each question or have the user choose, but we need to obtain the genre to query for a movie id first)
  // name
  // tagline - check for null/undefined taglines
  // movie poster
  // get 3 more movies - checking that they don't match the first random movie
    // name

// display the data
  // tagline in the question display
  // correct name and 3 incorrect names in 4 buttons

// gameplay function
  // check selected radio input value against "correct" movie name
    //display correct or incorrect notification 

// init function and call


// Creating our namespace
const app = {};

app.userScore = 0;
app.questionNumber = 1;

app.apiKey = '81816879fd2d3541c56bc904bce4b7e3';
app.searchPage = 1; // Starts with the first page of the most popular movies.

// Get the latest URL configuration data from the API
app.getConfig = async () => {
    app.configUrl = new URL("https://api.themoviedb.org/3/configuration")
    app.configUrl.search = new URLSearchParams({
      api_key: app.apiKey
    })
    const configRes = await fetch(app.configUrl)
    const configData = await configRes.json();
    app.baseImageUrl = configData.images.secure_base_url
    app.posterSize = configData.images.poster_sizes[3];
}
// Retrieve the movie data
app.getMovies = async () => {
  app.movieList = []; 
  for(i=0; i < 20; i++){
    app.movieList.push({})
  }
  app.url = new URL('https://api.themoviedb.org/3/discover/movie');
  app.url.search = new URLSearchParams({
    api_key: app.apiKey,
    language: 'en-US',
    certification_country: 'usa',
    sort_by: 'vote_count.desc', //getting more well-known movies
    page: app.searchPage.toString(),
    with_original_language: 'en'
  })
  const movieResponse = await fetch(app.url);
  const movieData = await movieResponse.json();
  app.pullIDS(movieData);
}

app.pullIDS = (movieObj) => {
  const idArray = []
    while(idArray.length < 20){
      for(let i = 0; i < 20; i++){
        idArray.push(movieObj['results'][i].id);
      }
    }

    app.promiseArray = idArray.map(idNumber => {
      return indMovieCall(idNumber);
    });

    function indMovieCall(idNumber) {
      const movieUrl = new URL(`https://api.themoviedb.org/3/movie/${idNumber}`)
      movieUrl.search = new URLSearchParams({
        api_key: app.apiKey
      })
      return fetch(movieUrl)
      .then(res => res.json()); //promise per id
    };

    Promise.all(app.promiseArray).then(eachMovie => {
      return app.changeTheData(eachMovie);
    })
}

app.changeTheData = (movie) => {
  for(let i = 0; i < 20; i++){ 
    if(movie[i].tagline){
      const { title, tagline, poster_path } = movie[i];
      app.movieList[i].name = title;
      app.movieList[i].tagline = tagline;
      app.movieList[i].posterPath = poster_path;
    }
  }
  app.removeFalsies(app.movieList);
}

//removing any falsy values
app.removeFalsies = (movieList) => {
  movieList.forEach(movie => {
    if(!movie.name){
      const indexToSplice = movieList.indexOf(movie);
      movieList.splice(indexToSplice, 1);
    }else if(!movie.tagline){
      const indexToSplice = movieList.indexOf(movie);
      movieList.splice(indexToSplice, 1);
    }else if(!movie.posterPath){
      const indexToSplice = movieList.indexOf(movie);
      movieList.splice(indexToSplice, 1);
    }
  });
  app.selectRandomMovies(movieList);
}

// Choose 4 random movies from the movieList array
app.selectRandomMovies = (listOfMovies) => {
  // Choose a random movie from the list of 20 movies
  // Making sure it is not the same index twice
  app.multipleChoiceArray = [];
  const indexArray = [];
  while(indexArray.length < 4){
    const index = Math.floor(Math.random() * listOfMovies.length);
      if(!indexArray.includes(index)){
      indexArray.push(index);
      }
  }
  //We now have 4 index numbers in an array
  for(i = 0; i < indexArray.length; i++) { 
    const indexValue = indexArray[i]; //take the value at each index of indexArray
    app.multipleChoiceArray.push(listOfMovies[indexValue]); //go to our list of 20 movies at that random index value and push into the multipleChoiceArray, taking 4 from the 20.
  }
  app.displayMovieInfo(app.multipleChoiceArray);
}

app.displayMovieInfo = (fourMoviesArray) => {
  // querying our elements to change them later
  const aOption = document.querySelector('#aOption');
  const bOption = document.querySelector('#bOption');
  const cOption = document.querySelector('#cOption');
  const dOption = document.querySelector('#dOption');
  const legendEl = document.querySelector('legend');

  // Choose a random number between 0 and 3 for index
  let randomMovieIndex = Math.floor(Math.random() * fourMoviesArray.length);

  //set the correct movie 
  const correctMovieInfo = fourMoviesArray[randomMovieIndex];
  correctMovieInfo.correctMovie = true; 

  legendEl.innerText = `"${correctMovieInfo.tagline}"`
  aOption.value = fourMoviesArray[0].name;
  aOption.labels[0].innerText = fourMoviesArray[0].name
  bOption.value = fourMoviesArray[1].name;
  bOption.labels[0].innerText = fourMoviesArray[1].name
  cOption.value = fourMoviesArray[2].name;
  cOption.labels[0].innerText = fourMoviesArray[2].name
  dOption.value = fourMoviesArray[3].name;
  dOption.labels[0].innerText = fourMoviesArray[3].name

  app.scoreQuestionNumberEl = document.querySelector('#scoreQuestionNumber');
  app.questionSubmitted = false;

}

app.submitButtonEl = document.querySelector("#submit");
app.nextButtonEl = document.querySelector("#next");
// Add an event listener to the submit button to check the user's answer.
app.submitButtonEl.addEventListener('click', (event) => {
  event.preventDefault();

  // Query the form elements
  app.formEl = document.querySelector('form');
  app.radioButtons = document.querySelectorAll('input[type="radio"]')
  app.selectedOption = app.formEl.querySelector('input[type="radio"]:checked')
  app.scoreCorrectEl = document.querySelector('#scoreCorrect')
  app.checkIconEl = document.querySelector('.fa-circle-check')
  app.xIconEl = document.querySelector('.fa-circle-xmark')
  app.posterContainer = document.querySelector('.posterReveal')
  // On submit, display the poster, add to userScore and questionNumber total, and highlight check or x icons.
  
  if(!app.questionSubmitted){
    const findCorrectMovie = () => {
      for(let i = 0; i < app.multipleChoiceArray.length; i++){
        if(app.multipleChoiceArray[i].correctMovie){
          return app.multipleChoiceArray[i];
        }
      }
    }

  const correctMovieOutput = findCorrectMovie();

    // Prevent the user from selecting another option for this question.
    for(i = 0; i < 4; i++){
        app.radioButtons[i].disabled = true;
      }
    // Change app.questionSubmitted to true
    app.questionSubmitted = true;
    // Grey out the submit button
    app.submitButtonEl.classList.toggle('grayedOut');
    app.nextButtonEl.classList.toggle('grayedOut');
    app.getPoster(correctMovieOutput.posterPath);
    if(app.selectedOption.value === correctMovieOutput.name){
      // If the user chooses the correct option. Up the user's score by 1.
      app.userScore++;
      app.scoreCorrectEl.innerText = app.userScore;

      //update the question number and score "out of" number
      app.scoreQuestionNumberEl.innerText = app.questionNumber;
      
      // Change the background of the check mark icon to green, Increase the checkmark's container size and grey out the x.
      app.checkIconEl.classList.toggle('correct');
      app.xIconEl.classList.toggle('grayedOut');
    } else {
      // If the user chooses the incorrect option: change the x icon color to red.
      app.xIconEl.classList.toggle('incorrect');
      app.checkIconEl.classList.toggle('grayedOut');
      // Change the background of the x icon to red, Increase the x mark's container size and grey out the checkmark.
    }
  }
})

app.nextButtonEl.addEventListener("click", (event) => {
  event.preventDefault();
  app.refreshGameplayPage();
  app.getConfig();
  app.getMovies();
})

app.getPoster = (posterPath, movieTitle) => {
  let posterUrl = `${app.baseImageUrl}/${app.posterSize}/${posterPath}`;
  app.posterImage = document.createElement('img');
  app.posterImage.src = posterUrl;
  app.posterImage.alt = `Movie poster for ${movieTitle}`;
  app.posterContainer.innerHTML = "";
  app.posterContainer.appendChild(app.posterImage);
}

app.refreshGameplayPage = () => {
  app.questionSubmitted = false;
  if(app.searchPage === 100){
    app.searchPage = 1;
  }else{
    app.searchPage++;
  }
  app.posterContainer.innerHTML = `<p>?</p>`
  app.questionNumber++;
  app.submitButtonEl.classList.toggle('grayedOut');
  app.nextButtonEl.classList.toggle('grayedOut');
  app.checkIconEl.classList.remove('grayedOut');
  app.checkIconEl.classList.remove('correct');
  app.xIconEl.classList.remove('grayedOut');
  app.xIconEl.classList.remove('incorrect');
  for(i = 0; i < 4; i++){
    app.radioButtons[i].disabled = false;  app.submitButtonEl = document.querySelector("#submit");
    app.nextButtonEl = document.querySelector("#next");
  }
  app.questionCountEl = document.querySelector('#questionCount');
  app.questionCountEl.innerText = app.questionNumber;
  app.scoreQuestionNumberEl.innerText = app.questionNumber;
}

app.init = () => {
  app.getConfig();
  app.getMovies();
}

app.init();