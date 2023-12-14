import { Inventory } from "../types";

const alternatorHousing = require("../assets/inventory-items/alternator-housing.png");
const alternator = require("../assets/inventory-items/alternator.png");
const bearings = require("../assets/inventory-items/bearings.png");
const magnetWire = require("../assets/inventory-items/magnet-wire.png");
const rotor = require("../assets/inventory-items/rotor.png");
const voltageRegulator = require("../assets/inventory-items/voltage-regulator.png");

export const inventoryItems: Inventory[] = [
  {
    id: 1,
    image: alternatorHousing,
    name: "Alternator housing",
    number: 0,
  },
  {
    id: 2,
    image: alternator,
    name: "Alternator",
    number: 0,
  },
  {
    id: 3,
    name: "Bearings",
    image: bearings,
    number: 0,
  },
  {
    id: 4,
    name: "Magnet wire",
    image: magnetWire,
    number: 0,
  },
  {
    id: 5,
    name: "Rotor",
    image: rotor,
    number: 0,
  },
  {
    id: 6,
    name: "Voltage regulator",
    image: voltageRegulator,
    number: 0,
  },
];
