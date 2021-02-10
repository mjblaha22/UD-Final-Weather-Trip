function checkCity(cityInput){
    var letters = /^[A-Za-z]+$/;
    if(cityInput.match(letters)){
         return true;
     } else {
         return false;
     }
 }
module.exports = checkCity