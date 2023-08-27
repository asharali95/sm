import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongoDB";
import dbConnect from "../../../lib/monogConnect";
import bcrypt from "bcrypt";
import Credentials from "next-auth/providers/credentials";
import { findUser } from "../../../services/db/userServices";
import createHttpError from "http-errors";
import httpStatusCodes from "../../../utils/httpStatusCodes";
import CustomSendVerificationRequest from "./customSignInEmail";
import { applySave } from "../../../services/db/applySaveService";

export default async function auth(req, res) {
  return NextAuth(req, res, {
    session: {
      strategy: "jwt",
      maxAge: 60 * 60 * 24,
    },

    //The adapter to the database we will use to store the data
    adapter: MongoDBAdapter(clientPromise),

    //The providers are the autentication method
    providers: [ 
      EmailProvider({
        server: {
          host: process.env.EMAIL_SERVER_HOST,
          port: process.env.EMAIL_SERVER_PORT,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        },
        from: process.env.EMAIL_FROM,
        maxAge: 60 * 60 * 24,
        async sendVerificationRequest({
          identifier,
          url,
          token,
          baseUrl,
          provider,
        }) {
          // console.log("identifier: ",identifier)
          // console.log("url: ",url)
          // console.log("token: ",token)
          // console.log("baseUrl: ",baseUrl)
          // console.log("provider: ",provider)

          await CustomSendVerificationRequest({
            identifier,
            url,
            req,
            token,
            baseUrl,
            provider,
          });
        },
      }),
      Credentials({
        async authorize(credentials) {
          //Connect to DB
          await dbConnect();
          //Find user with the email
          const user = await findUser({ email: credentials.email });

          //Not found - send error res
          if (!user) {
            throw createHttpError(
              httpStatusCodes.BAD_REQUEST,
              "Invalid account or password details "
            );
          }
          //if Email not verfired than raise an error
          if (user.role === "employee") {
            throw createHttpError(
              httpStatusCodes.BAD_REQUEST,
              "You are already registerd as employee,plesase try with different email."
            );
          }
          //if Email not verfired than raise an error
          if (!user.verified) {
            throw createHttpError(
              httpStatusCodes.BAD_REQUEST,
              "Your Email is not verified,please check your inbox and click the link to verify your email "
            );
          }
          //Check hased password with DB password
          const checkPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          // //Incorrect password - send response
          if (!checkPassword) {
            throw createHttpError(
              httpStatusCodes.BAD_REQUEST,
              "Invalid account or password details "
            );
          }
          //Else send success response

          return user;
        },
      }),
    ],
    callbacks: {
      async signIn({ user, account, profile, email, credentials, context }) {
        if (account.provider === "email") {
          // Add the job in save list or interest list (based on user action )
          // while the user is not logged in but clicked on the interest/save button
          if (
            req.query.token &&
            req.query.jobId &&
            req.query.origin &&
            user.name
          ) {
            //Connect to DB
            await dbConnect();
            //Check if the action is apply and job id is not in the saved and applied list
            if (
              req.query.origin === "apply" &&
              !user.appliedJobs
                .map((el) => el.toString())
                .includes(req.query.jobId) &&
              !user.savedJobs
                .map((el) => el.toString())
                .includes(req.query.jobId)
            ) {
              await applySave(user?.id, req.query.jobId, "apply");
            }
            //Check if the action is apply and job id is not in the applied but in the saved list
            if (
              req.query.origin === "apply" &&
              !user.appliedJobs
                .map((el) => el.toString())
                .includes(req.query.jobId) &&
              user.savedJobs
                .map((el) => el.toString())
                .includes(req.query.jobId)
            ) {
              await applySave(user?.id, req.query.jobId, "applyAndUnsave");
            }

            //Check if the action is saved and job id is not in the saved and applied list
            if (
              req.query.origin === "save" &&
              !user.appliedJobs
                .map((el) => el.toString())
                .includes(req.query.jobId) &&
              !user.savedJobs
                .map((el) => el.toString())
                .includes(req.query.jobId)
            ) {
              await applySave(user?.id, req.query.jobId, "save");
            }
          }
          if (!user.role) {
            user.role = "employee";
          }

          // if (!user.privateFields) {
          //   user.privateFields = ["email"];
          // }

          if (!user.createdAt) {
            user.createdAt = new Date();
          }
        }
        if (account.provider === "email" && user.role === "employer") {
          throw createHttpError(
            httpStatusCodes.UNAUTHORIZED,
            "You are already registered as employer"
          );
        }
        if (account.provider === "email" && user.role === "owner") {
          throw createHttpError(
            httpStatusCodes.UNAUTHORIZED,
            "This email is registered as site owner"
          );
        }
        return true;
      },

      async jwt({ token, user }) {
        if (user && (user?._id || user?.id)) {
          token.id = user._id || user.id;
          token.role = user?.role;
          token.image = user?.image;
        }

        return token;
      },
      async session({ user, session, token }) {
        await dbConnect();
        const updatedUser = await findUser({ _id: token?.id });

        if (token) {
          session.id = token.id;
          session.role = token.role;
          session.image = token.image;
          session.name = updatedUser?.name;
          session.companyName =
            updatedUser?.userType !== "admin"
              ? updatedUser?.company?.name
              : updatedUser?.name;
          session.companyAddress =
            updatedUser?.userType !== "admin"
              ? updatedUser?.company?.address
              : updatedUser?.address;
          session.phone = updatedUser?.phone;
          session.social = updatedUser?.social;
          session.companyWebsite =
            updatedUser?.userType !== "admin"
              ? updatedUser?.company?.website
              : updatedUser?.website;
          session.companyType =
            updatedUser?.userType !== "admin"
              ? updatedUser?.company?.companyType
              : updatedUser?.companyType;
          session.userType = updatedUser?.userType;
          session.isCompany = updatedUser?.isCompany;
          session.designation = updatedUser?.designation;
          session.about = updatedUser?.about ? true : false;
          session.company =
            updatedUser?.userType === "admin"
              ? token.id
              : updatedUser?.company?._id;
        }

        return session;
      },
    },

    pages: {
      signIn: "/auth/signin",
      signOut: "/",
    },
  });
}
