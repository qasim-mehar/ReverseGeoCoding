"strict mode"


const myCountry=async function() {
    const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=28.6139%2C+77.2090&key=${apiKey}`);
    console.log(res)
    const data =await res.json();
    console.log(data.results[0].formatted.split(",")[4]);
    return data.results[0].formatted.split(",")[4];
    
}
const fetchCountryInfo=async function() {
    let country=await myCountry();
    // console.log(countryName);
    const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);
    const [data]= await res.json();
}
// myCountry();
// fetchCountryInfo();
// myCountry();
