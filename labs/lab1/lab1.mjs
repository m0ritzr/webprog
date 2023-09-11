import {v4 as uuidv4} from 'uuid';

'use strict';
/**
 * Reflection question 1
 * - Because JavaScript is dynamically typed - 
 * we can do if(Sallad.?gluten) and it will automatically know if the property exists or not
 */

import inventory from './inventory.mjs';
console.log('\n=== beginning of printout ================================')
console.log('inventory:', inventory);

console.log('\n--- Object.keys() ---------------------------------------')
const names = Object.keys(inventory);
names
  .sort((a, b) => a.localeCompare(b, "sv", { sensitivity: 'case' }))
  .forEach(name => console.log(name));

console.log('\n--- for ... in ---------------------------------------')
for (const name in inventory) {
  console.log(name);
}
/**
 * Reflection question 2
 * Javascript differentiates between enumareble/non enumarable and own/inherited properties.
 * both for...in and object.keys only take enumerable properties into account
 * thus, if a property is added via object.defineProperty it's not enumerable
 * the two functions will give different results if a property is inherited
 */

console.log('\n--- Assignment 1 ---------------------------------------')

function makeOptions(inv, prop) {
  const options = Object.keys(inv)
  .filter((item) => !!inv[item][prop])
  .map((item) => 
  `<option value="${item}" key="${item}"> ${item}, ${inv[item].price} kr</option>`)
  .reduce((result, currentItem) => result + "\n" + currentItem)

  return options;
}

console.log(makeOptions(inventory, 'foundation'));

console.log('\n--- Assignment 2 ---------------------------------------')
class Salad {
  static #instance_counter = 0;
  constructor(saladToCopy) { 
    if (saladToCopy instanceof Salad) {
    this.ingredients = {...saladToCopy.ingredients};
  } else {
    this.ingredients = {};
  }
    this.id = `salad_${Salad.#instance_counter++}`;
    this.uuid = uuidv4();
  }
  add(name, properties) { 
    this.ingredients[name] = properties;
    return this;
  }
  remove(name) { 
    delete this.ingredients[name];
    return this;
  }
 static parse(json) {
    if (typeof json !== 'string') return null;
    const parsedString = JSON.parse(json);
    if (Array.isArray(parsedString)) {
      let res = [];
      for (const parsedSalad of parsedString) {
        let newSalad = new Salad();
        newSalad.ingredients = parsedSalad.ingredients;
        newSalad.uuid = parsedSalad?.uuid;
        res.push(newSalad)
      }
      return res;
    }
    let newSalad = new Salad();
    newSalad.ingredients = parsedString.ingredients;
    newSalad.uuid = parsedString?.uuid;
    return newSalad;
  }

}

let myCaesarSalad = new Salad()
  .add('Sallad', inventory['Sallad'])
  .add('Kycklingfilé', inventory['Kycklingfilé'])
  .add('Bacon', inventory['Bacon'])
  .add('Krutonger', inventory['Krutonger'])
  .add('Parmesan', inventory['Parmesan'])
  .add('Ceasardressing', inventory['Ceasardressing'])
  .add('Gurka', inventory['Gurka']);
console.log(JSON.stringify(myCaesarSalad, null, 2) + '\n');
myCaesarSalad.remove('Gurka');
console.log(JSON.stringify(myCaesarSalad, null, 2) + '\n');

let differentCeasarSalad = new Salad(myCaesarSalad)
console.log(JSON.stringify(differentCeasarSalad, null, 2) + '\n')

console.log('\n--- Assignment 3 ---------------------------------------')
Salad.prototype.getPrice = function() {
  const price = Object.keys(this.ingredients)
  .map((item) => this.ingredients[item].price)
  .reduce((sum, price) => sum + price);
  return price;
};

Salad.prototype.count = function(property) {
  const count = Object.keys(this.ingredients)
  .filter((item) => !!this.ingredients[item][property])
  .length;

  return count;
}

console.log('En ceasarsallad kostar ' + myCaesarSalad.getPrice() + 'kr');
// En ceasarsallad kostar 45kr
console.log('En ceasarsallad har ' + myCaesarSalad.count('lactose') + ' ingredienser med laktos');
// En ceasarsallad har 2 ingredienser med laktos
console.log('En ceasarsallad har ' + myCaesarSalad.count('extra') + ' tillbehör');
// En ceasarsallad har 3 tillbehör


console.log('\n--- reflection question 3 ---------------------------------------')
console.log('typeof Salad: ' + typeof Salad);
console.log('typeof Salad.prototype: ' + typeof Salad.prototype);
console.log('typeof Salad.prototype.prototype: ' + typeof Salad.prototype.prototype);
console.log('typeof myCaesarSalad: ' + typeof myCaesarSalad);
console.log('typeof myCaesarSalad.prototype: ' + typeof myCaesarSalad.prototype);
console.log('check 1: ' + (Salad.prototype === Object.getPrototypeOf(Salad)));
console.log('check 2: ' + (Salad.prototype === Object.getPrototypeOf(myCaesarSalad)));
console.log('check 3: ' + (Object.prototype === Object.getPrototypeOf(Salad.prototype)));

/**
 * All objects have a prototype from which it inherits values (and functions, as functions are objects are values) from.
 * Object.getPrototypeOf() returns the *real* prototype object (or null) that the object inherits from
 * the .prototype property is the object which is assigned as the prototype of object instances created by a constructor function
 * thus, Salad.prototype will equal Object.getPrototypeOf(myCeasarSalad)
 */ 

console.log('\n--- Assignment 4 ---------------------------------------')
const singleText = JSON.stringify(myCaesarSalad);
const arrayText = JSON.stringify([myCaesarSalad, myCaesarSalad]);

const objectCopy = new Salad(myCaesarSalad);
const singleCopy = Salad.parse(singleText);
const arrayCopy = Salad.parse(arrayText);

singleCopy.add('Gurka', inventory['Gurka']);
objectCopy.add('Gurka', inventory['Gurka']);

console.log('original myCaesarSalad\n' + JSON.stringify(myCaesarSalad));
console.log('new(myCaesarSalad)\n' + JSON.stringify(objectCopy));
console.log('Salad.parse(singleText)\n' + JSON.stringify(singleCopy));
console.log('Salad.parse(arrayText)\n' + JSON.stringify(arrayCopy));


console.log('originalet kostar ' + myCaesarSalad.getPrice() + ' kr');
console.log('kopian från object med gurka kostar ' + objectCopy.getPrice() + ' kr');
console.log('kopian från JSON med gurka kostar ' + singleCopy.getPrice() + ' kr');

console.log('\n--- Assignment 5 ---------------------------------------')
class GourmetSalad extends Salad {

  add(name, properties, size) {
    if (this.ingredients[name]) {
      this.ingredients[name].size += size 
    } else {
    super.add(name, 
      {
        ...properties,
        "size": size
      }) 
    }
    return this;
  }

  getPrice() {
    const price = Object.keys(this.ingredients)
    .map((item) => this.ingredients[item].price * (this.ingredients[item].size ?? 1))
    .reduce((sum, price) => sum + price);
    return price;
  };
}



let myGourmetSalad = new GourmetSalad()
  .add('Sallad', inventory['Sallad'], 0.5)
  .add('Kycklingfilé', inventory['Kycklingfilé'], 2)
  .add('Bacon', inventory['Bacon'], 0.5)
  .add('Krutonger', inventory['Krutonger'])
  .add('Parmesan', inventory['Parmesan'], 2)
  .add('Ceasardressing', inventory['Ceasardressing']);
console.log(JSON.stringify(myGourmetSalad, null, 2))
console.log('Min gourmetsallad med lite bacon kostar ' + myGourmetSalad.getPrice() + ' kr');
myGourmetSalad.add('Bacon', inventory['Bacon'], 1)
console.log('Med extra bacon kostar den ' + myGourmetSalad.getPrice() + ' kr');

console.log('\n--- Assignment 6 ---------------------------------------')
console.log('Min gourmetsallad har id: ' + myGourmetSalad.id);
console.log('Min gourmetsallad har uuid: ' + myGourmetSalad.uuid);

/**
 * Reflection question 4
 * They are stored in the Salad object
 */
/**
 * Reflection question 5
 * yes, with Object.defineProperty() or freezing
 */
/**
 * Reflection question 6
 * yes, with #
 */


class Order {
  uuid = uuidv4();
  constructor(...salads) {
    if (! salads.every(item => item instanceof Salad)) return null;
    this.salads ? [...salads] : [];
  }
  add(salad) {
    if (!salad instanceof Salad) return this;
    this.salads.push(salad);
    return this;
  }
}