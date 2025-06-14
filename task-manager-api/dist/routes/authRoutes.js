"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.get("/google", (req, res, next) => {
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
        res.json({ redirect: "/auth/google/oauth" });
        return;
    }
    // Type assertion for Passport middleware
    passport_1.default.authenticate("google", {
        scope: ["profile", "email"],
    })(req, res, next);
});
router.get("/google/oauth", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/" }), (req, res, next) => {
    console.log("Callback: User authenticated:", req.user);
    req.session.save((err) => {
        if (err) {
            console.error("Session save error:", err);
            res.status(500).json({ error: "Failed to save session" });
            return;
        }
        res.redirect("/auth/profile");
    });
});
router.get("/profile", asyncHandler(async (req, res, next) => {
    console.log("Profile route:", {
        user: req.user,
        isAuthenticated: req.isAuthenticated(),
    });
    if (!req.isAuthenticated()) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    if (!req.user) {
        res.status(500).json({ error: "User data not available" });
        return;
    }
    res.json({ user: req.user });
}));
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            console.error("Logout error:", err);
            res.status(500).json({ error: "Logout failed" });
            return;
        }
        req.session.destroy((err) => {
            if (err) {
                console.error("Session destroy error:", err);
                res.status(500).json({ error: "Failed to destroy session" });
                return;
            }
            res.clearCookie("connect.sid", {
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production" ? true : false,
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            });
            res.json({ message: "Logged out" });
        });
    });
});
exports.default = router;
