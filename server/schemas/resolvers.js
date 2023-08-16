const { ParkedCar } = require('../models');


const resolvers = {
  Query: {
    parkedCars: async () => await ParkedCar.find(),
  },

  Mutation: {
    addParkedCar: async (parent, args) => {
      try {
        const parkedCar = await ParkedCar.create(args);
      } 
      catch (error) {
        console.log(error);
      }

      return { parkedCar };
    },

    deleteParkedCar: async (parent, args) => {
      try {
        const deletedParkedCar = await ParkedCar.findById(
          { _id: args.id },
        );
      
        await ParkedCar.deleteOne(
          { _id: args.id },
        );
      } 
      catch (error) {
        console.log(error);
      }

      return { deletedParkedCar };
    },
  }
};

module.exports = resolvers;
