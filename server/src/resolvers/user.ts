import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { MyContext } from "../types";
import { User } from "../entities/User";
import argon2 from 'argon2';
import { COOKIE_NAME } from "../constants";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string
  @Field()
  password: string
}

@ObjectType()
class FieldError {
  @Field()
  field: string
  @Field()
  message: string
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]
  @Field(() => User, { nullable: true })
  user?: User
}

@Resolver()
export class UserResolver {

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    if(!req.session.userId) {
      return null;
    }

    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }
  
  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [{
          field: 'username',
          message: 'Username length must be greater than 2'
        }]
      }
    }
    
    if (options.password.length <= 3) {
      return {
        errors: [{
          field: 'password',
          message: 'Password length must be greater than 3'
        }]
      }
    }

    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    })
    
    try {
      await em.persistAndFlush(user);
    } catch (error) {
      if (error.code === '23505' || error.detail.includes('already exists')) {
        return {
          errors: [{
            field: 'username',
            message: 'User already taken',
          }]
        }
      }
    }

    req.session.userId = user.id;
    
    return {
      user
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username })

    if (!user) {
      return { 
        errors: [{
          field: 'username',
          message: 'Username doesn\'t exist',
        }]
      }
    }

    const valid = await argon2.verify(user.password, options.password);

    if (!valid) {
      return { 
        errors: [{
          field: 'password',
          message: 'Incorrect password',
        }]
      }
    }

    req.session.userId = user.id;

    return {
      user, 
    };
  }

  @Mutation(() => Boolean)
  logout(
    @Ctx() { req, res }: MyContext
  ): Promise<Boolean> {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        if (err) {
          resolve(false);
        }
        
        res.clearCookie(COOKIE_NAME);
        resolve(true);
      });
    });
  }
}