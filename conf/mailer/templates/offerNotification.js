module.exports = function (
  ownerName,
  problemTitle,
  mechanicName,
  maxPrice,
  minPrice,
  problemId,
) {
  return `<!DOCTYPE html>
<html lang="az">
  <head>
    <meta charset="UTF-8" />
    <title>Yeni Təklif</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background: #f5f7fb;
      font-family: Arial, sans-serif;
    "
  >
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="padding: 32px 16px"
    >
      <tr>
        <td align="center">
          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            style="
              background: #ffffff;
              border-radius: 16px;
              overflow: hidden;
            "
          >
            <!-- HEADER -->
            <tr>
              <td
                style="
                  background: orangered;
                  padding: 24px;
                  text-align: center;
                  color: white;
                "
              >
                <h1
                  style="
                    margin: 0;
                    font-size: 24px;
                    font-weight: bold;
                  "
                >
                  AvtoFix
                </h1>

                <p
                  style="
                    margin: 8px 0 0;
                    font-size: 14px;
                    opacity: 0.9;
                  "
                >
                  Probleminiz üçün yeni təklif gəldi
                </p>
              </td>
            </tr>

            <!-- CONTENT -->
            <tr>
              <td style="padding: 32px 28px">
                <h2
                  style="
                    margin: 0 0 16px;
                    font-size: 22px;
                    color: #111827;
                  "
                >
                  Salam  ${ownerName},
                </h2>

                <p
                  style="
                    margin: 0 0 18px;
                    font-size: 15px;
                    line-height: 1.7;
                    color: #4b5563;
                  "
                >
                  "<strong>${problemTitle}</strong>" adlı probleminiz üçün
                  yeni bir mexanik təklif göndərdi.
                </p>

                <!-- OFFER BOX -->
                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    background: #f9fafb;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    margin-bottom: 24px;
                  "
                >
                  <tr>
                    <td style="padding: 20px">
                      <p
                        style="
                          margin: 0 0 8px;
                          color: #111827;
                          font-size: 14px;
                        "
                      >
                        <strong>Mexanik:</strong>
                        ${mechanicName}
                      </p>

                      <p
                        style="
                          margin: 0 0 8px;
                          color: #111827;
                          font-size: 14px;
                        "
                      >
                        <strong>Təklif olunan qiymət:</strong>
                        Min: ${minPrice} ₼ / Maks: ${maxPrice} ₼
                      </p>
                    </td>
                  </tr>
                </table>
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td
                      align="center"
                      bgcolor="orangered"
                      style="border-radius: 10px"
                    >
                      <a
                        href="http://localhost:3000/problems/${problemId}"
                        target="_blank"
                        style="
                          display: inline-block;
                          padding: 14px 24px;
                          color: #ffffff;
                          text-decoration: none;
                          font-size: 15px;
                          font-weight: bold;
                        "
                      >
                        Təklifə bax
                      </a>
                    </td>
                  </tr>
                </table>

                <p
                  style="
                    margin: 28px 0 0;
                    font-size: 13px;
                    line-height: 1.7;
                    color: #6b7280;
                  "
                >
                  Təklifi qəbul etmək və ya digər təklifləri müqayisə etmək üçün
                  platformaya daxil olun.
                </p>
              </td>
            </tr>
            <!-- FOOTER -->
            <tr>
              <td
                style="
                  padding: 20px;
                  text-align: center;
                  font-size: 12px;
                  color: #9ca3af;
                  border-top: 1px solid #e5e7eb;
                "
              >
                © ${new Date().getFullYear()} AvtoFix. Bütün hüquqlar qorunur.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};
