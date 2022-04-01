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
app.url = 'https://api.themoviedb.org/3/search/movie?api_key=81816879fd2d3541c56bc904bce4b7e3&query=action&page=1';

//discover/movie to get id
//then movie/{movieID}

fetch(app.url).then((response) => {
  return response.json();
}).then((jsonRes) => {
  const results = jsonRes["results"];
  console.log(results);
  results.forEach((movie) => {
    console.log(movie.id);
  })
})

