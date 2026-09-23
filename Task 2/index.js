const dataBlock = document.getElementById('table');
const tableBody = document.getElementById('tablebody');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const searchBox = document.getElementById('searchBox');
const search = document.getElementById('search');
const pag = document.getElementById('pag');
const population = document.getElementById('population');
const name = document.getElementById('name');
let nameArrow = document.getElementById('nameArrow');
let popArrow = document.getElementById('popArrow');
let total = document.getElementById("total");
let green = document.getElementById("green");
let red = document.getElementById("red");
let searchCountry = "";
let countries = [];
let countriesperpage = 10;
let currentpage = 1; 
let pages = 0;
let offset = 0;
total.textContent = 0;
green.textContent = 0;
red.textContent = 0;
let url = "https://countries.dev/countries"
let searchTimeout;
let sort = "";
let order = false;

async function getLength(){
    try {
        const response = await fetch(
            searchCountry.trim() !== ""
            ? `https://countries.dev/name/${searchCountry.trim()}`
            : `${url}`
        );
        if(!response.ok){
             throw new Error("could not fetch resource");
        }
        const data = await response.json();
        const Gpop = data.filter(item=> item.population < 5000000);
        const Rpop = data.filter(item=> item.population >= 5000000);
        total.textContent = data.length;
        red.textContent = Rpop.length;
        green.textContent = Gpop.length;
        pages = Math.ceil(data.length / countriesperpage);;
    } catch (error) {
        console.error(error);
    }
}

async function fetchData() {
    offset = (currentpage-1)*countriesperpage;
    try {
        document.getElementById('table').style.display = "none";
        document.getElementById('loading').style.display="block";
        const response = await fetch(
            searchCountry.trim() !== ""
            ? `${sort.trim() != "" ? `https://countries.dev/name/${searchCountry.trim()}?sort=${sort}&order=${order ? "asc" : "desc"}&limit=${countriesperpage}&offset=${offset}` 
                                   : `https://countries.dev/name/${searchCountry.trim()}?limit=${countriesperpage}&offset=${offset}`}`
            : `${sort.trim() != "" ? `${url}?sort=${sort}&order=${order ? "asc" : "desc"}&limit=${countriesperpage}&offset=${offset}` : `${url}?limit=${countriesperpage}&offset=${offset}`}`
        );
        if(!response.ok){
             throw new Error("could not fetch resource");
        }
        const data = await response.json();
        console.log(data[0].name)
        countries = data;
        displayUsers();
    } catch (error) {
        console.error(error);
    } finally{
        document.getElementById('loading').style.display="none";
        document.getElementById('table').style.display = "block";
    }
}

function displayUsers(){
    if(currentpage == 1){
        prev.disabled = true;
    }else{
        prev.disabled = false;
    }
    if(currentpage == pages){
        next.disabled = true;
    }else{
        next.disabled = false;
    }
    tableBody.innerHTML= "";
    document.getElementById('paginationBlock').textContent = `${currentpage} of ${pages}`;
    countries.forEach((country)=>{
        const stat = country.population >= 5000000 ? "red" : "green";
        const row = document.createElement('tr');
        row.classList.add(`${stat}`)
        row.innerHTML= `
            <td><img src="${country.flags.svg}" alt="${country.name.common} flag" width="50"></td>
            <td>${country.name}</td>
            <td>${country.population}</td>
            `
        tableBody.appendChild(row);
    })
}

searchBox.addEventListener('input', () => {

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
        searchCountry = searchBox.value.trim();
        currentpage = 1;
        await getLength();
        await fetchData();
    }, 400);

});



prev.addEventListener('click',()=>{
    if(currentpage>1){
        currentpage--;
        fetchData();
    }
})

next.addEventListener('click',()=>{
    if(currentpage < pages){
        currentpage++;
        fetchData();
    }
})

population.addEventListener('click',()=>{
    if (sort === "population") {
        order = !order;
        popArrow.textContent= `${order ? "⬆️": "⬇️"}`
    } else {
        sort = "population";
        nameArrow.textContent= "";
        popArrow.textContent = "⬆️"
        order = true;
    }

    fetchData();
})

name.addEventListener('click',()=>{
    if (sort === "name") {
        order = !order;
        nameArrow.textContent= `${order ? "⬆️": "⬇️"}`
    } else {
        sort = "name";
        popArrow.textContent= "";
        nameArrow.textContent = "⬆️"
        order = true;
    }

    fetchData();
})

getLength().then(fetchData);