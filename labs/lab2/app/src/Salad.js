import {v4 as uuidv4} from 'uuid'; 

class Salad {
    static instance_counter = 0;
    id;
    uuid = uuidv4();
    constructor(saladToCopy) { 
      this.ingredients = saladToCopy?.ingredients || {};
      this.id = `salad_${Salad.instance_counter++}`
    }
    add(name, properties) { 
      this.ingredients[name] = properties;
      return this;
    }
    remove(name) { 
      delete this.ingredients[name];
      return this;
    }

    getPrice() {
      const price = Object.entries(this.ingredients)
      .map(([item, props]) => props.price)
      .reduce((sum, price) => sum + price);
      return price;
    };
    
    count(property) {
      const count = Object.keys(this.ingredients)
      .filter((item) => !!this.ingredients[item][property])
      .length;
    
      return count;
    }

   static parse(json) {
      if (typeof json !== 'string') return null;
      const obj = JSON.parse(json);
      if (Array.isArray(obj)) {
        let res = [];
        for (const salad of obj) {
          let newSalad = new Salad(salad);
          newSalad.uuid = salad?.uuid;
          res.push(newSalad)
        }
        return res;
      }
      let newSalad = new Salad(obj);
          newSalad.uuid = obj?.uuid;
      return newSalad;
    }
  
  }

  export default Salad;