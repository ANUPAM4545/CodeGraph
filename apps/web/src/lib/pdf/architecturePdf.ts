import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ArchitectureReport } from '../api/architecture';

export function generateArchitecturePdf(report: ArchitectureReport, repoName: string = 'Repository'): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  let currentY = 45;

  // --- BRAND HEADER ---
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin, currentY, pageWidth - margin * 2, 60, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('CODEGRAPH ARCHITECTURE REPORT', margin + 18, currentY + 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // slate-300
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Repository: ${repoName}   |   Version: ${report.version_id.substring(0, 7)}   |   Generated: ${dateStr}`, margin + 18, currentY + 46);

  currentY += 78;

  // --- EXECUTIVE SUMMARY CARDS ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('Executive Health Summary', margin, currentY);
  currentY += 14;

  const cardWidth = (pageWidth - margin * 2 - 24) / 4;
  const cardHeight = 52;
  const cards = [
    { label: 'HEALTH SCORE', val: `${report.health_score} / 100`, sub: `Grade: ${report.health_grade}` },
    { label: 'SUBSYSTEMS', val: `${report.subsystems_count}`, sub: 'Modules mapped' },
    { label: 'HOTSPOTS', val: `${report.hotspots_count}`, sub: 'High fan-in entities' },
    { label: 'CIRCULAR CYCLES', val: `${report.cycles_count}`, sub: report.cycles_count === 0 ? 'Zero loops (DAG)' : 'Loops detected' }
  ];

  cards.forEach((c, idx) => {
    const cardX = margin + idx * (cardWidth + 8);
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.roundedRect(cardX, currentY, cardWidth, cardHeight, 4, 4, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(c.label, cardX + 10, currentY + 16);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(c.val, cardX + 10, currentY + 34);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(c.sub, cardX + 10, currentY + 45);
  });

  currentY += cardHeight + 20;

  // --- SECTION 1: SUBSYSTEMS DECOMPOSITION ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Subsystem Decomposition & Modularity Boundaries', margin, currentY);
  currentY += 8;

  const subsystemRows = (report.subsystems || []).map(s => [
    s.name,
    String(s.files),
    String(s.symbols),
    String(s.external_dependency_count),
    String(s.coupling_ratio),
    s.health.replace('_', ' ')
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    head: [['Subsystem Module', 'Files', 'Symbols', 'Cross Imports', 'Coupling Ratio', 'Coupling Status']],
    body: subsystemRows.length > 0 ? subsystemRows : [['No subsystems detected', '-', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59], // slate-800
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 5
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [51, 65, 85],
      cellPadding: 4.5
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'center' }
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + 22;

  // Check page break for next section
  if (currentY > pageHeight - 160) {
    doc.addPage();
    currentY = 45;
  }

  // --- SECTION 2: TOP ARCHITECTURAL HOTSPOTS ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Top Architectural Hotspots (Highest Fan-In)', margin, currentY);
  currentY += 8;

  const hotspotRows = (report.hotspots || []).slice(0, 10).map(h => [
    h.name,
    h.type,
    h.file,
    String(h.fan_in),
    (h.top_callers || []).slice(0, 3).join(', ') || 'N/A'
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    head: [['Entity Name', 'Type', 'File Path', 'Dependents', 'Sample Dependents']],
    body: hotspotRows.length > 0 ? hotspotRows : [['No hotspots detected', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: {
      fillColor: [194, 65, 12], // orange-700
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 5
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [51, 65, 85],
      cellPadding: 4
    },
    alternateRowStyles: {
      fillColor: [255, 247, 237] // orange-50
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 90 },
      1: { cellWidth: 70 },
      2: { cellWidth: 120 },
      3: { halign: 'right', cellWidth: 60 },
      4: { cellWidth: 'auto' }
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + 22;

  if (currentY > pageHeight - 140) {
    doc.addPage();
    currentY = 45;
  }

  // --- SECTION 3: ENTRY POINTS & GATEWAYS ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('3. Runtime Entry Points & Application Gateways', margin, currentY);
  currentY += 8;

  const entryRows = (report.entry_points || []).slice(0, 8).map(e => [
    e.name,
    e.type,
    e.file,
    e.reason
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    head: [['Entry Point', 'Type', 'File Path', 'Gateway Reason']],
    body: entryRows.length > 0 ? entryRows : [['No explicit entry files detected', '-', '-', '-']],
    theme: 'grid',
    headStyles: {
      fillColor: [109, 40, 217], // purple-700
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 5
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [51, 65, 85],
      cellPadding: 4
    },
    alternateRowStyles: {
      fillColor: [250, 245, 255] // purple-50
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 100 },
      1: { cellWidth: 60 },
      2: { cellWidth: 150 },
      3: { cellWidth: 'auto' }
    }
  });

  // --- FOOTER FOR ALL PAGES ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(
      'CodeGraph Architecture Intelligence Engine   |   Automated AST Knowledge Graph & Modularity Report',
      margin,
      pageHeight - 20
    );
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin - 50,
      pageHeight - 20
    );
  }

  // Save/Download PDF
  const cleanRepoName = repoName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${cleanRepoName}_Architecture_Report_${report.version_id.substring(0, 7)}.pdf`;
  doc.save(filename);
}
