import { AlignmentType, TabStopPosition, TabStopType } from "docx";
import * as docx from "docx";

class DocBuilder {
  buildCenteredLine(message) {
    var line = new docx.Paragraph({
      alignment: docx.AlignmentType.CENTER,
      children: [
        new docx.TextRun(
          message
        ),
      ],
    });
    return line;
  }


}

export const docBuilder = new DocBuilder();