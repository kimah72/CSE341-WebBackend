import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User, { IUser } from "../models/User";

const callbackURL: string =
  process.env.NODE_ENV === "production"
    ? "https://task-manager-api-9tji.onrender.com/auth/google/callback"
    : "http://localhost:5000/auth/google/callback";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL,
      scope: ["profile", "email"],
      proxy: true,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: any,
      done: (error: any, user?: any) => void
    ) => {
      try {
        console.log("Google profile:", profile);
        let user: IUser | null = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = new User({
            username: profile.displayName || `user_${profile.id}`,
            email:
              profile.emails && profile.emails[0]
                ? profile.emails[0].value
                : "",
            googleId: profile.id,
          });
          await user.save();
          console.log("New user saved:", user);
        }
        done(null, user);
      } catch (error) {
        console.error("GoogleStrategy error:", error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user: any, done: (error: any, id?: any) => void) => {
  console.log("Serializing user:", user.id);
  done(null, user.id);
});

passport.deserializeUser(
  async (id: string, done: (error: any, user?: any) => void) => {
    try {
      console.log("Deserializing user ID:", id);
      const user: IUser | null = await User.findById(id);
      if (!user) {
        console.log("User not found for ID:", id);
        return done(null, false);
      }
      console.log("Deserialized user:", user);
      done(null, user);
    } catch (error) {
      console.error("Deserialize error:", error);
      done(error, null);
    }
  }
);

export default passport;