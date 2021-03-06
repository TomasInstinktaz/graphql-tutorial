const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;

const Movies = require('../models/movie');
const Directors = require('../models/director');

// const directorsJson = [
//     { name: '1 Director', age: 25 }, //5e91ecd41c9d44000010a4e5
//     { name: '2 Director', age: 30 },
//     { name: '3 Director', age: 40 },
//     { name: '4 Director', age: 50 },
// ];

// const moviesJson = [
//     { name: 'Pulp Fiction', genre: 'Crime', directorId: },
//     { name: '1984', genre: 'Sci-Fi', directorId: '2' },
//     { name: 'Harry Potter', genre: 'Fantastic', directorId: },
//     { name: 'Sonic', genre: 'Adverture', directorId:  },
//     { name: 'Fast', genre: 'trilelr', directorId: },
//     { name: 'Godzila', genre: 'Horor', directorId:  },
//     { name: 'Kong', genre: 'Fantastic', directorId:  },
// ];

// const movies = [
//     { id: '1', name: 'Pulp Fiction', genre: 'Crime', directorId: '1' },
//     { id: '2', name: '1984', genre: 'Sci-Fi', directorId: '2' },
//     { id: '3', name: 'Harry Potter', genre: 'Fantastic', directorId: '3' },
//     { id: '4', name: 'Sonic', genre: 'Adverture', directorId: '4' },
//     { id: '5', name: 'Fast', genre: 'trilelr', directorId: '1' },
//     { id: '6', name: 'Godzila', genre: 'Horor', directorId: '4' },
//     { id: '7', name: 'Kong', genre: 'Fantastic', directorId: '1' },
// ];
//
// const directors = [
//     { id: '1', name: '1 Director', age: 25 },
//     { id: '2', name: '2 Director', age: 30 },
//     { id: '3', name: '3 Director', age: 40 },
//     { id: '4', name: '4 Director', age: 50 },
// ];

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
       id: { type: GraphQLID },
       name: { type: new GraphQLNonNull(GraphQLString) },
       genre: { type: new GraphQLNonNull(GraphQLString) },
        director: {
           type: DirectorType,
            resolve(parent, args) {
                // return directors.find(director => director.id == parent.id);
                return Directors.findById(parent.directorId);
            }
        }
    }),
});

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                // return movies.filter(movie => movie.directorId == parent.id);
                return Movies.find({directorId: parent.id});
            }
        }
    }),
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addDirector: {
            type: DirectorType,
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt },
            },
            resolve( parent, args ) {
                const director = new Directors({
                   name: args.name,
                   age: args.age,
                });
                return director.save();
            }
        },
        addMovie: {
            type: MovieType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                directorId: { type: GraphQLID }
            },
            resolve( parent, args ) {
                const movie = new Movies({
                    name: args.name,
                    genre: args.genre,
                    directorId: args.directorId,
                });
                return movie.save();
            }
        },
        deleteDirector: {
            type: DirectorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Directors.findByIdAndRemove(args.id);
            }
        },
        deleteMovie: {
            type: MovieType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Movies.findByIdAndRemove(args.id);
            }
        },
        updateDirector: {
            type: DirectorType,
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                age: { type: GraphQLInt },
            },
            resolve(parent, args) {
                return Directors.findByIdAndUpdate(
                    args.id,
                    { $set: { name: args.name, age: args.age } },
                    { new: true },
                );
            }
        },
        updateDirector: {
            type: DirectorType,
            args: {
                id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                directorId: { type: GraphQLInt }
            },
            resolve(parent, args) {
                return Directors.findByIdAndUpdate(
                    args.id,
                    { $set: { name: args.name, genre: args.genre, directorId: args.directorId } },
                    { new: true },
                );
            }
        },
    }
})

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        movie: {
            type: MovieType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return movies.find(movie => movie.id == args.id);
                return Movies.findById(args.id);
            }
        },
        director: {
            type: DirectorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return directors.find(director => director.id == args.id);
                return Directors.findById(args.id);
            }
        },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                // return movies;
                return Movies.find({});
            }
        },
        directors: {
            type: new GraphQLList(DirectorType),
            resolve(parent, args) {
                // return directors;
                return Directors.find({});
            }
        }
    }

});

module.exports = new GraphQLSchema({
   query: Query,
    mutation: Mutation,
});