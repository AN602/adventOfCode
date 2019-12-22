import fs from "fs";

function calculateFuel(mass: number): number {
  return Math.floor(+mass / 3) - 2;
}

let totalFuel: number = 0;
const input: string[] = fs.readFileSync("input-1.txt", "utf8").split("\r\n");

input.forEach((value: string) => {
  let tempFuel = +value;

  while (tempFuel > 0) {
    tempFuel = calculateFuel(tempFuel);
    totalFuel = tempFuel > 0 ? totalFuel + tempFuel : totalFuel;
  }
});

console.log(totalFuel);
