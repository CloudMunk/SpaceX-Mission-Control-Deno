import { join, BufReader, parse, log } from "../deps.ts";
import * as _ from "https://deno.land/x/lodash@4.17.15-es/lodash.js";
/* interface Planet {
    [ key : string ] : string
} */

type Planet = Record<string, string>;

let planets : Array<Planet>;

export function filterHabitablePlanets(planets : Array<Planet>) {
    return planets.filter(planet => {
        const planetaryRadius = Number(planet["koi_prad"]);
        const stellarMass = Number(planet["koi_smass"]);
        const stellarRadius = Number(planet["koi_srad"]);

        return planet["koi_disposition"] === 'CONFIRMED'
            && planetaryRadius > 0.5 && planetaryRadius < 1.5
            && stellarMass > 0.78 && stellarMass < 1.04
            && stellarRadius > 0.99 && stellarRadius <1.01;
    })
}

async function loadPlanetsData() {
    const path = join("data", "kepler_exoplanets_nasa.csv");

    const file = await Deno.open(path);
    const bufReader = new BufReader(file);

    const result = await parse(bufReader, {
        skipFirstRow: true,
        comment: "#",
    });

    Deno.close(file.rid);

    const planets = filterHabitablePlanets(result as Array<Planet>);

    return planets.map((planet) => {
        return _.pick(planet, [
            "kepler_name",
            "koi_prad",
            "koi_smass",
            "koi_srad",
            "koi_count",
            "koi_steff"
        ])
    });
}

planets = await loadPlanetsData();
log.info(`${planets.length} habitable planets found!`)

export function getAllPlanets() {
    return planets;
}

