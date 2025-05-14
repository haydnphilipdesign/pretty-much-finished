import { PDFDocument } from 'pdf-lib';
import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: true, // leave true so req.body is parsed for you
  },
};

export default async function handler(req, res) {
  try {
    // Destructure directly from req.body (already a JS object)
    const {
      templateUrl,
      mls,
      address,
      salePrice,
      sellersAssist,
      closingDate,
      agentName,
      agentRole,
      buyerName,
      buyerPhone,
      buyerEmail,
      buyerAddress,
      sellerName,
      sellerPhone,
      sellerEmail,
      sellerAddress,
      attorney,
      listSide,
      buyerSide,
      totalPct,
      titleCompany,
      referralParty,
      referralFee,
    } = req.body;

    // Fetch your blank PDF template
    const existingPdfBytes = await fetch(templateUrl).then((r) =>
      r.arrayBuffer()
    );

    // Load and fill the PDF form
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    form.getTextField('MLS #').setText(mls);
    form.getTextField('PROPERTY ADDRESS').setText(address);
    form.getTextField('SALE PRICE').setText(salePrice);
    form.getTextField('SELLER’S ASSIST').setText(sellersAssist);
    form.getTextField('DATE').setText(closingDate);
    form.getTextField('AGENT').setText(agentName);
    form.getTextField('ROLE').setText(agentRole);

    form.getTextField('Buyer Name').setText(buyerName);
    form.getTextField('Buyer Phone').setText(buyerPhone);
    form.getTextField('Buyer Email').setText(buyerEmail);
    form.getTextField('Buyer Address').setText(buyerAddress);

    form.getTextField('Seller Name').setText(sellerName);
    form.getTextField('Seller Phone').setText(sellerPhone);
    form.getTextField('Seller Email').setText(sellerEmail);
    form.getTextField('Seller Address').setText(sellerAddress);

    form.getTextField('Attorney').setText(attorney);
    form.getTextField('List Side %').setText(listSide);
    form.getTextField('Buyer Side %').setText(buyerSide);
    form.getTextField('Total %').setText(totalPct);
    form.getTextField('Title Company').setText(titleCompany);
    form.getTextField('DUE TO').setText(referralParty);
    form.getTextField('%').setText(referralFee);

    // Serialize and return the filled PDF
    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ error: 'PDF generation failed' });
  }
}
