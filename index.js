import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import bcrypt from "bcrypt";
import Owner from "./models/owner.js";
import { v4 as uuidv4 } from "uuid";
import cookieParser from "cookie-parser";
import { sendInviteMail } from "./mail.js";
import Organization from "./models/organization.js";
import dotenv from "dotenv";
import jwt, { decode } from "jsonwebtoken";
const app = express();
dotenv.config();
app.use(express.json());

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      process.env.CLIENT_URL,
    ].filter(Boolean);
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(cookieParser());
await connectDB();
const PORT = process.env.PORT || 5000;
const saltRounds = 10;
const secret = process.env.SECRET_KEY;

app.get("/test", (req, res) => {
  console.log("TEST HIT");
  res.json({ ok: true });
});

const verifyToken = (req, res, next) => {
  const token = req.headers["x-auth"];
  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
app.post("/signup-post-user", async (req, res) => {
  try {
    const { user_name, email, frontendHash } = req.body;

    if (!user_name) {
      return res.status(400).json({
        message: "Please provide name",
      });
    }
    if (!email) {
      return res.status(400).json({
        message: "Please provide  email",
      });
    }
    if (!frontendHash) {
      return res.status(400).json({
        message: "Please provide password",
      });
    }
    const existingUser = await Owner.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const backendHash = await bcrypt.hash(frontendHash, 10);

    const newUser = new Owner({
      name: user_name,
      email,
      password: backendHash,
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser.uuid }, secret, { expiresIn: "15m" });

    const refreshToken = jwt.sign(
      { id: newUser.uuid },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "28d",
      },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 28 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      _k: newUser.uuid,
      X_AUTH: token,
    });
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
});

app.post("/quickauthapi/signin", async (req, res) => {
  try {
    const { email, hashedPassword } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Please provide email",
      });
    }
    if (!hashedPassword) {
      return res.status(400).json({
        message: "Please provide password",
      });
    }
    const user = await Owner.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid user",
      });
    }
    const isMatch = await bcrypt.compare(hashedPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Please check your password",
      });
    }

    return res.status(200).json({
      message: "Welcome back",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.post("/api/users/fetch-userid", verifyToken, async (req, res) => {
  const check_user_auth = await Owner.findOne({ uuid: req.user.id });
  if (!check_user_auth) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(201).json({
    verify_name: check_user_auth.name,
  });
});

app.post("/refresh-token", async (req, res) => {
  console.log("REFRESH HIT");
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await Owner.findOne({ uuid: decoded.id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAccessToken = jwt.sign({ id: user.uuid }, secret, {
      expiresIn: "15m",
    });

    const newRefreshToken = jwt.sign(
      { id: user.uuid },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "28d" },
    );

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true, // ✅ changed
      sameSite: "none", // ✅ changed
      maxAge: 28 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      X_AUTH: newAccessToken,
    });
  } catch (error) {
    console.log("REFRESH ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/v1/organizations", async (req, res) => {
  try {
    const name = req.headers.name;
    const slug = req.headers.slug;
    const description = req.headers.description;
    const x_auth = req.headers["x-auth-token"];

    if (!name || !slug || !x_auth) {
      return res.status(400).json({
        message: "name, slug, and token are required",
      });
    }

    let verify_id;
    try {
      verify_id = jwt.verify(x_auth, secret);
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await Owner.findOne({ uuid: verify_id.id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalCount = await Organization.countDocuments({
      ownerId: user.uuid,
    });

    if (totalCount >= 20) {
      return res.status(403).json({
        message: "Max 20 organizations allowed",
      });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayCount = await Organization.countDocuments({
      ownerId: user.uuid,
      createdAt: { $gte: todayStart },
    });

    if (todayCount >= 2) {
      return res.status(429).json({
        message: "Only 2 organizations allowed per day",
      });
    }

    const newOrganization = new Organization({
      ownerId: user.uuid,
      organizationname: name,
      description,
      slug,
    });

    await newOrganization.save();

    return res.status(201).json({
      success: true,
      message: "Organization created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.post("/api/send-invite", async (req, res) => {
  const Token = req.headers.authorization;
  const email = req.body.email;
  const acess_token = Token.split(" ")[1];
  if (!acess_token) {
    return res.status(400).json({
      message: "You Are Not Valid User",
    });
  }
  const find_oid = jwt.verify(acess_token, secret);
  const find_org_id = await Organization.findOne({
    ownerId: find_oid.id,
  });

  if (!find_org_id) {
    return res.status(401).json({
      message: "please Create Your Organization",
    });
  }

  const inviteLink = `${process.env.CLIENT_URL}/invite/${find_org_id._id}`;
  await sendInviteMail(email, find_org_id.organizationname, inviteLink);

  return res.status(200).json({
    message: "Invite sent successfully",
  });
});

app.listen(PORT, () => {
  console.log("🚀Server running");
});
