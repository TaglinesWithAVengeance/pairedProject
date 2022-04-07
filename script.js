// API key: 81816879fd2d3541c56bc904bce4b7e3
// example URL: https://api.themoviedb.org/3/movie/550?api_key=81816879fd2d3541c56bc904bce4b7e3

// API Read Access Token - not sure if this is needed just yet
// eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MTgxNjg3OWZkMmQzNTQxYzU2YmM5MDRiY2U0YjdlMyIsInN1YiI6IjYyNDRjYjk1Yzc0MGQ5MDA4OWYzYmU4NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Xm4RpetLzBr71Vz9jOFp5OpD29DS45Z5mIJ2rzpE1YI

// ONLY RUN ON THE GAMEPLAY PAGE
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


//genres with 10+: drama , action , adventure , comedy , horror , anime 
// sci-fi (only 5), romance (only 9), 


const app = {};
app.movieList = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]; //storing the objects for the game round

app.apiKey = '81816879fd2d3541c56bc904bce4b7e3';
app.searchPage = 1 // Starts with the page of the most popular movies.
app.url = new URL('https://api.themoviedb.org/3/discover/movie');

app.url.search = new URLSearchParams({
  api_key: app.apiKey,
  language: 'en-US',
  certification_country: 'usa',
  sort_by: 'vote_count.desc', //getting more popular searches
  page: app.searchPage.toString(), // can change this with each call to randomize further, maybe pages 1-20 or 50???
  with_original_language: 'en'
})

app.getMovies = async () => {
  const movieResponse = await fetch(app.url);
  const movieData = await movieResponse.json();

  return movieData;
}

app.calledData = app.getMovies();


app.calledData.then((movieObj) => {
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
})

app.changeTheData = (movie) => {
  for(let i = 0; i < 20; i++){ //one problem may be empty taglines causing infinite loop. Could reduce to 10 movies to choose from? 
    if(movie[i].tagline){
      const { title, tagline, poster_path } = movie[i];
      app.movieList[i].name = title;
      app.movieList[i].tagline = tagline;
      app.movieList[i].posterPath = poster_path;
    }
  }
  app.selectRandomMovies(app.movieList);
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
  const aOption = document.querySelector('#aOption')
  const bOption = document.querySelector('#bOption')
  const cOption = document.querySelector('#cOption')
  const dOption = document.querySelector('#dOption')
  // console.log(formEl); //doesn't include the legend
  const legendEl = document.querySelector('legend');
  // Choose a random number between 1 and 4 (movies)
  let randomMovieIndex = Math.floor(Math.random() * fourMoviesArray.length)
  // assign one movie to be the correct one. Not sure if we actually need this property actually...
  fourMoviesArray[randomMovieIndex].correctMovie = true;
  legendEl.innerText = `"${fourMoviesArray[randomMovieIndex].tagline}"`
  // Not sure if there is a way to do the following with a loop?
  aOption.value = fourMoviesArray[0].name;
  aOption.labels[0].innerText = fourMoviesArray[0].name
  bOption.value = fourMoviesArray[1].name;
  bOption.labels[0].innerText = fourMoviesArray[1].name
  cOption.value = fourMoviesArray[2].name;
  cOption.labels[0].innerText = fourMoviesArray[2].name
  dOption.value = fourMoviesArray[3].name;
  dOption.labels[0].innerText = fourMoviesArray[3].name

  const submitButtonEl = document.querySelector("#submit")
  const nextButtonEl = document.querySelector("#next")
  const scoreQuestionNumberEl = document.querySelector('#scoreQuestionNumber')
  let userScore = 0
  let questionNumber = 1
  app.questionSubmitted = false

  // Add an event listener to the submit button to check the user's answer.
  submitButtonEl.addEventListener('click', (event) => {
    event.preventDefault();
    // Query the form elements
    const formEl = document.querySelector('form');
    const radioButtons = document.querySelectorAll('input[type="radio"]')
    const selectedOption = formEl.querySelector('input[type="radio"]:checked')
    const scoreCorrectEl = document.querySelector('#scoreCorrect')
    const checkIconEl = document.querySelector('.fa-circle-check')
    const xIconEl = document.querySelector('.fa-circle-xmark')
    // On submit, display the poster, add to userScore and questionNumber total, and highlight check or x icons.
    
    if(!app.questionSubmitted){
      // Prevent the user from selecting another option for this question.
      for(i = 0; i < 4; i++){
          radioButtons[i].disabled = true;
        }
      // Change app.questionSubmitted to true
      app.questionSubmitted = true;
      // Grey out the submit button
      submitButtonEl.style["opacity"] = 0.3;
      // Want to prevent the hover/focus state on the button but will need to revisit.
      if(selectedOption.value === fourMoviesArray[randomMovieIndex].name){
        
        // If the user chooses the correct option. Up the user's score by 1.
        userScore++
        scoreCorrectEl.innerText = userScore;
        // Increase the questions answered by 1.
        
        scoreQuestionNumberEl.innerText = questionNumber;
        // Change the background of the check mark icon to green, Increase the checkmark's container size and grey out the x.
        checkIconEl.style["background-color"] = "green";
        checkIconEl.style["color"] = "black";
        checkIconEl.style["font-size"] = "5rem"
        xIconEl.style["opacity"] = 0.3;
      }else {
        // If the user chooses the incorrect option: change the x icon color to red.
        xIconEl.style["background-color"] = "red";
        xIconEl.style["font-size"] = "5rem"
        checkIconEl.style["opacity"] = 0.3;
        // Change the background of the x icon to red, Increase the x mark's container size and grey out the checkmark.
      }
    } else {
    }
  })
  nextButtonEl.addEventListener("click", (event) => {
    event.preventDefault();
    // Might want to create a refresh the page function to clear out the current contents.
    app.searchPage++
    console.log(app.searchPage)
    console.log(app.url.search);
    // stuck on page 1...
    questionNumber++;
    const questionCountEl = document.querySelector('#questionCount')
    questionCountEl.innerText = questionNumber
    scoreQuestionNumberEl.innerText = questionNumber
    app.getMovies();
    console.log(app.movieList)
  })
}


app.init = () => {
  app.getMovies();
}

app.init();