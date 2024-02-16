const { User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, contextValue, info) => {
      if (contextValue.user) {
        const userData = await User.findOne({
          _id: contextValue.user._id,
        }).select("-__v -password");
        return User.findOne({ _id: contextValue.user._id });
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },

  Mutations: {
    // login a user
    login: async (parent, { email, password }, contextValue, info) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Invalid credentials!");
      }

      // check if the password is correct
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Invalid credentials!");
      }

      // sign token and return an object with token and user
      const token = signToken(user);
      return { token, user };
    },
    // add a user
    addUser: async (parent, args, contextValue, info) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },

    // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
    saveBook: async (_, { bookInput }, contextValue, info) => {
      if (contextValue.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: contextValue.user._id },
          { $addToSet: { savedBooks: bookInput } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    // remove a book from `savedBooks`
    removeBook: async (parent, { bookId }, contextValue, info) => {
      if (contextValue.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: contextValue.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
