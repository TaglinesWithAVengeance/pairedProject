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
const url = new URL('https://api.themoviedb.org/3/discover/movie');

url.search = new URLSearchParams({
  api_key: app.apiKey,
  language: 'en-US',
  certification_country: 'usa',
  sort_by: 'vote_count.desc', //getting more popular searches
  page: '1', // can change this with each call to randomize further, maybe pages 1-20 or 50???
  with_original_language: 'en'
})

app.getMovies = async () => {
  const movieResponse = await fetch(url);
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
  // querying our elements to change
  const formEl = document.querySelector('form');
  // console.log(formEl); //doesn't include the legend
  const legendEl = document.querySelector('legend');
  formEl['aOption'].value = fourMoviesArray[0];
  console.log(formEl['aOption']);
}


app.init = () => {
  app.getMovies();
}

app.init();