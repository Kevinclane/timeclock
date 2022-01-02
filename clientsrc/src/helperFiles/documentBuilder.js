import { AlignmentType, TabStopPosition, TabStopType } from "docx";
import * as docx from "docx";

const tabStopsCenter = [
  {
    type: TabStopType.CENTER,
    position: 4513,
  },
]
const tabStopsCenterAndRight = [
  {
    type: TabStopType.CENTER,
    position: 4513,
  },
  {
    type: TabStopType.RIGHT,
    position: 7500,
  },
];
const borderBottom = {
  bottom: {
    color: "auto",
    space: 1,
    value: "single",
    size: 6,
  },
};

class DocBuilder {



  buildCenteredLine(message) {
    return new docx.Paragraph({
      alignment: docx.AlignmentType.CENTER,
      children: [
        new docx.TextRun(
          message
        ),
      ],
    });
  }

  buildWeekOfTitle(message) {
    return new docx.Paragraph({
      children: [
        new docx.TextRun(message),
      ],
      tabStops: tabStopsCenter
    });
  }

  buildServiceTitleLine() {
    return new docx.Paragraph({
      children: [
        new docx.TextRun({ text: "Date", bold: true }),
        new docx.TextRun({ text: "\tService", bold: true }),
        new docx.TextRun({ text: "\t\tHours", bold: true }),
      ],
      tabStops: tabStopsCenterAndRight,
      border: borderBottom
    })
  }

  buildServiceLine(date, service, hours) {
    return new docx.Paragraph({
      children: [
        new docx.TextRun(`${date}`),
        new docx.TextRun(`\t${service}`),
        new docx.TextRun(`\t\t${hours}`),
      ],
      tabStops: tabStopsCenterAndRight
    })
  }

  buildEOWLine(hours) {
    return new docx.Paragraph({
      children: [
        new docx.TextRun(`EOW Total: ${hours}`),
      ],
      alignment: AlignmentType.RIGHT
    })
  }

  newLine() {
    return new docx.Paragraph({ text: " " });
  }

  newLineWithBottomBorder() {
    return new docx.Paragraph({
      children: [
        new docx.TextRun(``),
        new docx.TextRun(``),
        new docx.TextRun(``),
      ],
      tabStops: tabStopsCenterAndRight,
      border: borderBottom
    })
  }



}

export const docBuilder = new DocBuilder();