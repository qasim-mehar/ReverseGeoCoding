"strict mode"
const card=document.querySelector(".card");

const apiKey= "f5ebdd83600e4f5799c82ab1ce50c615";
const formatPopulation =function(pop){
    if (pop >= 1_000_000_000) {
        return ( (pop / 1_000_000_000).toFixed(2) + ' B');
     } else if (pop >= 1_000_000) {
        return((pop / 1_000_000).toFixed(2) + ' M');
    } else {
        return pop.toLocaleString(); 
    }
}

const renderCountryCard =function(countryData){
    const countryName=countryData.name.common;
    const capitalCity=countryData.capital?.[0] || "N/A";
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
          <div class="info-value">${firstLang } ${secondLang?secondLang: "N/A"}</div>
        </div>
      </div>
      
      <div style="margin-top: 20px;">
        <div class="info-label">Geography</div>
        <div class="tags-container">
          <span class="tag"><i class="fas fa-mountain mr-1"></i> Mountainous</span>
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

const myCountry=async function(lat, lng) {
   try{ 
    const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}%2C+${lng}&key=${apiKey}`);
    console.log(res);

    if(!res.ok){
        throw new Error("Too much request, try after somethime!!")
    }
    const data =await res.json();
    // console.log(data);
    console.log(data.results[0].formatted.split(",").at(-1))
    // console.log(data.results[0]?.formatted?.split(",").at(-1));
    return data.results[0].formatted.split(",").at(-1);
  }
  catch(err){
    alert(err.message);
  }
    
}
const fetchCountryInfo=async function(lat, lng) {
    try{
    let country=await myCountry(lat,lng);
    console.log(country);
    const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);
    // console.log(res);
    if(!res.ok){
        throw new Error("Too much request, try after somethime!!")
    }
    const [data]= await res.json();
    console.log(data);
    renderCountryCard(data);
   }
   catch(err){
   alert(err.message);
   }
}
// fetchCountryInfo(31.5497, 74.3436); // Lahore, Pakistan
// fetchCountryInfo(48.8566, 2.3522);  // Paris, France
// fetchCountryInfo(35.6895, 139.6917); // Tokyo, Japan
fetchCountryInfo(-33.8688, 151.2093); // Sydney, Australia
// fetchCountryInfo(40.7128, -74.0060);  // New York, USA
// fetchCountryInfo(-1.2921, 36.8219);   // Nairobi, Kenya