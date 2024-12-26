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

  test("should use cached results for repeated searches", async ({
    assert,
  }) => {
    await movieService.create({
      title: "Mafia Movie",
      genre: "Crime",
      rating: 8.5,
      streamingLink: "https://test.com/movie1",
    });

    const firstSearchStart = Date.now();
    const firstResults = await movieService.search("Mafia");
    const firstSearchTime = Date.now() - firstSearchStart;

    const secondSearchStart = Date.now();
    const secondResults = await movieService.search("Mafia");
    const secondSearchTime = Date.now() - secondSearchStart;

    assert.deepEqual(firstResults, secondResults);
    assert.isTrue(secondSearchTime < firstSearchTime);
    assert.isTrue(secondResults.length > 0);
    assert.equal(secondResults[0].title, "Mafia Movie");
  });

  test("should use cache for repeated searches", async ({ assert }) => {
    await movieService.create({
      title: "Mafia Movie",
      genre: "Crime",
      rating: 8.5,
      streamingLink: "https://test.com/movie1",
    });

    const firstResults = await movieService.search("Mafia");

    const secondResults = await movieService.search("Mafia");

    assert.deepEqual(firstResults, secondResults);

    await movieService.create({
      title: "Another Mafia Movie",
      genre: "Crime",
      rating: 9.0,
      streamingLink: "https://test.com/movie2",
    });

    const thirdResults = await movieService.search("Mafia");
    assert.notDeepEqual(secondResults, thirdResults);
    assert.equal(thirdResults.length, 2);
  });
});
