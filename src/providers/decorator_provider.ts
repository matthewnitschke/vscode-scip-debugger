import * as vscode from "vscode";
import * as scip from "../models";
import { convertSCIPRange, findSCIPDoc } from "../utils";

const decoration = vscode.window.createTextEditorDecorationType({
  borderWidth: '0 0 2px 0', // top, right, bottom, left
  borderStyle: 'solid',
  borderColor: 'yellow'
});

export class SCIPDecoratorProvider {
  scipData: scip.Index | undefined;

  constructor() {
    vscode.window.onDidChangeActiveTextEditor(this.applyDecorations);
  }

  applyDecorations(editor: vscode.TextEditor | undefined) {
    if (!editor) return;

    let doc = findSCIPDoc(editor.document, this.scipData)

    let ranges = doc?.occurrences.map((occ) => convertSCIPRange(occ.range)) ?? []
    editor.setDecorations(decoration, ranges);
  }
}
