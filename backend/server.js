require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/auth");
const reviewsRoutes = require("./routes/reviews");
const ordersRoutes = require("./routes/orders");

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_WWW,
].filter(Boolean);

// ================= MIDDLEWARE =================

app.use(
  cors({
    origin: function (origin, callback) {
      // Разрешаем запросы без origin, например Postman / curl
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("CORS BLOCKED ORIGIN:", origin);

      return callback(new Error("CORS: доступ с этого домена запрещён"));
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ================= HEALTH CHECK =================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Superzvezdy backend is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    service: "superzvezdy-backend",
    time: new Date().toISOString(),
  });
});

// ================= ROUTES =================

app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/orders", ordersRoutes);

// ================= NOT FOUND =================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Маршрут не найден",
  });
});

// ================= ERROR HANDLER =================

app.use((err, req, res, next) => {
  console.log("SERVER ERROR:", err.message);

  res.status(500).json({
    success: false,
    error: "Ошибка сервера",
  });
});

// ================= START =================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Allowed origins:", allowedOrigins);
});