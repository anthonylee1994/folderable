import * as vscode from "vscode";
import { toggleFolderize } from "./commands/folderize";

export const activate = (context: vscode.ExtensionContext) => {
  const folderizeCommand = vscode.commands.registerCommand(
    "folderable.folderize",
    toggleFolderize
  );

  context.subscriptions.push(folderizeCommand);
};

// this method is called when your extension is deactivated
export function deactivate() {}
