import fs from "fs";

let fileInput: number[] = fs
  .readFileSync("input-2.txt", "utf8")
  .split(",")
  .map(item => {
    return parseInt(item, 10);
  });

let finaleOutput = [0];
let noun = 0;
let verb = 0;

while (finaleOutput[0] != 19690720) {
  let executionInput = Array.from(fileInput);

  executionInput[1] = noun;
  executionInput[2] = verb;

  finaleOutput = execute(executionInput);

  if (finaleOutput[0] === 19690720) {
    console.log(100 * noun + verb);
  } else if (verb > 99) {
    console.log(`Something went wrong, verb over 99`);
    break;
  } else {
    console.log(
      `noun at: ${noun}, verb at: ${verb}, output at: ${finaleOutput[0]}`
    );
    if (noun >= 99) {
      noun = 0;
      verb++;
    } else {
      noun++;
    }
  }
}

console.log(finaleOutput[0]);

function execute(input: number[]): number[] {
  executeLoop: for (let i = 0; i <= input.length - 4; i = i + 4) {
    switch (input[i]) {
      case 1:
        input = opCodeOne(input, i);
        break;
      case 2:
        input = opCodeTwo(input, i);
        break;
      default:
        console.log(
          `Terminating, code: ${input[i]} at Index ${i} is unknown. ${input[1]} / ${input[2]}`
        );
        break executeLoop;
    }
  }

  return input;
}

function opCodeOne(inputArray: number[], index: number): number[] {
  const xSourceIndex = inputArray[index + 1];
  const ySourceIndex = inputArray[index + 2];
  const targetIndex = inputArray[index + 3];
  inputArray[targetIndex] = inputArray[xSourceIndex] + inputArray[ySourceIndex];
  return inputArray;
}

function opCodeTwo(inputArray: number[], index: number): number[] {
  const xSourceIndex = inputArray[index + 1];
  const ySourceIndex = inputArray[index + 2];
  const targetIndex = inputArray[index + 3];
  inputArray[targetIndex] = inputArray[xSourceIndex] * inputArray[ySourceIndex];
  return inputArray;
}
