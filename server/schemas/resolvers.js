const { ParkedCar } = require('../models');


const resolvers = {
  Query: {
    parkedCars: async () => await ParkedCar.find(),
  },

  Mutation: {
    addParkedCar: async (parent, args) => {
      let parkedCar;

      try {
        parkedCar = await ParkedCar.create(
          args,
        );
          console.log(parkedCar)
      } 
      catch (error) {
        console.log(error);
      }

      return parkedCar;
    },

    deleteParkedCar: async (parent, args) => {
      let deletedParkedCar;
      try {
        deletedParkedCar = await ParkedCar.findById(
          { _id: args.id },
        );
      
        await ParkedCar.deleteOne(
          { _id: args.id },
        );
      } 
      catch (error) {
        console.log(error);
      }

      return deletedParkedCar;
    },
  }
};

module.exports = resolvers;
