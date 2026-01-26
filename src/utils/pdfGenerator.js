import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

class PDFGenerator {
  constructor() {
    this.doc = null;
    this.currentY = 20;
    this.pageHeight = 280;
    this.margin = 20;
  }

  checkPageBreak(height = 20) {
    if (this.currentY + height > this.pageHeight) {
      this.doc.addPage();
      this.currentY = 20;
      return true;
    }
    return false;
  }

  addTitle(text, fontSize = 22) {
    this.checkPageBreak(15);
    this.doc.setFontSize(fontSize);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(102, 126, 234); // Purple color
    this.doc.text(text, this.margin, this.currentY);
    this.currentY += 12;
  }

  addSubtitle(text, fontSize = 16) {
    this.checkPageBreak(12);
    this.doc.setFontSize(fontSize);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(118, 75, 162); // Darker purple
    this.doc.text(text, this.margin, this.currentY);
    this.currentY += 10;
  }

  addText(text, fontSize = 11, maxWidth = 170) {
    this.doc.setFontSize(fontSize);
    this.doc.setFont(undefined, 'normal');
    this.doc.setTextColor(60, 60, 60);
    
    const lines = this.doc.splitTextToSize(text, maxWidth);
    
    lines.forEach(line => {
      this.checkPageBreak(7);
      this.doc.text(line, this.margin, this.currentY);
      this.currentY += 6;
    });
    
    this.currentY += 2;
  }

  addBoldText(label, value, fontSize = 11) {
    this.checkPageBreak(7);
    this.doc.setFontSize(fontSize);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(40, 40, 40);
    this.doc.text(label, this.margin, this.currentY);
    
    this.doc.setFont(undefined, 'normal');
    this.doc.setTextColor(60, 60, 60);
    const labelWidth = this.doc.getTextWidth(label);
    this.doc.text(value, this.margin + labelWidth + 2, this.currentY);
    this.currentY += 7;
  }

  addLine() {
    this.checkPageBreak(5);
    this.doc.setDrawColor(200, 200, 200);
    this.doc.line(this.margin, this.currentY, 190, this.currentY);
    this.currentY += 8;
  }

  addSpace(height = 5) {
    this.currentY += height;
  }

  addImage(imageDataUrl) {
    try {
      this.checkPageBreak(80);
      const imgWidth = 170;
      const imgHeight = 80;
      
      this.doc.addImage(imageDataUrl, 'PNG', this.margin, this.currentY, imgWidth, imgHeight);
      this.currentY += imgHeight + 10;
    } catch (error) {
      console.error('Error adding image to PDF:', error);
      this.addText('(Diagram image could not be included)', 10);
    }
  }

  addThreatBox(threat, index) {
    const boxHeight = 45;
    this.checkPageBreak(boxHeight);

    // Background color based on severity
    const colors = {
      'CRITICAL': [211, 47, 47],
      'HIGH': [245, 124, 0],
      'MEDIUM': [251, 192, 45],
      'LOW': [56, 142, 60]
    };

    const severity = threat.severity?.toUpperCase() || 'MEDIUM';
    const color = colors[severity] || colors.MEDIUM;

    // Draw box border
    this.doc.setDrawColor(color[0], color[1], color[2]);
    this.doc.setLineWidth(0.5);
    this.doc.rect(this.margin, this.currentY - 5, 170, boxHeight);

    // Threat number and title
    this.doc.setFontSize(12);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(40, 40, 40);
    this.doc.text(`${index}. ${threat.title || 'Untitled Threat'}`, this.margin + 3, this.currentY);

    // Severity badge
    this.doc.setFillColor(color[0], color[1], color[2]);
    const badgeX = 180;
    this.doc.roundedRect(badgeX - 30, this.currentY - 8, 28, 6, 2, 2, 'F');
    this.doc.setFontSize(8);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text(severity, badgeX - 28, this.currentY - 4);

    this.currentY += 7;

    // Category
    this.doc.setFontSize(9);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(80, 80, 80);
    this.doc.text('Category: ', this.margin + 3, this.currentY);
    this.doc.setFont(undefined, 'normal');
    this.doc.text(threat.category || 'N/A', this.margin + 20, this.currentY);

    this.currentY += 6;

    // Description
    this.doc.setFontSize(9);
    this.doc.setFont(undefined, 'normal');
    this.doc.setTextColor(60, 60, 60);
    const descLines = this.doc.splitTextToSize(threat.description || 'No description', 160);
    descLines.slice(0, 3).forEach(line => {
      this.doc.text(line, this.margin + 3, this.currentY);
      this.currentY += 5;
    });

    // Affected components
    if (threat.affected_components && threat.affected_components.length > 0) {
      this.currentY += 2;
      this.doc.setFontSize(8);
      this.doc.setFont(undefined, 'bold');
      this.doc.text('Affected: ', this.margin + 3, this.currentY);
      this.doc.setFont(undefined, 'normal');
      const components = threat.affected_components.join(', ');
      const compLines = this.doc.splitTextToSize(components, 150);
      this.doc.text(compLines[0], this.margin + 17, this.currentY);
    }

    this.currentY += 12;
  }

  generateReport(results) {
    this.doc = new jsPDF();
    this.currentY = 20;

    // Header
    this.addTitle('Resultado da análise STRIDE');
    this.addSpace(3);
    
    // System info
    this.addBoldText('Sistema: ', results.system_name || 'Sistema não reconhecido');
    this.addBoldText('Gerado: ', new Date().toLocaleString());
    this.addLine();
    this.addSpace(3);

    // Summary
    this.addSubtitle('Resumo');
    this.addText(results.summary || 'Sem resumo disponível.');
    this.addSpace(5);

    // Architecture Diagram
    if (results.diagram_image) {
      this.addSubtitle('Diagrama de Arquitetura');
      this.addImage(results.diagram_image);
      this.addSpace(5);
    }

    // Architecture Description
    if (results.architecture?.description) {
      this.addSubtitle('Apresentação da Arquitetura');
      this.addText(results.architecture.description);
      this.addSpace(5);
    }

    // Components
    if (results.architecture?.components && results.architecture.components.length > 0) {
      this.addSubtitle('Componentes do Sistema');
      
      const componentData = results.architecture.components.map(comp => [
        comp.name || 'Desconhecido',
        comp.type || 'N/A',
        comp.description || 'Sem descrição'
      ]);

      autoTable(this.doc, {
        startY: this.currentY,
        head: [['Component', 'Type', 'Description']],
        body: componentData,
        theme: 'grid',
        headStyles: {
          fillColor: [102, 126, 234],
          textColor: 255,
          fontSize: 10,
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 9,
          cellPadding: 3
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 30 },
          2: { cellWidth: 90 }
        },
        margin: { left: this.margin }
      });

      this.currentY = this.doc.lastAutoTable.finalY + 10;
      this.addSpace(5);
    }

    // Threats
    if (results.threats && results.threats.length > 0) {
      this.doc.addPage();
      this.currentY = 20;
      
      this.addTitle('Falhas de Segurança identificadas', 18);
      this.addSpace(5);

      // Threat summary
      const critical = results.threats.filter(t => t.severity?.toUpperCase() === 'CRITICAL').length;
      const high = results.threats.filter(t => t.severity?.toUpperCase() === 'HIGH').length;
      const medium = results.threats.filter(t => t.severity?.toUpperCase() === 'MEDIUM').length;
      const low = results.threats.filter(t => t.severity?.toUpperCase() === 'LOW').length;

      this.addText(`Total de falhas: ${results.threats.length} | Critical: ${critical} | High: ${high} | Medium: ${medium} | Low: ${low}`, 10);
      this.addLine();
      this.addSpace(5);

      // Individual threats
      results.threats.forEach((threat, index) => {
        this.addThreatBox(threat, index + 1);
      });
    }

    // Mitigations (detailed)
    if (results.threats && results.threats.length > 0) {
      this.doc.addPage();
      this.currentY = 20;
      
      this.addTitle('Recomendações de Migração', 18);
      this.addSpace(5);

      results.threats.forEach((threat, index) => {
        if (threat.mitigation) {
          this.checkPageBreak(25);
          
          this.addSubtitle(`${index + 1}. ${threat.title}`, 12);
          this.addText(threat.mitigation, 10);
          this.addSpace(5);
        }
      });
    }

    // Footer on all pages
    const pageCount = this.doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);
      this.doc.setTextColor(150, 150, 150);
      this.doc.text(
        `Página ${i} de ${pageCount}`,
        this.doc.internal.pageSize.width / 2,
        this.doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
      this.doc.text(
        'Gerado por STRIDE Analyser',
        this.doc.internal.pageSize.width - this.margin,
        this.doc.internal.pageSize.height - 10,
        { align: 'right' }
      );
    }

    return this.doc;
  }

  downloadReport(results, filename) {
    const doc = this.generateReport(results);
    const sanitizedFilename = filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    doc.save(`stride_analysis_${sanitizedFilename}_${Date.now()}.pdf`);
  }
}

const pdfGenerator = new PDFGenerator();
export default pdfGenerator;
