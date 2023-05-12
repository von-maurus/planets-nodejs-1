const { parse } = require('csv-parse')
// Stream posibility is efficient in cases where the data is to big to handle and if you cant scalability.
// const stream = parse([options])
const fs = require('fs')
const results = [];
const csvOptions = {
    comment: "#",
    columns: true
}

function isHabitable(planet) {
    const hasValidInsolarFlux = planet.koi_insol > 0.36 && planet.koi_insol < 1.11;
    const hasValidRadius = planet.koi_prad < 1.6;
    const isConfirmed = planet.koi_disposition === "CONFIRMED";
    return isConfirmed && hasValidInsolarFlux && hasValidRadius;
}

fs.createReadStream('kepler_data.csv')
    .pipe(parse(csvOptions))
    .on('data', chunk => {
        if (isHabitable(chunk)) { results.push(chunk); }
    }).on("end", () => {
        // console.log("Only habitable: ", results)
        console.log(`We found ${results.length} habitable planets`)
        console.log("The names are: \n")
        console.log(results.map(planet => planet["kepler_name"]))
    }).on("error", (error) => {
        console.error(error);
    });
