let app = new Vue({
  el: "#root",
  data: {
    searchfilm:"",
   listfilm:[],
   api_key:'69110b8b48cfb9568cc058faf0c1d23c',
   endpoint:'https://api.themoviedb.org/3',
  },
  methods:{

      Ricercafilm(){
          axios
            .get(this.endpoint+'/search/movie?api_key='+this.api_key +'&query='+this.searchfilm)
            .then( response => {
              console.log(response.data.results);
              this.listfilm=response.data.results;
              console.log(this.listfilm);

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
      }




      }

});
