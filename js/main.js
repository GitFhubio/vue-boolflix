let app = new Vue({
  el: "#root",
  data: {
    search:"",
    // array_lang:['it','en','fr','es','hr'],
    films:[],
    series:[],
    products:[],
    castList:[],
    genresList:[],
    cast:[],
    selected:'all',
   api_key:'69110b8b48cfb9568cc058faf0c1d23c',
   endpoint:'https://api.themoviedb.org/3',
  },
  methods:{

    Ricerca(){
        axios
          .get(this.endpoint+'/search/movie?api_key='+this.api_key +'&query='+this.search)
          .then( response => {
            this.films=response.data.results;

          })

          axios
            .get(this.endpoint+'/search/tv?api_key='+this.api_key +'&query='+this.search)
            .then( response => {
              this.series=response.data.results;
              console.log(this.series);
              console.log(this.films);
              this.products=this.films.concat(this.series);
              console.log(this.products)
            })
  },
      imageGenerator(item){
        // per mettere locandina
        // https://www.themoviedb.org/talk/568e3711c3a36858fc002384
         let uri= 'https://image.tmdb.org/t/p/';
         let size='w342';
         let url_img=uri+size+item.poster_path;
         if(item.poster_path == null){
           url_img='img/nocopertina.jpg'
         }
        return url_img;
      },
      getRate(item){
       // return Math.round(item.vote_average/2);
             return Math.ceil(item.vote_average/2);
       },
       getFlag(item){
       // if (this.array_lang.includes(item.original_language)){
       //   return true;}
       //   else{return false}
       let language=item.original_language;
       switch (language){
        case 'en':
         language='gb';
         break;
         case 'ja':
          language='jp';
          break;
          case 'fa':
           language='ir';
           break;
        }
        return 'https://flagcdn.com/16x12/'+language+'.png';
       // return 'https://www.countryflags.io/'+x+'/flat/64.png'
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

     getCredits(product){
       // qui tutto il passaggio di consegne self this potevo evitarlo se ho capito bene poi vedo
         let self=this;
           self.castList=[];
             if(self.isFilm(product)){
               axios
                 .get(this.endpoint+'/movie/'+product.id+'/credits?api_key='+this.api_key)
                 .then( response => {
                   self.cast=response.data.cast.slice(0,5);
                   console.log(self.cast);
                   for (var i = 0; i < self.cast.length; i++) {
                     self.castList.push(self.cast[i].name);
                   }
                 })
               } else{

                 axios
                 .get(this.endpoint+'/tv/'+product.id+'/credits?api_key='+this.api_key)
                   .then( response => {
                    self.cast=response.data.cast;
                     for (var i = 0; i < self.cast.length; i++) {
                       self.castList.push(self.cast[i].name);
                     }
                   });
                 }
           },
           getGenresList() {
             let self=this;
             axios
             .get(this.endpoint+'/genre/movie/list?api_key='+this.api_key)
             .then(response => {
             console.log(response.data.genres);
             self.genresList=response.data.genres;
             });
             axios
             .get(this.endpoint+'/genre/tv/list?api_key='+this.api_key)
             .then(response => {
             console.log(response.data.genres);
             self.genresList=self.genresList.concat(response.data.genres);

           })
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
     console.log (productgenresList);
     return productgenresList.join(', ')

   },
   isgenreinList(product){
     if(this.selected=="all"){
       return true;
     } else {
     let array= this.getProductGenre(product).split(', ');
     console.log(array);
      if (array.includes(this.selected)){
        return true;
      } else {
        return false;
      }
     }
   }

      }
      ,
      mounted(){

        this.getGenresList();
      }

});
