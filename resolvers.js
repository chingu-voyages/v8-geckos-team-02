const { AuthenticationError } = require('apollo-server');
const Pin = require('./models/Pin');

const authenticated = next => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError('You are already logged in');
  }
  return next(root, args, ctx, info);
};

module.exports = {
  Query: {
    self: authenticated((root, args, ctx) => ctx.currentUser),
    getPins: async (root, args, ctx) => {
      const pins = await Pin.find({})
        .populate('author')
        .populate('comments.author');
      return pins;
    }
  },

  Mutation: {
    createPin: authenticated(async (root, args, ctx) => {
      const newPin = await new Pin({
        ...args.input,
        author: ctx.currentUser._id
      }).save();
      const addedPin = await Pin.populate(newPin, 'author');
      return addedPin;
    }),
    deletePin: authenticated(async (root, args, ctx) => {
      const pinDeleted = await Pin.findOneAndDelete({ _id: args.pinId }).exec();
      return pinDeleted;
    })
  }
};
