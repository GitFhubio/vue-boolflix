let app = new Vue({
  el: "#root",
  data: {
    search:"",
    array_lang:['it','en','fr','es','hr'],
    films:[],
    series:[],
    products:[],
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


     }




      }

});
