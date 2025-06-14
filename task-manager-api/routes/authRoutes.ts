import express, { Router, Request, Response, NextFunction } from "express";
import passport from "passport";

const router: Router = express.Router();

type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

const asyncHandler = (fn: RequestHandler) => (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(fn(req, res, next)).catch(next);

router.get(
  "/google",
  (req: Request, res: Response, next: NextFunction): void => {
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      res.json({ redirect: "/auth/google/oauth" });
      return;
    }
    // Type assertion for Passport middleware
    (passport.authenticate("google", {
      scope: ["profile", "email"],
    }) as RequestHandler)(req, res, next);
  }
);

router.get(
  "/google/oauth",
  passport.authenticate("google", { scope: ["profile", "email"] }) as RequestHandler
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }) as RequestHandler,
  (req: Request, res: Response, next: NextFunction): void => {
    console.log("Callback: User authenticated:", req.user);
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        res.status(500).json({ error: "Failed to save session" });
        return;
      }
      res.redirect("/auth/profile");
    });
  }
);

router.get(
  "/profile",
  asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    }
  )
);

router.get(
  "/logout",
  (req: Request, res: Response, next: NextFunction): void => {
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
  }
);

export default router;