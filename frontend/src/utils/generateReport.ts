// src/utils/reportUtils.ts
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Type definitions
interface ReservationTotals {
  combinedTotal: number;
  eventCount: number;
  groupCount: number;
}

interface ReservationStats {
  eventStats: {
    pending: number;
    notPaid: number;
    partiallyPaid: number;
  };
  groupStats: {
    pending: number;
    notPaid: number;
  };
}

interface MonthlyUser {
  _id: string;
  count: number;
}

export const generateReport = (
  reservationTotals: ReservationTotals,
  reservationStats: ReservationStats,
  totalUsers: number,
  monthlyUsers: MonthlyUser[],
): boolean => {
  try {
    // Initialize jsPDF
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Set default font
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;

    // Header Section
    doc.setFillColor(41, 128, 185);
    doc.rect(margin, 10, 10, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("R", margin + 3.5, 17);

    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185);
    doc.text("Reservation Analytics Report", margin + 16, 20);

    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${formattedDate}`, margin + 16, 30);

    // Metric boxes
    const metrics = [
      { label: "TOTAL USERS", value: totalUsers, x: 20, color: [52, 152, 219] },
      {
        label: "RESERVATIONS",
        value: reservationTotals.combinedTotal,
        x: 80,
        color: [46, 204, 113],
      },
      {
        label: "EVENTS",
        value: reservationTotals.eventCount,
        x: 140,
        color: [155, 89, 182],
      },
    ];

    metrics.forEach((metric) => {
      doc.setFillColor(metric.color[0], metric.color[1], metric.color[2]);
      doc.rect(metric.x - 5, 45, 50, 20, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text(metric.label, metric.x, 52);
      doc.setFontSize(14);
      doc.text(metric.value.toString(), metric.x, 60);
    });

    // Reservation Details Table
    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text("RESERVATION DETAILS", margin, 85);

    autoTable(doc, {
      startY: 90,
      head: [["Category", "Pending", "Not Paid", "Partially Paid"]],
      body: [
        [
          "Events",
          reservationStats.eventStats.pending.toString(),
          reservationStats.eventStats.notPaid.toString(),
          reservationStats.eventStats.partiallyPaid.toString(),
        ],
        [
          "Groups",
          reservationStats.groupStats.pending.toString(),
          reservationStats.groupStats.notPaid.toString(),
          "N/A",
        ],
      ],
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      margin: { left: margin },
      theme: "grid",
    });

    // Monthly User Trends
    const firstTableEnd = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text("MONTHLY USER TRENDS", margin, firstTableEnd + 15);

    autoTable(doc, {
      startY: firstTableEnd + 20,
      head: [["Month", "Users"]],
      body: monthlyUsers.map((user) => [user._id, user.count.toString()]),
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      margin: { left: margin },
      theme: "grid",
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("© Reservation System Report", margin, finalY + 10);

    doc.save("reservation-report.pdf");
    return true;
  } catch (error) {
    console.error("Error generating report:", error);
    return false;
  }
};
