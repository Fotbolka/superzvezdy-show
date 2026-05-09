const express = require("express");
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");

const router = express.Router();

const normalizePhone = (phone) => {
  return String(phone || "").replace(/\D/g, "");
};

const formatReview = (review) => {
  return {
    id: review.id,
    text: review.text,
    rating: review.rating,
    service: review.service,

    // frontend ждёт поле user
    user: review.userName || "Пользователь",

    // нужно для удаления своего отзыва
    phone: review.phone,

    // frontend ждёт поле date
    date: review.createdAt,
  };
};

const getUserFromToken = async (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return {
      error: "Нет токена",
      status: 401,
    };
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return {
      error: "Нет токена",
      status: 401,
    };
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return {
      error: "Неверный токен",
      status: 401,
    };
  }

  const phone = normalizePhone(decoded.phone);

  const user = await prisma.user.findUnique({
    where: {
      phone,
    },
  });

  if (!user) {
    return {
      error: "Пользователь не найден",
      status: 401,
    };
  }

  return {
    user,
  };
};

// ================= GET REVIEWS =================

router.get("/", async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(reviews.map(formatReview));
  } catch (error) {
    console.log("GET REVIEWS ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Ошибка загрузки отзывов",
    });
  }
});

// ================= CREATE REVIEW =================

router.post("/", async (req, res) => {
  try {
    const authResult = await getUserFromToken(req);

    if (authResult.error) {
      return res.status(authResult.status).json({
        success: false,
        error: authResult.error,
      });
    }

    const user = authResult.user;

    const { text, rating, service } = req.body;

    if (!text || !String(text).trim()) {
      return res.status(400).json({
        success: false,
        error: "Введите текст отзыва",
      });
    }

    if (!rating) {
      return res.status(400).json({
        success: false,
        error: "Поставьте оценку",
      });
    }

    const ratingNumber = Number(rating);

    if (!Number.isInteger(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
      return res.status(400).json({
        success: false,
        error: "Оценка должна быть от 1 до 5",
      });
    }

    if (!service || !String(service).trim()) {
      return res.status(400).json({
        success: false,
        error: "Выберите аниматора и формат поздравления",
      });
    }

    const alreadyExists = await prisma.review.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        error: "Вы уже оставили отзыв",
      });
    }

    const fullName = `${user.name || ""} ${user.surname || ""}`.trim();

    const newReview = await prisma.review.create({
      data: {
        userId: user.id,

        text: String(text).trim(),
        rating: ratingNumber,
        service: String(service).trim(),

        userName: fullName || "Пользователь",
        phone: user.phone,
      },
    });

    return res.json({
      success: true,
      review: formatReview(newReview),
    });
  } catch (error) {
    console.log("ADD REVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Ошибка добавления отзыва",
    });
  }
});

// ================= DELETE REVIEW =================

router.delete("/:id", async (req, res) => {
  try {
    const authResult = await getUserFromToken(req);

    if (authResult.error) {
      return res.status(authResult.status).json({
        success: false,
        error: authResult.error,
      });
    }

    const user = authResult.user;
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Некорректный ID отзыва",
      });
    }

    const review = await prisma.review.findUnique({
      where: {
        id,
      },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        error: "Отзыв не найден",
      });
    }

    const isOwner = review.userId === user.id;
    const isAdmin = user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: "Это не ваш отзыв",
      });
    }

    await prisma.review.delete({
      where: {
        id,
      },
    });

    return res.json({
      success: true,
    });
  } catch (error) {
    console.log("DELETE REVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Ошибка удаления отзыва",
    });
  }
});

module.exports = router;