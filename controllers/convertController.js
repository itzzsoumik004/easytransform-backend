const fs = require("fs");
const { PDFDocument } = require("pdf-lib");
const pdf = require("pdf-parse");
const { Document, Packer, Paragraph } = require("docx");
const mammoth = require("mammoth");
const html_to_pdf = require("html-pdf-node");
const PDFMerger = require("pdf-merger-js").default;
const { exec } = require("child_process");

// ======================
// IMAGE TO PDF (MULTIPLE IMAGES)
// ======================
exports.imageToPdf = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded",
      });
    }

    const pdfDoc = await PDFDocument.create();

    for (const file of req.files) {
      // Convert every image to PNG first
      const pngBuffer = await sharp(file.path)
        .png()
        .toBuffer();

      const image = await pdfDoc.embedPng(pngBuffer);

      const page = pdfDoc.addPage([
        image.width,
        image.height,
      ]);

      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    }

    const pdfBytes = await pdfDoc.save();

    const fileName = `${Date.now()}.pdf`;

    fs.writeFileSync(
      `uploads/pdfs/${fileName}`,
      pdfBytes
    );

    res.json({
      success: true,
      file: `/uploads/pdfs/${fileName}`,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// ======================
// PDF TO WORD
// ======================
exports.pdfToWord = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF uploaded",
      });
    }

    const pdfBuffer = fs.readFileSync(req.file.path);

    const pdfData = await pdf(pdfBuffer);

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph(pdfData.text),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    const fileName = `${Date.now()}.docx`;

    fs.writeFileSync(
      `uploads/docs/${fileName}`,
      buffer
    );

    res.json({
      success: true,
      file: `/uploads/docs/${fileName}`,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// ======================
// WORD TO PDF
// ======================
exports.wordToPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No Word file uploaded",
      });
    }

    const wordBuffer = fs.readFileSync(req.file.path);

    const result = await mammoth.convertToHtml({
      buffer: wordBuffer,
    });

    const html = result.value;

    const options = {
      format: "A4",
    };

    const pdfBuffer = await html_to_pdf.generatePdf(
      { content: html },
      options
    );

    const fileName = `${Date.now()}.pdf`;

    fs.writeFileSync(
      `uploads/pdfs/${fileName}`,
      pdfBuffer
    );

  res.json({
  success: true,
  file: `/uploads/pdfs/${fileName}`,
});
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// ======================
// MERGE PDF
// ======================
exports.mergePdf = async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least 2 PDF files.",
      });
    }

   const merger = new PDFMerger();

    for (const file of req.files) {
      await merger.add(file.path);
    }

    const outputFile = `uploads/pdfs/${Date.now()}_merged.pdf`;

    await merger.save(outputFile);

    res.json({
      success: true,
      file: "/" + outputFile.replace(/\\/g, "/"),
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// ======================
// SPLIT PDF
// ======================
exports.splitPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF uploaded",
      });
    }

    const { PDFDocument } = require("pdf-lib");

    const pdfBytes = fs.readFileSync(req.file.path);

    const pdfDoc = await PDFDocument.load(pdfBytes);

    const newPdf = await PDFDocument.create();

    const [page] = await newPdf.copyPages(pdfDoc, [0]);

    newPdf.addPage(page);

    const outputBytes = await newPdf.save();

    const fileName = `${Date.now()}-split.pdf`;

    fs.writeFileSync(
      `uploads/pdfs/${fileName}`,
      outputBytes
    );

    res.json({
      success: true,
      file: `/uploads/pdfs/${fileName}`,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// ======================
// PDF COMPRESSOR
// ======================
exports.compressPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF uploaded",
      });
    }

    const inputFile = req.file.path;
    const outputFile = `uploads/pdfs/${Date.now()}-compressed.pdf`;

    const gs =
  `"C:\\Program Files\\gs\\gs10.07.1\\bin\\gswin64c.exe"`;

const command =
  `${gs} -sDEVICE=pdfwrite ` +
  `-dCompatibilityLevel=1.4 ` +
  `-dPDFSETTINGS=/ebook ` +
  `-dNOPAUSE -dQUIET -dBATCH ` +
  `-sOutputFile="${outputFile}" "${inputFile}"`;

    exec(command, (error) => {
      if (error) {
        console.error(error);

        return res.status(500).json({
          success: false,
          message: "Compression failed",
        });
      }

      res.json({
        success: true,
        file: "/" + outputFile.replace(/\\/g, "/"),
      });
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};