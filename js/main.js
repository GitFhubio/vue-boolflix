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
      }




      }

});
