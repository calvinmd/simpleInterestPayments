/* eslint strict:"off" */
"use strict";

const fastify = require("fastify");

const calculator = require("./calculator");

function build(opts) {
  const app = fastify(opts);

  app.get("/", async (request, reply) => {
    return { hello: "world" };
  });

  app.get(
    "/sf",
    {
      query: {
        id: {
          type: "string"
        }
      }
    },
    async (request, reply) => {
      const { id } = request.query;
      return calculator(id);
    }
  );

  return app;
}

module.exports = {
  build
};
