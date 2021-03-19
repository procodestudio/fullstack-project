import { __prod__ } from "./constants"
import { Post } from "./entities/Posts"
import { MikroORM } from '@mikro-orm/core'; 
import path from "path";

export default {
  entities: [Post],
  dbName: 'lireddit',
  type: 'postgresql',
  debug: !__prod__,
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  }
} as Parameters<typeof MikroORM.init>[0];