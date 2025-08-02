"strict mode"
const card=document.querySelector(".card");
const btnWhereAmI=document.querySelector(".btn");
const inputLatitude=document.querySelector("#latitude");
const inputLongitude=document.querySelector("#longitude");
const apiKey= "f5ebdd83600e4f5799c82ab1ce50c615";
//Helper Function

//Toasts
const showToast = (msg, type = "info") => {
  const colors = {
    success: "linear-gradient(to right, #4caf50, #2e7d32)",
    error: "linear-gradient(to right, #f44336, #d32f2f)",
    info: "linear-gradient(to right, #2196f3, #1976d2)"
  };

  Toastify({
    text: msg,
    duration: 3000,
    gravity: "bottom",
    position: "right",
    close: true,
    style: {
      background: colors[type],
      color: "white"
    }
  }).showToast();
};

//Population format
const formatPopulation =function(pop){
    if (pop >= 1_000_000_000) {
        return ( (pop / 1_000_000_000).toFixed(2) + ' B');
     } else if (pop >= 1_000_000) {
        return((pop / 1_000_000).toFixed(2) + ' M');
    } else {
        return pop.toLocaleString(); 
    }
}


//geting countryData JSON data from fetchCountryInfo fn and Rendering a country card on page
const renderCountryCard =function(countryData){
 
    const countryName=countryData?.name?.common;
    const capitalCity=countryData?.capital?.[0] || "N/A";
    const area=countryData.area;
    const flag =countryData.flags.png;
    const alt=countryData.flags.alt;
    const allCurrency=Object.values(countryData.currencies);
    const currency =`${allCurrency?.[0]?.symbol || "N/A"} ${allCurrency?.[0]?.name || "N/A"}`;
    const region=countryData.region;
    const [firstLang, secondLang]=Object.values(countryData.languages);

    let population = formatPopulation(countryData.population);

    

    const html=` <div class="card-border"></div>
    <div class="card-image-container">
      <img src=${flag} alt=${alt} class="card-image">
      <div class="card-image-overlay">
        <div class="country-name">
          <img src=${flag} alt=${alt} class="country-flag">
          <h2>${countryName}</h2>
        </div>
      </div>
    </div>
    
    <div class="card-content">
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Capital</div>
          <div class="info-value">${capitalCity}</div>
        </div>
        
        <div class="info-item">
          <div class="info-label">Population</div>
          <div class="info-value">${population}</div>
        </div>
        
        <div class="info-item">
          <div class="info-label">Currency</div>
          <div class="info-value">${currency}</div>
        </div>
        
        <div class="info-item">
          <div class="info-label">Language</div>
          <div class="info-value">${firstLang } , ${secondLang?secondLang: "N/A"}</div>
        </div>
      </div>
      
      <div style="margin-top: 20px;">
        <div class="info-label">Geography</div>
        <div class="tags-container">
          <span class="tag"><i class="fas fa-star mr-1"></i> ${countryData.unMember?"UN Member": "Not a UN Member"}</span>
          <span class="tag"><i class="fas fa-water mr-1"></i> ${countryData.landlocked?"Landlocked":"coastal"}</span>
          <span class="tag"><i class="fas fa-globe-asia mr-1"></i> ${region}</span>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <span class="area-value"><i class="fas fa-ruler-combined"></i> ${area} km²</span>
      <a href="#" class="learn-more">Explore <i class="fas fa-arrow-right"></i></a>
    </div>`
    card.innerHTML=html;

}

//Reverse coding fn which takes coardinates and fetch country's data from an API 
const myCountry=async function(lat, lng) {
   try{ 
    const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}%2C+${lng}&key=${apiKey}`);
   

    if(!res.ok){
        throw new Error("Too much requests, try after sometime!!")
    }
    const data =await res.json();
    return data.results[0].formatted.split(",").at(-1);
  }
  catch(err){
    showToast(err.message,"error");
  }
    
}

//Its just getting country data (Country name precisely) and fetching info about specific country and passing that data to renderCountryCard as an aurgument so that renderCountryCard render country card on screen.
const fetchCountryInfo=async function(lat, lng) {
    try{

    
    let country=await myCountry(lat,lng);
    // console.log(country);
    const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);
    // console.log(res);
    if(!res.ok){
        throw new Error("Too much requests, try after sometime!!")
    }
    const [data]= await res.json();
    // console.log(data);
    renderCountryCard(data);
   }
   catch(err){
    showToast(err.message,"error");
   }
}
//this function simply collect users coadinates 
const detectUserCountry = function () {
  showToast("Accept location access only if you don't want to use coordinates","info");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        showToast("You accepted location your location access", "success")
        const {latitude, longitude} = pos.coords;
        
        
        fetchCountryInfo(latitude, longitude);
      },
      () => {
        showToast("You denied location access", "error")
        
      }
    );
  } else {
    showToast("Your Geolocation not supported", "error");
  }
};
//It's just a simple function which is using for an event listener. It simply passing coardinates values from text fields to  fetchCountryInfo fn so that fetchCountryInfo fn can fetch data related that cooardinateds
const whereAmI=function(e){
  e.preventDefault();
  card.innerHTML= "  Getting information...  "
    fetchCountryInfo(inputLatitude.value,inputLongitude.value);
  }

btnWhereAmI.addEventListener("click",whereAmI);
// 31.5497, 74.3436 // Lahore, Pakistan
// 48.8566, 2.3522  // Paris, France
// 35.6895, 139.6917// Tokyo, Japan
//-33.8688, 151.2093 // Sydney, Australia
// 40.7128, -74.0060  // New York, USA
// -1.2921, 36.8219 // Nairobi, Kenya/