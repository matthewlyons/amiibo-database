const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull } = require('graphql');

const characters = require('./db/characters.json');
const amiibo = require('./db/amiibo.json');

const AmiiboType = new GraphQLObjectType({
  name: 'Amiibo',
  description: 'This represents an Amiibo',
  fields: () => ({
    amiiboSeries: { type: GraphQLNonNull(GraphQLString) },
    character: { type: GraphQLNonNull(GraphQLString) },
    gameSeries: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    image: { type: GraphQLNonNull(GraphQLString) },
    type: { type: GraphQLNonNull(GraphQLString) }
  })
});

const CharacterType = new GraphQLObjectType({
  name: 'Character',
  description: 'This represents a Character',
  fields: () => ({
    name: { type: GraphQLNonNull(GraphQLString) },
    amiibo: {
      type: new GraphQLList(AmiiboType),
      resolve: (character) => {
        return amiibo.filter((element) => element.character === character.name);
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    amiibo: {
      type: new GraphQLList(AmiiboType),
      description: 'List of Amiibo',
      args: {
        type: { type: GraphQLString }
      },
      resolve: (parent, args) => {
        if (args.type) {
          let data = amiibo.filter((element) => element.type === args.type);
          return data;
        } else {
          return amiibo;
        }
      }
    },
    character: {
      type: CharacterType,
      description: 'Single Character',
      args: {
        name: { type: GraphQLString }
      },
      resolve: (parent, args) => characters.find((character) => character.name === args.name)
    },
    characters: {
      type: new GraphQLList(CharacterType),
      description: 'List of Characters',
      resolve: () => characters
    }
  })
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
