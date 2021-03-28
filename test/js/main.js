
const app = new Vue({
    el: '#app',
    data: {
      query:'',
      endpoint:'https://api.themoviedb.org/3',
      selected:'All',
      products:[],
      apikey:'69110b8b48cfb9568cc058faf0c1d23c',
   series:[],
   genresArray:[],
   indexActive:'',
   castlist:'',
   movies:[],
   categories:[],
   actors:[],
},
  methods:{
active(index){
  this.indexActive=index;
},
search(){
  // this.searchMovies();
  // this.searchSeries();
  axios
    .all([
      axios.get("https://api.themoviedb.org/3/search/movie", {
        params: {
          api_key: "69110b8b48cfb9568cc058faf0c1d23c",
          query: this.query,
        },
      }),
      axios.get("https://api.themoviedb.org/3/search/tv", {
        params: {
          api_key: "69110b8b48cfb9568cc058faf0c1d23c",
          query: this.query,
        },
      }),
    ])
    .then(
      axios.spread((moviesResponse, seriesResponse) => {
        this.products = moviesResponse.data.results.concat(seriesResponse.data.results);
         console.log(this.products);
      })
    );
  },
  isMovie(product){
  if(product.hasOwnProperty('original_title')){
    return true;
  } else{return false;}
},
getRatings(product){
return Math.ceil(product.vote_average / 2);
},
getCredits(product,index){
  this.active(index);
  cast=[];
  axios.get("https://api.themoviedb.org/3/movie/"+product.id+"/credits", {
    params: {
      api_key: "69110b8b48cfb9568cc058faf0c1d23c"
    }})
    .then(response=>{
    cast=response.data.cast.slice(0,5);
      cast=cast.map((elem)=>{
      return elem.name;
      });
      // console.log(cast);
       this.castlist=cast.toString();
       // cast.forEach((item, i) => {
       //   actors.push(item.name);
       // });
       // console.log(actors.toString());
    })
},
GenresList(){
axios
  .all([
  axios.get("https://api.themoviedb.org/3/genre/movie/list", {
      params: {
        api_key: "69110b8b48cfb9568cc058faf0c1d23c",
        query: this.query,
      },
    }),
  axios.get("https://api.themoviedb.org/3/genre/tv/list", {
      params: {
        api_key: "69110b8b48cfb9568cc058faf0c1d23c",
        query: this.query,
      },
    }),
  ])

  .then(

    axios.spread((moviesResponse, seriesResponse) => {
       this.categories=[];
       // EVITARE DUPLICATI,ECMA MI AIUTA CON NEWSET
         this.genresArray=moviesResponse.data.genres.concat(seriesResponse.data.genres);
          moviesGenres=moviesResponse.data.genres.map((elem)=>{
          return elem.name;
          });
          seriesGenres=seriesResponse.data.genres.map((elem)=>{
          return elem.name;
          });
          // METODO1) |ECMA|
        this.categories= [...new Set([...moviesGenres,...seriesGenres])];

        // METODO2) |METODOELEGANTE VANILLA|
        // this.categories=[...moviesGenres,...seriesGenres];
        // this.categories=this.categories.filter((elem,index)=>{
        //   // se ho fabio fabio fabio luca,ritorna fabio e luca perche indexoffabio quello è
        //   return this.categories.indexOf(elem)==index
        // });
        // METODO3) |BASE|
         // for (var i = 0; i < this.genresArray.length; i++) {
         //   if(!this.categories.includes(this.genresArray[i].name)){
         //     this.categories.push(this.genresArray[i].name);
         //   }
         // }
         console.log(this.genresArray);
         console.log(this.categories);

}))





},
getGenres(product){
genres=[];
product.genre_ids.forEach((item, i) => {
this.genresArray.forEach((it, v) => {
if(item==it.id && !genres.includes(it.name)){
genres.push(it.name);
}
});

});
return genres;

},
isGenreinList(product){
  if (this.getGenres(product).includes(this.selected) || this.selected=='All'){
    return true;
  } else {return false;}
}
}
,


// searchMovies(){
//   let self=this;
//   axios.get(this.endpoint+'/search/movie?api_key='+this.apikey+'&query='+this.query)
//   .then( response => {
//     this.films=response.data.results;
//     this.products=[...this.products,...this.films];
//     console.log(this.products)
//   })
// }
// ,
// searchSeries(){
//   let self=this;
//   axios.get(this.endpoint+'/search/tv?api_key='+this.apikey+'&query='+this.query)
//   .then( response => {
//       this.series=response.data.results;
//     this.products=[...this.products,...this.series];
//      console.log(this.products);
//   })
// }
mounted(){
  this.GenresList();
}

});
