const express = require("express");
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");

const router = express.Router();

const normalizePhone = (phone) => {
  return String(phone || "").replace(/\D/g, "");
};

const formatOrder = (order) => {
  return {
    id: order.id,
    status: order.status === "DONE" ? "done" : "new",

    phone: order.phone,
    name: order.name,
    surname: order.surname || "",

    animator: order.animator,
    service: order.service,
    duration: order.duration || "",
    price: order.price,

    date: order.date,
    address: order.address,
    comment: order.comment || "",

    acceptedShowFormat: order.acceptedShowFormat,
    acceptedTerms: order.acceptedTerms,

    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
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

// ================= GET ORDERS =================

router.get("/", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(orders.map(formatOrder));
  } catch (err) {
    console.log("GET ORDERS ERROR:", err);

    res.status(500).json({
      success: false,
      error: "Ошибка получения заказов",
    });
  }
});

// ================= CREATE ORDER =================

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

    const {
      animator,
      service,
      duration,
      price,
      date,
      address,
      comment,
      acceptedShowFormat,
      acceptedTerms,
    } = req.body;

    if (!animator || !String(animator).trim()) {
      return res.status(400).json({
        success: false,
        error: "Не указан аниматор",
      });
    }

    if (!service || !String(service).trim()) {
      return res.status(400).json({
        success: false,
        error: "Не указан формат поздравления",
      });
    }

    if (!duration || !String(duration).trim()) {
      return res.status(400).json({
        success: false,
        error: "Не указана длительность",
      });
    }

    if (!price || Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        error: "Не указана стоимость",
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        error: "Выберите дату",
      });
    }

    if (!address || !String(address).trim()) {
      return res.status(400).json({
        success: false,
        error: "Введите адрес",
      });
    }

    if (acceptedShowFormat !== true) {
      return res.status(400).json({
        success: false,
        error:
          "Необходимо подтвердить формат услуги: ростовая кукла / пародийный шоу-образ",
      });
    }

    const today = new Date();
    const selectedDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Некорректная дата мероприятия",
      });
    }

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        error: "Нельзя выбрать прошедшую дату",
      });
    }

    const newOrder = await prisma.order.create({
      data: {
        userId: user.id,

        phone: user.phone,
        name: user.name,
        surname: user.surname || "",

        animator: String(animator).trim(),
        service: String(service).trim(),
        duration: String(duration).trim(),
        price: Number(price),

        date,
        address: String(address).trim(),
        comment: comment ? String(comment).trim() : "",

        acceptedShowFormat: true,
        acceptedTerms: acceptedTerms === true,
      },
    });

    console.log("NEW ORDER:", formatOrder(newOrder));

    return res.json({
      success: true,
      order: formatOrder(newOrder),
    });
  } catch (err) {
    console.log("CREATE ORDER ERROR:", err);

    res.status(500).json({
      success: false,
      error: "Ошибка создания заказа",
    });
  }
});

// ================= MARK ORDER AS DONE =================

router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Некорректный ID заказа",
      });
    }

    const order = await prisma.order.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Заказ не найден",
      });
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id,
      },
      data: {
        status: "DONE",
      },
    });

    res.json({
      success: true,
      order: formatOrder(updatedOrder),
    });
  } catch (err) {
    console.log("PATCH ORDER ERROR:", err);

    res.status(500).json({
      success: false,
      error: "Ошибка обновления заказа",
    });
  }
});

// ================= DELETE ORDER =================

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Некорректный ID заказа",
      });
    }

    const order = await prisma.order.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Заказ не найден",
      });
    }

    await prisma.order.delete({
      where: {
        id,
      },
    });

    res.json({
      success: true,
    });
  } catch (err) {
    console.log("DELETE ORDER ERROR:", err);

    res.status(500).json({
      success: false,
      error: "Ошибка удаления заказа",
    });
  }
});

module.exports = router;