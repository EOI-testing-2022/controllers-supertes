const supertest = require("supertest");
const createServer = require("./server");
const { list, create, getOne } = require("./services/Post");

const mockPost = {
  title: "Post 1",
  content: "Lorem ipsum",
};

const mockSave = jest.fn()

jest.mock("./services/Post", () => ({
  list: jest.fn(async () => Promise.resolve([mockPost])),
  create: jest.fn(async (data) => Promise.resolve(data)),
  getOne: jest.fn(async (id) => Promise.resolve({...mockPost, save: mockSave})),
}));

const app = createServer();

afterEach(jest.clearAllMocks)

test("GET /api/posts", async () => {
  await supertest(app)
    .get("/api/posts")
    .expect(200)
    .then((response) => {
      expect(list).toHaveBeenCalledTimes(1);

      // Check the response type and length
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toEqual(1);
    });
});

test("POST /api/posts", async () => {
  await supertest(app)
    .post("/api/posts")
    .send(mockPost)
    .expect(201)
    .then(async (response) => {
      expect(create).toHaveBeenCalledTimes(1);
      expect(create).toHaveBeenCalledWith(mockPost);

      // Check the response
      expect(response.body).toEqual(mockPost);
    });
});

test("GET /api/posts/:id", async () => {
  await supertest(app)
    .get("/api/posts/" + "123456")
    .expect(200)
    .then((response) => {
      expect(getOne).toHaveBeenCalledTimes(1);
      expect(getOne).toHaveBeenCalledWith("123456");

      // Check the response
      expect(response.body).not.toBeNull();
      expect(response.body).toEqual(mockPost);
    });
});

describe('PATCH /api/posts/:id endpoint', () => {
  test("should return post without change props", async () => {
    await supertest(app)
      .patch("/api/posts/" + "2")
      .expect(200)
      .then((response) => {
        expect(getOne).toHaveBeenCalledTimes(1);
        expect(getOne).toHaveBeenCalledWith("2");
        expect(mockSave).toHaveBeenCalledTimes(1)
  
        // Check the response
        expect(response.body).not.toBeNull();
        expect(response.body).toEqual(mockPost);
      });
  });

  test("should return newPost when body is sent", async () => {
    const newPost = {
      title: '::newTitle::',
      content: '::newContent::'
    }
    await supertest(app)
      .patch("/api/posts/" + "2")
      .send(newPost)
      .expect(200)
      .then((response) => {
        expect(response.body).not.toBeNull()
        expect(response.body).toEqual(newPost)
      });
  });

  describe('when only one body prop is sent', () => {
    test("should return a post with changed title", async () => {
      const newPost = {
        title: '::newTitle::',
      }
      await supertest(app)
        .patch("/api/posts/" + "2")
        .send(newPost)
        .expect(200)
        .then((response) => {
          expect(response.body).not.toBeNull()
          expect(response.body.title).toBe(newPost.title)
          expect(response.body.content).toBe(mockPost.content)
        });
    });
    test("should return a post with changed content", async () => {
      const newPost = {
        content: '::newContent::',
      }
      await supertest(app)
        .patch("/api/posts/" + "2")
        .send(newPost)
        .expect(200)
        .then((response) => {
          expect(response.body).not.toBeNull()
          expect(response.body.title).toBe(mockPost.title)
          expect(response.body.content).toBe(newPost.content)
        });
    });
  })

  test('should return 404', async () => {
    getOne.mockImplementation(() => Promise.reject())
    await supertest(app)
    .patch("/api/posts/" + "2")
    .expect(404)
    .then((response) => {
      expect(response.status).toBe(404)
      expect(response.body.error).toBe("Post doesn't exist!")
    });
  })
})
