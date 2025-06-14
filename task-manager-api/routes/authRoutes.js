const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    console.log("Callback: User authenticated:", req.user);
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ error: "Failed to save session" });
      }
      res.redirect("/auth/profile");
    });
  }
);

router.get("/profile", (req, res) => {
  console.log("Profile route:", {
    user: req.user,
    isAuthenticated: req.isAuthenticated(),
  });
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  if (!req.user) {
    return res.status(500).json({ error: "User data not available" });
  }
  res.json({ user: req.user });
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ error: "Logout failed" });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err);
        return res.status(500).json({ error: "Session destroy failed" });
      }
      res.clearCookie("connect.sid"); // Clear session cookie
      console.log("Logout successful, session destroyed");
      res.redirect("/");
    });
  });
});

module.exports = router;
