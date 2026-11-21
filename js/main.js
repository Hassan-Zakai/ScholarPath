console.log("ScholarPath loaded");
const storagekey = 'scholarpathFavorites';

function getfavorites(){
    const data= localStorage.getItem(storagekey);
    return data ? JSON.parse(data) : [];
}
function isfavorite(type,id){
    const favorites=getfavorites();
    return favorites.some(item=> item.type===type && item.id===id);
}
function togglefavorites(type,id){
    let favorites=getfavorites()
    const index = favorites.findIndex(item=> item.type===type && item.id===id);
    if(index > -1){
        favorites.splice(index,1);
    }    
    else{
        favorites.push({type, id});
    }
    localStorage.setItem(storagekey,JSON.stringify(favorites));
    return favorites;
}
const menuToggle = document.getElementById('menu-toggle');
const navbar = document.querySelector('.navbar');

if(menuToggle && navbar){
    menuToggle.addEventListener('click',function(){ navbar.classList.toggle('open')});
    
}

// 1) Highlight the link of the page we are on.
//    style-polish.css styles:  .navbar a[aria-current="page"]
const currentPage = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".navbar a").forEach(function (link) {
    if (link.getAttribute("href") === currentPage) {
        link.setAttribute("aria-current", "page");
    }
});

// 2) The README names the favorites functions isFavorite / toggleFavorite / getFavorites,
//    but this file defines them in lowercase. These aliases make BOTH spellings work,
//    so nobody's page breaks.
const getFavorites = getfavorites;
const isFavorite = isfavorite;
const toggleFavorite = togglefavorites;
