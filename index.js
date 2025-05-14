"strict mode"
// const country=prompt("Write country name: ");
// https://geocode.xyz/31.5497,74.3436?geoit=json
// https://restcountries.com/v3.1/name/wnk

const myCountry=async function() {
    const res = await fetch(`https://geocode.xyz/31.5497,74.3436?geoit=json`);
    const data =await res.json();
    return data.myCountry;
}
myCountry();