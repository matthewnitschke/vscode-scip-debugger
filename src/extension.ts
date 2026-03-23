import * as vscode from "vscode";
import { outputChannel, runCommandInShell } from "./utils";
import { SCIPHoverProvider } from "./providers/hover_provider";
import { SCIPDecoratorProvider } from "./providers/decorator_provider";
import SCIPTreeDataProvider from "./providers/tree_data_provider";
import * as path from "path";
import * as scip from "./models";

import * as fs from "fs";
import { SCIPBinaryContentProvider, SCIPCustomEditorProvider } from "./providers/editor_provider";

export function activate(context: vscode.ExtensionContext) {
  let scipIndexPath: string | undefined;
  let fileWatcher: fs.FSWatcher | undefined;
  let scipData: scip.Index | undefined;

  let hoverProvider = new SCIPHoverProvider();
  let decorationProvider = new SCIPDecoratorProvider();
  let treeDataProvider = new SCIPTreeDataProvider();

  let hasInitialized = false;

  async function applyFromFile() {
    if (!scipIndexPath) {
      vscode.window.showErrorMessage(
        "No SCIP index file found. Apply an index first"
      );
      return;
    }

    let data = await runCommandInShell(
      "scip",
      ["print", "--json", scipIndexPath],
      {
        cwd: vscode.workspace.workspaceFolders![0].uri.fsPath,
      }
    );
    scipData = JSON.parse(data);

    if (!hasInitialized) {
      hasInitialized = true;
      vscode.commands.executeCommand(
        "setContext",
        "scip-debugger.hasApplied",
        true
      );
      vscode.window.createTreeView("scip-debugger", { treeDataProvider });
      context.subscriptions.push(
        vscode.languages.registerHoverProvider(
          { scheme: "file" },
          hoverProvider
        )
      );
    }

    hoverProvider.scipData = scipData;
    decorationProvider.scipData = scipData;
    treeDataProvider.setData(scipData!);

    decorationProvider.applyDecorations(vscode.window.activeTextEditor);
  }

  context.subscriptions.push(
    vscode.commands.registerCommand("scip-debugger.apply", (uri: vscode.Uri) => {
      const applyIndex = (indexPath: string) => {
        scipIndexPath = indexPath;
        applyFromFile();

        if (fileWatcher) {
          fileWatcher.close();
        }
        fileWatcher = fs.watch(
          scipIndexPath,
          applyFromFile
        );
      };

      if (uri) {
        applyIndex(uri.fsPath);
      } else {
        vscode.window
          .showInputBox({
            title: "Enter path to SCIP index file",
            value: "./index.scip",
          })
          .then(async (res) => {
            if (!res) return;
            applyIndex(res);
          });
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("scip-debugger.showRawData", async (node) => {
      let data = node.selector(scipData);

      const doc = await vscode.workspace.openTextDocument({
        content: JSON.stringify(data, undefined, 2),
        language: "json",
      });
      await vscode.window.showTextDocument(doc, { preview: true, });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("scip-debugger.refresh", applyFromFile),

    vscode.workspace.registerTextDocumentContentProvider('scip-text', new SCIPBinaryContentProvider()),
    vscode.window.registerCustomEditorProvider('scip-debugger.binaryViewer', new SCIPCustomEditorProvider())
  );
}

export function deactivate() {}
