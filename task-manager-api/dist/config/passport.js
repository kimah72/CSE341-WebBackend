"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const User_1 = __importDefault(require("../models/User"));
const callbackURL = process.env.NODE_ENV === "production"
    ? "https://task-manager-api-9tji.onrender.com/auth/google/callback"
    : "http://localhost:5000/auth/google/callback";
passport_1.default.use(new passport_google_oauth20_1.default.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL,
    scope: ["profile", "email"],
    proxy: true,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log("Google profile:", profile);
        let user = await User_1.default.findOne({ googleId: profile.id });
        if (!user) {
            user = new User_1.default({
                username: profile.displayName || `user_${profile.id}`,
                email: profile.emails && profile.emails[0]
                    ? profile.emails[0].value
                    : "",
                googleId: profile.id,
            });
            await user.save();
            console.log("New user saved:", user);
        }
        done(null, user);
    }
    catch (error) {
        console.error("GoogleStrategy error:", error);
        done(error, false);
    }
}));
passport_1.default.serializeUser((user, done) => {
    console.log("Serializing user:", user.id);
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        console.log("Deserializing user ID:", id);
        const user = await User_1.default.findById(id);
        if (!user) {
            console.log("User not found for ID:", id);
            return done(null, false);
        }
        console.log("Deserialized user:", user);
        done(null, user);
    }
    catch (error) {
        console.error("Deserialize error:", error);
        done(error, null);
    }
});
exports.default = passport_1.default;
