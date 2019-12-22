import * as fs from "fs";

class CartesianCoordinates {
  constructor(private x: number, private y: number) {}

  public toString(): string {
    return this.x + "x" + this.y + "y";
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public calculateManhattanDistance(): number {
    return Math.sqrt(Math.pow(this.x, 2)) + Math.sqrt(Math.pow(this.y, 2));
  }
}

class CartesianLine {
  constructor(
    private start: CartesianCoordinates,
    private stop: CartesianCoordinates,
    private previousLength: number
  ) {}

  public getStart(): CartesianCoordinates {
    return this.start;
  }

  public getStop(): CartesianCoordinates {
    return this.stop;
  }

  public getPreviousLength(): number {
    return this.previousLength;
  }

  public getLength(): number {
    return this.calculateLength(this.getStart(), this.getStop());
  }

  public calculateLength(
    pointA: CartesianCoordinates,
    pointB: CartesianCoordinates
  ): number {
    return Math.sqrt(
      Math.pow(
        pointB.getX() - pointA.getX() + (pointB.getY() - pointA.getY()),
        2
      )
    );
  }

  public calculateLengthToPoint(point: CartesianCoordinates): number {
    return (
      this.getPreviousLength() + this.calculateLength(this.getStart(), point)
    );
  }

  public calculatePointOnLine(t: number): CartesianCoordinates {
    const x = this.start.getX() + t * (this.stop.getX() - this.start.getX());
    const y = this.start.getY() + t * (this.stop.getY() - this.start.getY());

    return new CartesianCoordinates(x, y);
  }
}

enum LINE_ORIENTATION {
  X = "VERTICAL",
  Y = "HORIZONTAL"
}

const input: string[] = fs.readFileSync("input-3.txt", "utf8").split("\r\n");

const lineOne = input[0].split(",");
const lineTwo = input[1].split(",");

let lineOneVectors = new Array();
let lineTwoVectors = new Array();
let manhattanDistance = 0;
let minimalLength = 0;

let currentPosition = new CartesianCoordinates(0, 0);
let currentLength = 0;

lineOne.forEach((input: string) => {
  const nextPosition = toCartesianCoordinates(currentPosition, input);
  const currentVector = new CartesianLine(
    currentPosition,
    nextPosition,
    currentLength
  );
  lineOneVectors.push(currentVector);
  currentPosition = nextPosition;
  currentLength = currentVector.getPreviousLength() + currentVector.getLength();
});

currentPosition = new CartesianCoordinates(0, 0);
currentLength = 0;

lineTwo.forEach((input: string) => {
  const nextPosition = toCartesianCoordinates(currentPosition, input);
  const currentVector = new CartesianLine(
    currentPosition,
    nextPosition,
    currentLength
  );
  lineTwoVectors.push(currentVector);
  currentPosition = nextPosition;
  currentLength = currentVector.getPreviousLength() + currentVector.getLength();

  lineOneVectors.forEach(vector => {
    const crossing = calculateCrossingPoint(vector, currentVector);

    if (crossing) {
      const distance = crossing.calculateManhattanDistance();
      const combinedLength =
        vector.calculateLengthToPoint(crossing) +
        currentVector.calculateLengthToPoint(crossing);

      console.log(
        `crossing at ${crossing.toString()}, distance: ${distance}, length: ${combinedLength}`
      );

      if (manhattanDistance > 0) {
        manhattanDistance =
          distance > 0
            ? distance < manhattanDistance
              ? distance
              : manhattanDistance
            : manhattanDistance;
      } else {
        manhattanDistance = distance;
      }

      if (minimalLength > 0) {
        minimalLength =
          combinedLength > 0
            ? combinedLength < minimalLength
              ? combinedLength
              : minimalLength
            : minimalLength;
      } else {
        minimalLength = combinedLength;
      }
    }
  });
});

console.log(manhattanDistance, minimalLength);

function toCartesianCoordinates(
  currentPosition: CartesianCoordinates,
  input: string
): CartesianCoordinates {
  const direction: string = input[0];
  const distance: number = parseInt(input.substr(1, input.length), 10);

  switch (direction) {
    case "U":
      return new CartesianCoordinates(
        currentPosition.getX() + distance,
        currentPosition.getY()
      );
      break;
    case "R":
      return new CartesianCoordinates(
        currentPosition.getX(),
        currentPosition.getY() + distance
      );
      break;
    case "D":
      return new CartesianCoordinates(
        currentPosition.getX() - distance,
        currentPosition.getY()
      );
      break;
    case "L":
      return new CartesianCoordinates(
        currentPosition.getX(),
        currentPosition.getY() - distance
      );
      break;
    default:
      throw Error(`Unknown direction parameter encountered: ${direction}`);
  }
}

function calculateCrossingPoint(
  lineA: CartesianLine,
  lineB: CartesianLine
): CartesianCoordinates {
  const orientationA: LINE_ORIENTATION = calculateOrientation(lineA);
  const orientationB: LINE_ORIENTATION = calculateOrientation(lineB);

  if (orientationA === orientationB) {
    console.log(`Lines are parallel, no crossing possible`);
    return null;
  }

  const x1 = lineA.getStart().getX();
  const x2 = lineA.getStop().getX();
  const x3 = lineB.getStart().getX();
  const x4 = lineB.getStop().getX();

  const y1 = lineA.getStart().getY();
  const y2 = lineA.getStop().getY();
  const y3 = lineB.getStart().getY();
  const y4 = lineB.getStop().getY();

  const tA =
    ((y3 - y4) * (x1 - x3) + (x4 - x3) * (y1 - y3)) /
    ((x4 - x3) * (y1 - y2) - (x1 - x2) * (y4 - y3));

  const tB =
    ((y1 - y2) * (x1 - x3) + (x2 - x1) * (y1 - y3)) /
    ((x4 - x3) * (y1 - y2) - (x1 - x2) * (y4 - y3));

  if (tA >= 0 && tA <= 1 && tB >= 0 && tB <= 1) {
    return lineA.calculatePointOnLine(tA);
  }

  console.log(`Lines not crossing`);
  return null;
}

function calculateOrientation(line: CartesianLine): LINE_ORIENTATION {
  if (line.getStart().getX() === line.getStop().getX()) {
    return LINE_ORIENTATION.X;
  } else if (line.getStart().getY() === line.getStop().getY()) {
    return LINE_ORIENTATION.Y;
  } else {
    throw Error("Slanting lines not supported");
  }
}
