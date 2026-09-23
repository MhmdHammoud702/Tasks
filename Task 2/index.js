const dataBlock = document.getElementById('table');
const tableBody = document.getElementById('tablebody');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const searchBox = document.getElementById('searchBox');
const search = document.getElementById('search');
const pag = document.getElementById('pag');
const population = document.getElementById('population');
const name = document.getElementById('name');
const apply = document.getElementById('applyfilter');
const reset = document.getElementById('resetfilter');
let maximum = document.getElementById('maximum');
let minimum = document.getElementById('minimum');
let nameArrow = document.getElementById('nameArrow');
let popArrow = document.getElementById('popArrow');
let total = document.getElementById("total");
let green = document.getElementById("green");
let red = document.getElementById("red");
let favorites = JSON.parse(localStorage.getItem("favorites")) || []
let favonly = document.getElementById('favonly')
let countriesperpage = document.getElementById('countriesperpage');
let random = document.getElementById('random');
let showall = document.getElementById('showall');
let rowsperpage = 5;
let searchCountry = "";
let allCountries = [];
let countries = [];
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
    let Gpop = 0;
    let Rpop = 0;
    if(favonly.checked){
    allCountries = favorites;
        allCountries = allCountries
        if(minimum.value !=0 || maximum.value !=0){
            allCountries = allCountries.filter(item=> item.population >= minimum.value && item.population <= maximum.value);
        }
        if (sort.trim() != "") {
            if(sort == "name"){
                if(order){
                    allCountries.sort((a, b) => {
                        return a.name.localeCompare(b.name)});                       
                }else{
                    allCountries.sort((a, b) => {
                        return b.name.localeCompare(a.name)}); 
                };
            }else{
                if(order){
                    allCountries.sort((a, b) => a.population - b.population);
                }else{
                    allCountries.sort((a,b)=> b.population - a.population)
                }
            }
        }

    }else{
        try {
            const response = await fetch(
                searchCountry.trim() !== ""
                ? `${sort.trim() != "" ? `https://countries.dev/name/${searchCountry.trim()}?sort=${sort}&order=${order ? "asc" : "desc"} ` 
                                    : `https://countries.dev/name/${searchCountry.trim()}`}`
                : `${sort.trim() != "" ? `${url}?sort=${sort}&order=${order ? "asc" : "desc"} ` : `${url}? `}`
            );
            if(!response.ok){
                throw new Error("could not fetch resource");
            }
            const data = await response.json();
            
            if(minimum.value !=0 || maximum.value !=0){
                allCountries = data.filter(item=> item.population >= minimum.value && item.population <= maximum.value);
            }
            else{
                allCountries = data;
            }
        } catch (error) {
            console.error(error);
        }
    }
    total.textContent = allCountries.length;
    Gpop = allCountries.filter(item=> item.population <= 5000000);
    Rpop = allCountries.filter(item=> item.population >= 5000000);
    red.textContent = Rpop.length;
    green.textContent = Gpop.length;
    document.getElementById('favo').textContent = favorites.length;
}

async function fetchData() {
    pages = Math.ceil(allCountries.length / rowsperpage);
    offset = (currentpage - 1) * rowsperpage;

    try {
        document.getElementById('table').style.display = "none";
        document.getElementById('loading').style.display = "block";
        countries = allCountries.slice(
            offset,
            offset + rowsperpage
        );

        displayUsers();
    } catch (error) {
        console.error(error);
    } finally {
        document.getElementById('loading').style.display = "none";
        document.getElementById('table').style.display = "block";
    }
}

function displayUsers(){
    if(countries.length === 1){
        pages = 1;
    }
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
        let added;
        if(favorites.find(item=>item.name == country.name)){
            added = true;
        }else{
            added=false;
        }
        row.classList.add(`${stat}`)
        row.innerHTML= `
            <td><img src="${country.flags.svg}" alt="${country.name.common} flag" width="50"></td>
            <td>${country.name}</td>
            <td>${country.population}</td>
            <td><button class="addFav">${added ? "Added to favorites 🌟" : "Add to favorites ⭐"}</button></td>
            `
        row.addEventListener('click', () => {
            DetailsPreview(country);
        });
        tableBody.appendChild(row);
        const favButton = row.querySelector('.addFav');
        favButton.addEventListener('click',(event)=>{
            event.stopPropagation();
            if(added){
                
                favorites = favorites.filter(item => item.name != country.name);
            }
            else{
                favorites.push(country);
            }
            localStorage.setItem('favorites',JSON.stringify(favorites));
            if(favonly.checked){
                getLength().then(fetchData);
            }else{
                displayUsers();
            }
            
        })
    })
}

searchBox.addEventListener('input', () => {

    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(async () => {
    searchCountry = searchBox.value.trim();
    currentpage = 1;
    await getLength();
    if (favonly.checked && searchCountry !== "") {
        allCountries = allCountries.filter(item =>
            item.name.toLowerCase().includes(searchCountry.toLowerCase())
        );
    }
    await fetchData();

    }, 400);
});



function DetailsPreview(country){
    const preview = document.createElement('div');
    preview.classList.add('details');
    const languages = Object.values(country.languages || {}).map(lang => lang.name).join(", ");
    preview.innerHTML = `
            <div class="card">
                <h3>Country Details</h3>
                <div class="imgDetails">
                    <img src="${country.flags.svg}" alt="${country.name.common} flag" width="50"></td>
                </div>
                <div>
                    <div>
                        Name: ${country.name}
                    </div>
                    <div>
                        Capital: ${country.capital}
                    </div>
                    <div>
                        Population: ${country.population}
                    </div>
                    <div>
                        Region: ${country.region}
                    </div>
                    <div>
                        Subregion: ${country.subregion}
                    </div>
                    <div>
                        Languages: ${languages}
                    </div>
                </div>
                <button id="close">Close</button>
            </div>
    `
    document.body.appendChild(preview);
    document.getElementById('close').addEventListener('click',()=>{
        document.body.removeChild(preview)
    })
}

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
        currentpage = 1;
        popArrow.textContent= `${order ? "⬆️": "⬇️"}`
    } else {
        sort = "population";
        nameArrow.textContent= "";
        popArrow.textContent = "⬆️"
        order = true;
        currentpage=1;
    }

    getLength().then(fetchData);
})

name.addEventListener('click',()=>{
    if (sort === "name") {
        order = !order;
        currentpage = 1
        nameArrow.textContent= `${order ? "⬆️": "⬇️"}`
    } else {
        sort = "name";
        popArrow.textContent= "";
        nameArrow.textContent = "⬆️"
        order = true;
        currentpage = 1;
    }

    getLength().then(fetchData);
})

apply.addEventListener('click',async()=>{
    currentpage = 1
    await getLength();
    await fetchData();
})

minimum.addEventListener('input',()=>{
    if(Number(minimum.value)>Number(maximum.value) && maximum.value != ""){
        document.getElementById('minVal').textContent="Minimum should be less than or equal maximum"
        apply.disabled = true;
        
    }
    else{
        document.getElementById('minVal').textContent=""
        document.getElementById('maxVal').textContent=""
        apply.disabled = false;
    }
})

maximum.addEventListener('input',()=>{
    if(Number(minimum.value)>Number(maximum.value) && minimum.value != ""){
        document.getElementById('maxVal').textContent="Maximum should be greater than or equal minimum"
        apply.disabled = true;
    }
    else{
        document.getElementById('maxVal').textContent=""
        document.getElementById('minVal').textContent=""
        apply.disabled = false;
    }
})

reset.addEventListener('click',async()=>{
    currentpage = 1
    minimum.value = 0;
    maximum.value = 0
    await getLength();
    await fetchData();
})

favonly.addEventListener('change', async () => {
    currentpage = 1;
    await getLength();
    await fetchData();
});

countriesperpage.addEventListener('change',async()=>{
    rowsperpage = Number(countriesperpage.value);
    currentpage=1;
    await fetchData();
})

random.addEventListener('click', async () => {
    await getLength();
    const num = allCountries.length;
    const ran = Math.floor(Math.random() * num);
    countries = [allCountries[ran]];
    showall.disabled = false;
    displayUsers();
});

showall.addEventListener('click',async()=>{
    getLength().then(fetchData);
    showall.disabled = true;
})

getLength().then(fetchData);

