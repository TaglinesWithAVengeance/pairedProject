// apiKey: 81816879fd2d3541c56bc904bce4b7e3

// example URL: https://api.themoviedb.org/3/movie/550?api_key=81816879fd2d3541c56bc904bce4b7e3

// API Read Access Token - not sure if this is needed just yet
// eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MTgxNjg3OWZkMmQzNTQxYzU2YmM5MDRiY2U0YjdlMyIsInN1YiI6IjYyNDRjYjk1Yzc0MGQ5MDA4OWYzYmU4NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Xm4RpetLzBr71Vz9jOFp5OpD29DS45Z5mIJ2rzpE1YI


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

// app.apiKey = '81816879fd2d3541c56bc904bce4b7e3';
const url = new URL('https://api.themoviedb.org/3/discover/movie');

url.search = new URLSearchParams({
  api_key: '81816879fd2d3541c56bc904bce4b7e3',
  language: 'en-US',
  certification_country: 'usa'
})



//movie language filtering?



app.getMovies = () => {
  fetch(url).then((response) => {
    return response.json();
  }).then((jsonRes) => {
    const results = jsonRes["results"];
    const answerArray = [];

    while(answerArray.length < 4) {
      const oneID = results[Math.floor(Math.random() * results.length)].id;
      // If the ID is not already in our array of IDs:
      if(!answerArray.includes(oneID)){
        console.log(oneID)
        // check if the tagline exists
        const tagline = app.getTaglines(answerArray, oneID)
        console.log(tagline)
        // if(tagline) {
        //   // if the tagline exists, add it to the answer Array.
        answerArray.push(oneID);
        //   console.log(answerArray)
        // }
      };
    }
    // app.getMovieData(answerArray);
  })
}
app.getTaglines = (movieId) => {
  const movieUrl = new URL(`https://api.themoviedb.org/3/movie${movieId}`);
    movieUrl.search = new URLSearchParams({
      api_key: '81816879fd2d3541c56bc904bce4b7e3'
    })
    fetch(movieUrl)
      .then((response) => {
        return response.json();
      })
      .then((movieData) => {
        if (movieData.tagline) {
          return movieData.tagline
        }
      })
}

// app.getMovieData = (movieIdArray) => {
//   console.log(movieIdArray);
//   movieIdArray.forEach(movieId => {
//     const movieUrl = new URL(`https://api.themoviedb.org/3/movie/${movieId}`);
//     movieUrl.search = new URLSearchParams({
//       api_key: '81816879fd2d3541c56bc904bce4b7e3'
//     })
//     fetch(movieUrl)
//       .then((response) => {
//         return response.json();
//       })
//       .then((movieData) => {
//         console.log(movieData.tagline);
//       })
//   })
// }

app.init = () => {
  app.getMovies();
}

app.init();