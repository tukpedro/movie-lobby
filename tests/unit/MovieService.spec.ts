import { test } from "@japa/runner";
import MovieService from "App/Services/MovieService";
import Database from "@ioc:Zakodium/Mongodb/Database";

test.group("Movie Service", (group) => {
  let movieService: MovieService;

  group.each.setup(async () => {
    movieService = new MovieService();
    const collection = await Database.connection().collection("movies");
    await collection.deleteMany({});
  });

  test("should create a new movie", async ({ assert }) => {
    const movieData = {
      title: "Test Movie",
      genre: "Action",
      rating: 8.5,
      streamingLink: "https://test.com/movie",
    };

    const movie = await movieService.create(movieData);
    assert.properties(movie, [
      "_id",
      "title",
      "genre",
      "rating",
      "streamingLink",
    ]);
    assert.equal(movie.title, movieData.title);
  });

  test("should list all movies", async ({ assert }) => {
    const movieData = {
      title: "Test Movie",
      genre: "Action",
      rating: 8.5,
      streamingLink: "https://test.com/movie",
    };

    await movieService.create(movieData);
    const movies = await movieService.listAll();

    assert.isArray(movies);
    assert.isTrue(movies.length > 0);
  });

  test("should search movies by title", async ({ assert }) => {
    await movieService.create({
      title: "Action Movie",
      genre: "Action",
      rating: 8.5,
      streamingLink: "https://test.com/movie1",
    });

    await movieService.create({
      title: "Drama Movie",
      genre: "Drama",
      rating: 9.0,
      streamingLink: "https://test.com/movie2",
    });

    const results = await movieService.search("Action");
    assert.isTrue(results.length > 0);
    assert.equal(results[0].title, "Action Movie");
  });
});
