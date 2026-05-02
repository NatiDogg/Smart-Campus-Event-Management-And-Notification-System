import PDFDocument from 'pdfkit';

export const generateAnalyticsPDF = (data: any, stream: NodeJS.WritableStream) => {
  // 1. i created a new document with nice margins
  const doc = new PDFDocument({ 
    margin: 50, 
    size: 'A4',
    bufferPages: true 
  });

  // Pipe the document to the response stream (res)
  doc.pipe(stream);

  // --- 2. HEADER SECTION ---
  // Added a blue accent bar at the top for branding
  doc.rect(0, 0, 612, 40).fill('#2563eb'); 
  
  doc.fillColor('#ffffff')
     .fontSize(14)
     .text('SMART CAMPUS EVENT MANAGEMENT SYSTEM', 50, 15, { characterSpacing: 1 });

  doc.moveDown(3);

  // --- 3. REPORT TITLE ---
  doc.fillColor('#111827')
     .fontSize(24)
     .font('Helvetica-Bold')
     .text('Monthly Analytics Insights');
  
  doc.fontSize(10)
     .font('Helvetica')
     .fillColor('#6b7280')
     .text(`Generated: ${new Date().toLocaleDateString()} | Admin Report ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
  
  doc.moveDown(2);

  // --- 4. EXECUTIVE SUMMARY (The Gemini Insights) ---
  doc.fillColor('#111827')
     .fontSize(14)
     .font('Helvetica-Bold')
     .text('Administrative Overview');
  
  doc.moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke('#e5e7eb');
  doc.moveDown(1);

  doc.fillColor('#374151')
     .fontSize(11)
     .font('Helvetica')
     .text(data.summary, { align: 'justify', lineGap: 4 });

  doc.moveDown(2);

  // --- 5. PERFORMANCE TABLE ---
  doc.fillColor('#111827')
     .fontSize(14)
     .font('Helvetica-Bold')
     .text('Event Performance Metrics');
  doc.moveDown(1);

  // Table Headers
  const tableTop = doc.y;
  doc.fontSize(10).fillColor('#9ca3af');
  doc.text('EVENT TITLE', 50, tableTop);
  doc.text('REGS', 300, tableTop);
  doc.text('TURNOUT', 380, tableTop);
  doc.text('SCORE', 460, tableTop);

  doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke('#eeeeee');
  
  // Table Rows
  let currentY = tableTop + 25;
  data.tableMetrics.forEach((event: any) => {
    // Check if we are running out of space on the page
    if (currentY > 700) {
        doc.addPage();
        currentY = 50;
    }

    doc.fillColor('#111827')
       .font('Helvetica-Bold')
       .fontSize(10)
       .text(event.title, 50, currentY, { width: 240, lineBreak: false });

    doc.font('Helvetica')
       .text(event.registrations.toString(), 300, currentY);

    doc.text(event.attendanceRate, 380, currentY);

    // Color the score
    const scoreColor = event.score === 'High' ? '#059669' : '#2563eb';
    doc.fillColor(scoreColor).text(event.score, 460, currentY);

    currentY += 30;
  });

  // --- 6. FOOTER ---
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < (range.start + range.count); i++) {
    doc.switchToPage(i);
    doc.fontSize(8)
       .fillColor('#9ca3af')
       .text(`Page ${i + 1} of ${range.count}`, 50, 780, { align: 'center' });
  }

  // Finalize the PDF
  doc.end();
};