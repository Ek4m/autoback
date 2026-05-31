const {
  Problem,
  SpecialistInfo,
  Offer,
  User,
  OfferAgreement,
} = require("../../conf/db/models");
const mailer = require("../../conf/mailer/init");
const offerNotification = require("../../conf/mailer/templates/offerNotification");
const { PROBLEM_STATUS, OFFER_STATUS } = require("../problems/constants");

const offer = async (req, res) => {
  const user = req.user;
  try {
    const body = req.body;
    const problem = await Problem.findByPk(body.problemId, {
      include: [{ model: User, as: "user" }],
    });

    if (!problem) {
      return res.status(400).json({
        message: "Problem tapılmadı!",
      });
    }

    // Ensure mechanic exists
    const mechanicInfo = await SpecialistInfo.findOne({
      where: { userId: user.id },
    });

    if (!mechanicInfo) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Check duplicate offer
    const alreadyOffered = await Offer.findOne({
      where: {
        problemId: body.problemId,
        userId: user.id,
      },
    });

    if (alreadyOffered) {
      return res.status(400).json({
        message: "Siz artıq bu problem üçün təklif vermisiniz!",
      });
    }
    const newOffer = await Offer.create({
      ...body,
      userId: user.id,
    });

    const problemOwner = problem.user;

    if (problemOwner?.email) {
      await mailer.sendMail({
        to: problemOwner.email,
        subject: "Yeni təklif",
        html: offerNotification(
          problemOwner.fullName.split(" ")[0],
          problem.title,
          user.fullName || "",
          newOffer.maxPrice,
          newOffer.minPrice,
          body.problemId,
        ),
      });
    }

    return res.json({
      data: newOffer,
    });
  } catch (error) {
    console.error("POST /offers error:", error);

    return res.status(500).json({
      message: "Server xətası baş verdi",
    });
  }
};

const approveOffer = async (req, res) => {
  const user = req.user;
  try {
    const { id } = req.params;

    const offer = await Offer.findByPk(id, {
      include: [
        { model: User, as: "user" },
        { model: Problem, as: "problem" },
      ],
    });

    if (!offer || offer.problem.userId !== user.id) {
      return res.status(400).json({
        message: "Təklif tapılmadı!",
      });
    }

    // Update problem status
    await Problem.update(
      { status: PROBLEM_STATUS.ASSIGNED },
      { where: { id: offer.problemId } },
    );

    // Accept offer
    await offer.update({
      status: OFFER_STATUS.ACCEPTED,
    });

    // Create agreement
    await OfferAgreement.create({
      offerId: offer.id,
      problemId: offer.problem.id,
    });

    return res.json({
      data: offer,
    });
  } catch (error) {
    console.error("PUT /offers/:id/accept error:", error);

    return res.status(500).json({
      message: "Server xətası baş verdi",
    });
  }
};

const cancelOffer = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const offer = await Offer.findByPk(id, {
      include: [{ model: User, as: "user" }],
    });

    if (!offer || offer.user.id !== user.id) {
      return res.status(400).json({
        message: "Təklif tapılmadı!",
      });
    }
    await offer.update({
      status: OFFER_STATUS.DECLINED,
    });
    return res.json({
      data: offer,
    });
  } catch (error) {
    console.error("DELETE /offers/:id error:", error);

    return res.status(500).json({
      message: "Server xətası baş verdi",
    });
  }
};

module.exports = { offer, approveOffer, cancelOffer };
