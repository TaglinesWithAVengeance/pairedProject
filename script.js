// API key: 81816879fd2d3541c56bc904bce4b7e3
// example URL: https://api.themoviedb.org/3/movie/550?api_key=81816879fd2d3541c56bc904bce4b7e3

// creating our namespace
const app = {};
// default values for user's score and question number
app.userScore = 0;
app.questionNumber = 1;

// query the announcement div for AT accessible responses after the user hits submit
app.ariaAnswerAnnouncement = document.querySelector('#answerAnnounce')


// query the modal elements
app.modal = document.querySelector('#modal')
app.modalButton = document.querySelector('.closeModal')
app.modalX = document.querySelector("#modalX")
app.modalHeading = document.querySelector(".modalHeading")
app.modalText = document.querySelector(".modalText");
// Start with modals closed;
app.modalOpen = false;

// receive the heading and texts as parameters for the function
app.openModal = (heading, message) => {
  // The modal is now open
  app.modalOpen = true;
  // toggle the classes that open the modal
  app.modal.classList.toggle("modalClosed");
  app.modal.classList.toggle("modalOpen");
  // Change the text of the heading and the message
  app.modalHeading.innerText = heading;
  app.modalText.innerText = message;
}
// Close the modal
app.closeModal = () => {
  // The modal is now open
  app.modalOpen = false;
  // Toggle the classes that close the modal
  app.modal.classList.toggle("modalClosed");
  app.modal.classList.toggle("modalOpen");
  // Remove the current heading and message from the modal.
  app.modalHeading.innerText = ""
  app.modalText.innerText = ""
}

// Storing API key
app.apiKey = '81816879fd2d3541c56bc904bce4b7e3';
app.searchPage = 1; // Starts with the first page of the most popular movies.

// query elements that will change during gameplay
  // form elements
  app.formEl = document.querySelector('form');
  app.legendEl = document.querySelector('legend');
  app.radioButtons = document.querySelectorAll('input[type="radio"]');
  app.aOption = document.querySelector('#aOption');
  app.bOption = document.querySelector('#bOption');
  app.cOption = document.querySelector('#cOption');
  app.dOption = document.querySelector('#dOption');
  
  // scoring and question values
  app.scoreQuestionNumberEl = document.querySelector('#scoreQuestionNumber');
  app.questionCountEl = document.querySelector('#questionCount');
  app.scoreCorrectEl = document.querySelector('#scoreCorrect');

  // gameplay buttons
  app.submitButtonEl = document.querySelector("#submit");
  app.nextButtonEl = document.querySelector("#next");

  // after submit elements
  app.posterContainer = document.querySelector('.posterReveal');
  app.checkIconEl = document.querySelector('.fa-circle-check');
  app.xIconEl = document.querySelector('.fa-circle-xmark');


// storing API key
app.apiKey = '81816879fd2d3541c56bc904bce4b7e3';
app.searchPage = 1; // start at first of 100 pages

// get the latest URL configuration data from the API
app.getConfig = async () => {
    app.configUrl = new URL("https://api.themoviedb.org/3/configuration")
    app.configUrl.search = new URLSearchParams({
      api_key: app.apiKey
    })
    const configRes = await fetch(app.configUrl);
    const configData = await configRes.json();
    app.baseImageUrl = configData.images.secure_base_url;
    app.posterSize = configData.images.poster_sizes[3];
}

// retrieve the movie data
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
    sort_by: 'vote_count.desc', // get upvoted movies for more-well known taglines
    page: app.searchPage.toString(),
    with_original_language: 'en'
  })
  const movieResponse = await fetch(app.url);
  const movieData = await movieResponse.json();
  app.pullIDS(movieData); // now we have movies, next we pull ids for detailed info
}

app.pullIDS = (movieObj) => {
  const idArray = []
    while(idArray.length < 20){
      for(let i = 0; i < 20; i++){
        idArray.push(movieObj['results'][i].id); // an array of 20 ids
      }
    }

    // setup for 20 api calls, each with different movie id
    app.promiseArray = idArray.map(idNumber => {
      return indMovieCall(idNumber); 
    });

    // the 20 calls
    function indMovieCall(idNumber) { 
      const movieUrl = new URL(`https://api.themoviedb.org/3/movie/${idNumber}`)
      movieUrl.search = new URLSearchParams({
        api_key: app.apiKey
      })
      return fetch(movieUrl)
      .then(res => res.json()); // promise per id
    };

    Promise.all(app.promiseArray).then(eachMovie => {
      return app.changeTheData(eachMovie);
    })
}

// store the name, tagline, and poster path only
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

// removing any falsy values
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

// choose 4 random movies from the movieList array of 20
app.selectRandomMovies = (listOfMovies) => {
  // make sure it is not the same index number twice
  app.multipleChoiceArray = [];
  const indexArray = [];
  while(indexArray.length < 4){
    const index = Math.floor(Math.random() * listOfMovies.length);
    if(!indexArray.includes(index)){
      indexArray.push(index);
    }
  }
  // we now have 4 index numbers in an array
  for(i = 0; i < indexArray.length; i++) { 
    const indexValue = indexArray[i]; // take the value/movie at each random index of indexArray
    app.multipleChoiceArray.push(listOfMovies[indexValue]); // pull 4 of 20 movies
  }
  app.displayMovieInfo(app.multipleChoiceArray);
}

app.displayMovieInfo = (fourMoviesArray) => {
  // choose a random number between 0 and 3 for index
  const randomMovieIndex = Math.floor(Math.random() * fourMoviesArray.length);

  // set movie at random index as "correct" movie
  const correctMovieInfo = fourMoviesArray[randomMovieIndex];
  correctMovieInfo.correctMovie = true; 

  // display the tagline and 4 movie names
  app.legendEl.innerText = `"${correctMovieInfo.tagline}"`;
  app.aOption.value = fourMoviesArray[0].name;
  app.aOption.labels[0].innerText = fourMoviesArray[0].name;
  app.bOption.value = fourMoviesArray[1].name;
  app.bOption.labels[0].innerText = fourMoviesArray[1].name;
  app.cOption.value = fourMoviesArray[2].name;
  app.cOption.labels[0].innerText = fourMoviesArray[2].name;
  app.dOption.value = fourMoviesArray[3].name;
  app.dOption.labels[0].innerText = fourMoviesArray[3].name;

  // nothing has been submitting by the user yet
  app.questionSubmitted = false;
}

// check the user's answer on submit
app.submitButtonEl.addEventListener('click', (event) => {
  event.preventDefault();
  // query the radio now selected
  app.selectedOption = app.formEl.querySelector('input[type="radio"]:checked');

  // on submit:
  if(!app.questionSubmitted){
    // find the 'correct = true' radio value
    const findCorrectMovie = () => {
      for(let i = 0; i < app.multipleChoiceArray.length; i++){
        if(app.multipleChoiceArray[i].correctMovie){
          return app.multipleChoiceArray[i];
        }
      }
    }

  const correctMovieOutput = findCorrectMovie();
  
  // check if an movie option was selected before hitting submit
  app.optionWasSelected = false;
  for(let i = 0; i < app.radioButtons.length; i++){
    if(app.radioButtons[i].checked){
      app.optionWasSelected = true;
    }
  }
  // If no option was selected, send an error with the modal function.
  if (!app.optionWasSelected){
    let heading = "Try your best guess!"
    let message = "Please select a movie option before submitting."
    return app.openModal(heading, message);
  }
    // Prevent the user from selecting another option for this question.
    for(i = 0; i < 4; i++){
        app.radioButtons[i].disabled = true;
    }

    // change submitted value to true
    app.questionSubmitted = true;

    // update the accessible announcement section that the user was correct.
    app.ariaAnswerAnnouncement.innerHTML = `<p>Correct!</p>`

    // grey out the submit button
    app.submitButtonEl.classList.toggle('grayedOut');
    app.nextButtonEl.classList.toggle('grayedOut');

    // display the poster of correct movie
    app.getPoster(correctMovieOutput.posterPath);

    // if correct: 
    if(app.selectedOption.value === correctMovieOutput.name){
      app.userScore++; // increase score
      app.scoreCorrectEl.innerText = app.userScore; // display new score

      // update the question number and score "out of" number
      app.scoreQuestionNumberEl.innerText = app.questionNumber;
      
      // alter checkmark to indicate answer was correct
      app.checkIconEl.classList.toggle('correct');
      // grey out the x-mark/incorrect icon
      app.xIconEl.classList.toggle('grayedOut');
    } else {
      // alter x-mark to indicate answer was incorrect
      app.xIconEl.classList.toggle('incorrect');
      // grey out the checkmark/correct icon
      app.checkIconEl.classList.toggle('grayedOut');
    }
  }
})

// event listener for the button that closes the modal
app.modalButton.addEventListener('click', app.closeModal)
// event listener for the x icon that closes the modal
app.modalX.addEventListener('click', app.closeModal)

// Retrieve the poster for the film that matches the tagline
// display the poster
app.getPoster = (posterPath, movieTitle) => {
  // use the info from the configuration API call and the movies API call to get the image URL.
  let posterUrl = `${app.baseImageUrl}/${app.posterSize}/${posterPath}`;
  // create a poster image element
  app.posterImage = document.createElement('img');
  // set the src and alt text for the newly created img element
  app.posterImage.src = posterUrl;
  app.posterImage.alt = `Movie poster for ${movieTitle}`;
  // clear out the "?"" from the posterContainer and add the poster image itself.
  app.posterContainer.innerHTML = "";
  app.posterContainer.appendChild(app.posterImage);
}

// on next:
app.nextButtonEl.addEventListener("click", (event) => {
  event.preventDefault();
  app.refreshGameplayPage(); // reset the page
  app.getConfig(); // recall the api config
  app.getMovies(); // recall the api movies
})

// 'refresh' the page for next question
app.refreshGameplayPage = () => {
  app.questionSubmitted = false; // reset the submitted value
  if(app.searchPage === 100){ // reset the page call if we've reached max page
    app.searchPage = 1;
  }else{
    app.searchPage++;
  }
  app.posterContainer.innerHTML = `<p>?</p>`; // reset posterReveal
  // increase question number and display it
  app.questionNumber++; 
  app.questionCountEl.innerText = app.questionNumber;
  app.scoreQuestionNumberEl.innerText = app.questionNumber;
  // reset the icons and sumbit/next buttons
  app.submitButtonEl.classList.toggle('grayedOut'); 
  app.nextButtonEl.classList.toggle('grayedOut');
  app.checkIconEl.classList.remove('grayedOut');
  app.checkIconEl.classList.remove('correct');
  app.xIconEl.classList.remove('grayedOut');
  app.xIconEl.classList.remove('incorrect');
  app.ariaAnswerAnnouncement.innerHTML = ""
  // re-enable radio buttons
  for(i = 0; i < 4; i++){
    app.radioButtons[i].disabled = false;  
    app.radioButtons[i].checked = false;
  }
}

app.init = () => {
  // get the latest URL configuration from the API
  app.getConfig();
  // get the data
  app.getMovies();
}

app.init();