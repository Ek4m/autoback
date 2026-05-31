const fs = require("fs/promises");
const path = require("path");
const { EntityType } = require("../problems/constants");
const { Problem, Upload } = require("../../conf/db/models");

const uploadFiles = async (req, res) => {
  try {
    const fileType = req.body.fileType;
    const entityId = Number(req.body.entityId);
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const uploadedFiles = [];

    for (const file of files) {
      const ext = file.originalname.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${ext}`;

      const filePath = path.join(process.cwd(), "/public/uploads", fileName);

      await fs.writeFile(filePath, file.buffer);

      uploadedFiles.push(fileName);
    }

    const [firstImage, ...restOfImages] = uploadedFiles;
    if (entityId) {
      switch (fileType) {
        case EntityType.PROBLEM:
          await Problem.update(
            { thumbnail: firstImage },
            { where: { id: entityId } },
          );
          break;
      }
    }

    // save additional images
    if (restOfImages.length) {
      await Upload.bulkCreate(
        restOfImages.map((img) => ({
          name: img,
          entityId,
          type: fileType,
        })),
      );
    }

    return res.json({
      success: true,
      data: uploadedFiles,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Upload failed",
    });
  }
};

const getUploads = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;

    const images = await Upload.findAll({
      where: {
        entityId: id,
        type: type || null,
      },
    });

    return res.json({
      data: images,
    });
  } catch (error) {
    console.error("GET uploads error:", error);

    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

module.exports = {
  uploadFiles,
  getUploads,
};
