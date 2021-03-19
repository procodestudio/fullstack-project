import "reflect-metadata";
import redis from 'redis';
import session from 'express-session';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { MikroORM } from '@mikro-orm/core';
import { __port__, __prod__ } from './constants';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from "./resolvers/user";
import mikroConfig from './mikro-orm.config';
import connectRedis from 'connect-redis';
import { MyContext } from "./types";

const main = async () => {
  const app = express();
  const orm = await MikroORM.init(mikroConfig);
  const redisClient = redis.createClient();
  const RedisStore = connectRedis(session);
  
  await orm.getMigrator().up();
  
  app.use(
    session({
      name: 'qid',
      store: new RedisStore({ 
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        secure: __prod__,
        sameSite: 'lax',
      },
      saveUninitialized: false,
      secret: 'procode-secret',
      resave: false,
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }: MyContext) => ({ em: orm.em, req, res }),
  })

  apolloServer.applyMiddleware({ app });

  app.listen(__port__, () => {
    console.log(`Server started on localhost: ${__port__}`)
  });
}

main().catch((err) => console.log(err.message));