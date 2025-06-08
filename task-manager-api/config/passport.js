const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

const callbackURL = process.env.NODE_ENV === 'production' 
  ? 'https://task-manager-api-9tji.onrender.com/auth/google/callback'
  : '/auth/google/callback';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
      scope: ['profile', 'email'],
      proxy: true // use proxy if behind a reverse proxy (like Render)
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google profile:', profile);
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = new User({
            username: profile.displayName || `user_${profile.id}`,
            email: profile.emails && profile.emails[0] ? profile.emails[0].value : '',
            googleId: profile.id
          });
          await user.save();
          console.log('New user saved:', user);
        }
        done(null, user);
      } catch (error) {
        console.error('GoogleStrategy error:', error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log('Deserializing user ID:', id);
    const user = await User.findById(id);
    if (!user) {
      console.log('User not found for ID:', id);
      return done(null, false);
    }
    console.log('Deserialized user:', user);
    done(null, user);
  } catch (error) {
    console.error('Deserialize error:', error);
    done(error, null);
  }
});

module.exports = passport;