const {
  SpecialistInfo,
  User,
  Service,
  VipInfo,
} = require("../../conf/db/models");
const { ORDER_BY_CREATION, EntityType } = require("../problems/constants");

const getServices = async (req, res) => {
  try {
    const { order, search, category, mechanic: userId } = req.query;

    const where = {
      isActive: true,
    };

    if (search?.trim()) {
      where.serviceName = {
        [Op.iLike]: `%${search.trim()}%`,
      };
    }

    if (category) {
      where.categories = {
        [Op.contains]: [category],
      };
    }

    if (userId) {
      where.userId = userId;
    }

    const services = await Service.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "profilePicture"],
          include: [
            {
              model: SpecialistInfo,
              as: "specialistInfo",
              attributes: {
                exclude: ["rawAddress", "locationUrl"],
              },
            },
          ],
        },
      ],
      where,
      order: [
        ["isVip", "DESC"],
        ["createdAt", order || ORDER_BY_CREATION.ASC],
      ],
    });

    return res.json({
      data: services,
    });
  } catch (error) {
    console.error("GET /services error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const createService = async (req, res) => {
  try {
    const user = req.user;
    const body = req.body;

    const newService = await Service.create({
      ...body,
      userId: user?.id,
      isActive: true,
    });

    if (body.isVip) {
      const now = new Date();
      const expireTimeInMs = 7 * 24 * 60 * 60 * 1000; // 7 days

      now.setTime(now.getTime() + expireTimeInMs);

      await VipInfo.create({
        expiresAt: now,
        entityId: newService.id,
        entityType: EntityType.SERVICE,
      });
    }

    return res.status(201).json({
      data: {
        message: "Servis uğurla yaradıldı",
        service: newService,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server xətası",
      error: error.message,
    });
  }
};

const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["phoneNumber", "password", "email"],
          },
          include: [
            {
              model: SpecialistInfo,
              as: "specialistInfo",
              attributes: {
                exclude: ["rawAddress", "locationUrl"],
              },
            },
          ],
        },
      ],
    });

    if (!service) {
      return res.status(400).json({
        message: "Xidmət tapılmadı!",
      });
    }

    return res.status(200).json({
      data: service,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server xətası",
      error: error.message,
    });
  }
};

const toggleServiceStatus = async (req, res) => {
  try {
    const user = req.user;

    const { id } = req.params;

    const service = await Service.findOne({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!service) {
      return res.status(404).json({
        message: "Servis tapılmadı",
      });
    }

    const currentStatus = service.isActive;
    const newStatus = !currentStatus;

    await service.update({ isActive: newStatus });

    return res.status(200).json({
      data: {
        message: `Servisin statusu dəyişdirildi. Artıq ${
          newStatus ? "aktivdir" : "aktiv deyil"
        }`,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server xətası",
      error: error.message,
    });
  }
};

module.exports = {
  getServices,
  createService,
  getServiceById,
  toggleServiceStatus,
};
