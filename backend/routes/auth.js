const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const prisma = require("../prismaClient");

const ADMIN_PHONE = process.env.ADMIN_PHONE || "79137778829";

const normalizePhone = (phone) => {
  return String(phone || "").replace(/\D/g, "");
};

const createToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET не указан в .env");
  }

  return jwt.sign(
    {
      userId: user.id,
      phone: user.phone,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const generateCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const getCodeExpiresAt = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + 10);
  return date;
};

const sendSmsCode = async ({ phone, code, text }) => {
  const response = await axios.post(
    "https://gate.smsaero.ru/v2/sms/send",
    {
      number: phone,
      text,
      sign: "SMSAero",
    },
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SMSAERO_EMAIL + ":" + process.env.SMS_API_KEY
          ).toString("base64"),
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

const saveVerificationCode = async ({ phone, code, type }) => {
  await prisma.verificationCode.deleteMany({
    where: {
      phone,
      type,
    },
  });

  await prisma.verificationCode.create({
    data: {
      phone,
      code,
      type,
      expiresAt: getCodeExpiresAt(),
    },
  });
};

const checkLastSendLimit = async ({ phone, type }) => {
  const lastCode = await prisma.verificationCode.findFirst({
    where: {
      phone,
      type,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!lastCode) return false;

  const diff = Date.now() - new Date(lastCode.createdAt).getTime();

  return diff < 60000;
};

const verifyCode = async ({ phone, code, type }) => {
  const savedCode = await prisma.verificationCode.findFirst({
    where: {
      phone,
      type,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!savedCode) {
    return {
      success: false,
      error: "Код не найден. Запросите код ещё раз",
    };
  }

  if (new Date(savedCode.expiresAt).getTime() < Date.now()) {
    return {
      success: false,
      error: "Код истёк. Запросите новый код",
    };
  }

  if (String(savedCode.code) !== String(code).trim()) {
    return {
      success: false,
      error: "Неверный код",
    };
  }

  return {
    success: true,
  };
};

// ================= SEND REGISTER CODE =================

router.post("/send-code", async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone);

    if (!phone) {
      return res.status(400).json({
        success: false,
        error: "Нет телефона",
      });
    }

    if (phone.length !== 11 || !phone.startsWith("7")) {
      return res.status(400).json({
        success: false,
        error: "Телефон должен быть в формате 7XXXXXXXXXX",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Пользователь с таким номером уже зарегистрирован",
      });
    }

    const isTooEarly = await checkLastSendLimit({
      phone,
      type: "REGISTER",
    });

    if (isTooEarly) {
      return res.status(429).json({
        success: false,
        error: "Подожди 60 секунд",
      });
    }

    const code = generateCode();

    await saveVerificationCode({
      phone,
      code,
      type: "REGISTER",
    });

    try {
      const smsResult = await sendSmsCode({
        phone,
        code,
        text: `Ваш код на сайте Суперзвезды.Шоу: ${code}`,
      });

      console.log("REGISTER SMS CODE:", code);
      console.log("SMS Aero ответ:", smsResult);

      if (!smsResult?.success) {
        return res.status(500).json({
          success: false,
          error: "SMS Aero не принял сообщение",
        });
      }

      return res.json({
        success: true,
        message: "Код отправлен",
      });
    } catch (error) {
      console.log("SMS ERROR:", error.response?.data || error.message);

      return res.status(500).json({
        success: false,
        error: "Ошибка отправки SMS",
      });
    }
  } catch (error) {
    console.log("SEND CODE ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Ошибка отправки кода",
    });
  }
});

// ================= REGISTER =================

router.post("/register", async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone);
    const { password, code, name, surname } = req.body;

    if (!phone || !code || !password || !name || !surname) {
      return res.status(400).json({
        success: false,
        error: "Заполни все поля",
      });
    }

    if (phone.length !== 11 || !phone.startsWith("7")) {
      return res.status(400).json({
        success: false,
        error: "Телефон должен быть в формате 7XXXXXXXXXX",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Пароль должен быть минимум 6 символов",
      });
    }

    const codeCheck = await verifyCode({
      phone,
      code,
      type: "REGISTER",
    });

    if (!codeCheck.success) {
      return res.status(400).json({
        success: false,
        error: codeCheck.error,
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Пользователь уже есть",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        phone,
        name: name.trim(),
        surname: surname.trim(),
        passwordHash,
        role: phone === ADMIN_PHONE ? "ADMIN" : "USER",
      },
    });

    await prisma.verificationCode.deleteMany({
      where: {
        phone,
        type: "REGISTER",
      },
    });

    const token = createToken(user);

    console.log("REGISTER SUCCESS:", {
      id: user.id,
      phone: user.phone,
      name: user.name,
      surname: user.surname,
      role: user.role,
    });

    return res.json({
      success: true,
      token,
      phone: user.phone,
      name: user.name,
      surname: user.surname || "",
      role: user.role,
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Ошибка регистрации",
    });
  }
});

// ================= CHECK USER =================

router.post("/check-user", async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone);

    const user = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    return res.json({
      success: true,
      exists: Boolean(user),
    });
  } catch (error) {
    console.log("CHECK USER ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Ошибка проверки пользователя",
    });
  }
});

// ================= SEND RESET CODE =================

router.post("/send-reset-code", async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone);

    if (!phone) {
      return res.status(400).json({
        success: false,
        error: "Нет телефона",
      });
    }

    if (phone.length !== 11 || !phone.startsWith("7")) {
      return res.status(400).json({
        success: false,
        error: "Телефон должен быть в формате 7XXXXXXXXXX",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Пользователь с таким номером не найден",
      });
    }

    const isTooEarly = await checkLastSendLimit({
      phone,
      type: "RESET_PASSWORD",
    });

    if (isTooEarly) {
      return res.status(429).json({
        success: false,
        error: "Подожди 60 секунд",
      });
    }

    const code = generateCode();

    await saveVerificationCode({
      phone,
      code,
      type: "RESET_PASSWORD",
    });

    try {
      const smsResult = await sendSmsCode({
        phone,
        code,
        text: `Код для восстановления пароля на сайте Суперзвезды.Шоу: ${code}`,
      });

      console.log("RESET SMS CODE:", code);
      console.log("SMS Aero ответ:", smsResult);

      if (!smsResult?.success) {
        return res.status(500).json({
          success: false,
          error: "SMS Aero не принял сообщение",
        });
      }

      return res.json({
        success: true,
        message: "Код отправлен",
      });
    } catch (error) {
      console.log("RESET SMS ERROR:", error.response?.data || error.message);

      return res.status(500).json({
        success: false,
        error: "Ошибка отправки SMS",
      });
    }
  } catch (error) {
    console.log("SEND RESET CODE ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Ошибка отправки кода",
    });
  }
});

// ================= RESET PASSWORD =================

router.post("/reset-password", async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone);
    const { code, password, confirmPassword } = req.body;

    if (!phone || !code || !password) {
      return res.status(400).json({
        success: false,
        error: "Заполни все поля",
      });
    }

    if (!confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Повторите новый пароль",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Пароли не совпадают",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Пароль должен быть минимум 6 символов",
      });
    }

    const codeCheck = await verifyCode({
      phone,
      code,
      type: "RESET_PASSWORD",
    });

    if (!codeCheck.success) {
      return res.status(400).json({
        success: false,
        error: codeCheck.error,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Пользователь не найден",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: {
        phone,
      },
      data: {
        passwordHash,
      },
    });

    await prisma.verificationCode.deleteMany({
      where: {
        phone,
        type: "RESET_PASSWORD",
      },
    });

    const token = createToken(updatedUser);

    return res.json({
      success: true,
      token,
      phone: updatedUser.phone,
      name: updatedUser.name,
      surname: updatedUser.surname || "",
      role: updatedUser.role,
    });
  } catch (error) {
    console.log("RESET PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Ошибка восстановления пароля",
    });
  }
});

// ================= LOGIN =================

router.post("/login", async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone);
    const { password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        error: "Введите телефон и пароль",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Пользователь не найден",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: "Неверный пароль",
      });
    }

    const token = createToken(user);

    return res.json({
      success: true,
      token,
      phone: user.phone,
      name: user.name,
      surname: user.surname || "",
      role: user.role,
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Ошибка входа",
    });
  }
});

// ================= ME =================

router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: "Нет токена",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({
        success: false,
        error: "Неверный токен",
      });
    }

    const phone = normalizePhone(decoded.phone);

    const user = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Пользователь удалён",
      });
    }

    return res.json({
      success: true,
      id: user.id,
      phone: user.phone,
      name: user.name || "",
      surname: user.surname || "",
      role: user.role,
    });
  } catch (error) {
    console.log("ME ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Ошибка получения профиля",
    });
  }
});

// ================= CHANGE PASSWORD =================

router.post("/change-password", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: "Нет токена",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({
        success: false,
        error: "Неверный токен",
      });
    }

    const phone = normalizePhone(decoded.phone);
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Заполни все поля",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Новый пароль должен быть минимум 6 символов",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Новые пароли не совпадают",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Пользователь не найден",
      });
    }

    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.passwordHash
    );

    if (!isOldPasswordCorrect) {
      return res.status(400).json({
        success: false,
        error: "Старый пароль введён неверно",
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: {
        phone,
      },
      data: {
        passwordHash,
      },
    });

    return res.json({
      success: true,
      message: "Пароль успешно изменён",
    });
  } catch (error) {
    console.log("CHANGE PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Ошибка изменения пароля",
    });
  }
});

router.get("/test", (req, res) => {
  res.send("OK");
});

module.exports = router;