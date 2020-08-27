/* eslint strict:"off" */
"use strict";

const fastify = require("fastify");

const calculator = require("./calculator");
const { loans } = require("./data");

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
      const loan = loans[id];
      return calculator(loan);
    }
  );

  return app;
}

module.exports = {
  build
};
