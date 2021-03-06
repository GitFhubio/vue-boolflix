let app = new Vue({
  el: "#root",
  data: {
    search:"",
    visible:false,
    showBar:false,
    indexProduct:0,
    array_lang:[
      'it',
      'en',
      'fr',
      'es',
      'pt',
      'hr',
      'zh',
      'ja',
      'de',
      'be',
      'ru',
      'sv'
      ,'hi'
      ,'ms'
      ,'ko'
      ,'da'
      ,'fa'
    ],
    films:[],
    series:[],
    genres:[],
    products:[],
    castList:[],
    genresList:[],
    cast:[],
    searchActive:false,
    selected:'all',
   api_key:'69110b8b48cfb9568cc058faf0c1d23c',
   endpoint:'https://api.themoviedb.org/3',
  },
  methods:{
   ricerca(){
    if(this.search==""){
      this.searchActive=false;
      this.ricercaBase();
    }
this.searchActive=true;
this.ricercaFilms();
this.ricercaSerie();
},
    ricercaFilms(){
       this.products=[];
        axios
        // prova di chiamata axios get fatta con oggetto
          .get(this.endpoint+'/search/movie',
           {
             params:{
               api_key:this.api_key,
               query:this.search,
             }
           })
          .then( response => {
            this.films=response.data.results;
               // this.products=this.products.concat(this.films);
            this.products=[...this.products,...this.films];
          })
  },
  ricercaSerie(){
  this.products=[];
    axios
      .get(this.endpoint+'/search/tv?api_key='+this.api_key +'&query='+this.search)
      .then( response => {
        this.series=response.data.results;
        // this.products=this.products.concat(this.series);
        console.log(this.series);
        console.log(this.films);
        this.products=[...this.products,...this.series];
        console.log(this.products)
      })

  },
      imageGenerator(item){
        // per mettere locandina
        // https://www.themoviedb.org/talk/568e3711c3a36858fc002384
         let uri= 'https://image.tmdb.org/t/p/';
         let size='original';
         let url_img=uri+size+item.poster_path;
         if(item.poster_path == null){
           url_img='img/nocopertina.png'
         }
        return url_img;
      },
      backGenerator(item){
        // https://www.themoviedb.org/talk/568e3711c3a36858fc002384
         let uri= 'https://image.tmdb.org/t/p/';
         let size='original';
         let url_img=uri+size+item.backdrop_path;
         if(item.backdrop_path == null){
           url_img='img/nocopertina2.jpg'
         }
        return url_img;
      },
      getRate(item){
       // return Math.round(item.vote_average/2);
             return Math.ceil(item.vote_average/2);
       },
       getFlag(item){
       if (this.array_lang.includes(item.original_language)){
         return true;}
         else{return false}
     },
       // https://dmitripavlutin.com/check-if-object-has-property-javascript/
       // hasOwnProperty() mi permette di fare una distinzione tra serie e film sulla base di proprietà che hanno solo gli elementi dell'uno o dell'altro
       isFilm(item){
       if (item.hasOwnProperty('original_title') || item.hasOwnProperty('title')) {
         return true;
       } else{
         return false;
       }
     },
     getCastNames(response_ajax){
      this.cast=response_ajax.data.cast.slice(0,5);
       for (var i = 0; i < this.cast.length; i++) {
         this.castList.push(this.cast[i].name);
     }}
,
     getCredits(product){
           this.castList=[];
             if(this.isFilm(product)){
               axios
                 .get(this.endpoint+'/movie/'+product.id+'/credits?api_key='+this.api_key)
                 .then( response => {
                 this.getCastNames(response);
                 })
               } else{
                 axios
                 .get(this.endpoint+'/tv/'+product.id+'/credits?api_key='+this.api_key)
                 .then( response => {
                  this.getCastNames(response);
                   });
                 }
           },
           getGenresList() {
             axios
             .get(this.endpoint+'/genre/movie/list?api_key='+this.api_key)
             .then(response => {
             this.genresList=[...this.genresList,...response.data.genres];
             });
             axios
             .get(this.endpoint+'/genre/tv/list?api_key='+this.api_key)
             .then(response => {
             this.genresList=[...this.genresList,...response.data.genres];
              // console.log(this.genresList);
               this.genresList.forEach((item, i) => {
                   if (!this.genres.includes(item.name)){
                     this.genres.push(item.name);
                   }
               });

           })
           // console.log(this.genres);
     },
     getProductGenre(product){
     let productgenresList = [];
     this.genresList.forEach((genre, i) => {
       product.genre_ids.forEach((genre_id, x) => {
           if(genre.id == genre_id && !productgenresList.includes(genre.name)){
             productgenresList.push(genre.name);
           }
       });

     });
     // console.log (productgenresList);
     return productgenresList.join(', ')

   },
   isgenreinList(product){
     if(this.selected=="all"){
       return true;
     } else {
     let array= this.getProductGenre(product).split(', ');
      if (array.includes(this.selected)){
        return true;
      } else {
        return false;
      }
     }
   },
   onHoverSerie(){
     if(this.searchActive==false || this.search==""){
  this.ricercaBaseSerie();}
  else {
  this.ricercaSerie();
  }
  },
  onHoverFilm(){
    if(this.searchActive==false || this.search==""){
 this.ricercaBaseFilms();}
 else {
 this.ricercaFilms();
 }
},
 ricercaBase(){
this.ricercaBaseFilms()
this.ricercaBaseSerie();
},
ricercaBaseFilms(){
   this.products=[];
    axios
    // prova di chiamata axios get fatta con oggetto
      .get(this.endpoint+'/movie/popular',
       {
         params:{
           api_key:this.api_key,
         }
       })
      .then( response => {
        this.films=response.data.results;
           // this.products=this.products.concat(this.films);
        this.products=[...this.products,...this.films];
      })
      .catch(function(error){
      document.getElementById('root').innerHTML="<h1>Ci scusiamo per il disservizio</h1>";
      })
},
ricercaBaseSerie(){
this.products=[];
axios
  .get(this.endpoint+'/tv/popular', {
           params:{
             api_key:this.api_key,
           }
         })
  .then( response => {
    this.series=response.data.results;
    // this.products=this.products.concat(this.series);
    this.products=[...this.products,...this.series];
  })
  .catch(function(error){
  document.getElementById('root').innerHTML="<h1>Ci scusiamo per il disservizio</h1>";
  })

},
setBackground(index){
  this.indexProduct=index;
},
toggleSearch(){
  if(this.showBar==false){
this.showBar=true;}
else{this.showBar=false;}
},
refresh(){
  location.reload();
}
      }
      ,
      mounted(){
        this.ricercaBase();
        this.getGenresList();
      },
      created: function(){
        setTimeout(() => {
          this.visible = true;
        }, 1500)
      },


});

// in
// mounted() {
//   avrei potuto fare axios all con 3 get
//   axios
//   all([
//     axios.get("https://api.themoviedb.org/3/genre/movie/list", {
//       params: {
//         api_key: this.api_key
//       },
//     }),
//     axios.get("https://api.themoviedb.org/3/genre/tv/list", {
//       params: {
//         api_key: this.api_key
//       },
//     }),
//     axios.get("https://api.themoviedb.org/3/trending/all/week", {
//       params: {
//         api_key: this.api_key
//       },
//     }),
//   ])
// .then(
//   axios.spread((respMovie, respTv, trendingMedia) => {
