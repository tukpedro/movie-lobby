import { test } from "@japa/runner";
import Database from "@ioc:Zakodium/Mongodb/Database";

test.group("Movies API", (group) => {
  group.each.setup(async () => {
    const collection = await Database.connection().collection("movies");
    await collection.deleteMany({});
  });

  test("should list movies", async ({ client }) => {
    const response = await client.get("/movies");
    response.assertStatus(200);
    response.assertBodyContains([]);
  });

  test("should create a new movie with admin key", async ({
    client,
    assert,
  }) => {
    const movieData = {
      title: "Test Movie",
      genre: "Action",
      rating: 8.5,
      streamingLink: "https://test.com/movie",
    };

    const response = await client
      .post("/movies")
      .header("admin-key", process.env.ADMIN_KEY!)
      .json(movieData);

    response.assertStatus(201);
    assert.properties(response.body(), ["_id", "title", "genre"]);
    assert.equal(response.body().title, movieData.title);
  });

  test("should not create movie without admin key", async ({ client }) => {
    const movieData = {
      title: "Test Movie",
      genre: "Action",
      rating: 8.5,
      streamingLink: "https://test.com/movie",
    };

    const response = await client.post("/movies").json(movieData);

    response.assertStatus(401);
  });

  test("should search movies", async ({ client }) => {
    const movieData = {
      title: "Searchable Movie",
      genre: "Action",
      rating: 8.5,
      streamingLink: "https://test.com/movie",
    };

    await client
      .post("/movies")
      .header("admin-key", process.env.ADMIN_KEY!)
      .json(movieData);

    const response = await client.get("/movies/search").qs({ q: "Searchable" });

    response.assertStatus(200);
    response.assertBodyContains([{ title: "Searchable Movie" }]);
  });

  test("should update movie with admin key", async ({ client, assert }) => {
    const createResponse = await client
      .post("/movies")
      .header("admin-key", process.env.ADMIN_KEY!)
      .json({
        title: "Original Title",
        genre: "Action",
        rating: 8.5,
        streamingLink: "https://test.com/movie",
      });

    const movieId = createResponse.body()._id;

    const response = await client
      .put(`/movies/${movieId}`)
      .header("admin-key", process.env.ADMIN_KEY!)
      .json({
        title: "Updated Title",
        genre: "Action",
        rating: 9.0,
        streamingLink: "https://test.com/movie",
      });

    response.assertStatus(200);
    assert.equal(response.body().title, "Updated Title");
  });
});
