const { ContactMessage } = require("../../conf/db/models");
const mailer = require("../../conf/mailer/init");
const contactMessage = require("../../conf/mailer/templates/contactMessage");

const sendContactMessage = async (req, res) => {
  try {
    const body = req.body;
    await ContactMessage.create(body);
    await mailer.sendMail({
      to: "salmanov.elvin.999@gmail.com",
      subject: "1 Əlaqə mesajı var (Avtofix)",
      html: contactMessage(body),
    });

    return res.status(200).json({
      data: {
        message:
          "Mesajınız uğurla göndərildi. Fikirləriniz bizim üçün dəyərlidir",
      },
    });
  } catch (error) {
    console.error("Contact POST error:", error);

    return res.status(500).json({
      message: "Server xətası baş verdi",
    });
  }
};

module.exports = { sendContactMessage };
