import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

const folderize = (originalFilePath: string) => {
  try {
    const extensionName = path.extname(originalFilePath);
    const fileName = path.basename(originalFilePath, extensionName);

    const newDirectoryPath = path.join(originalFilePath, "..", fileName);
    const newFilePath = path.join(
      newDirectoryPath,
      `index${extensionName || ""}`
    );

    if (
      fs.existsSync(newDirectoryPath) &&
      fs.statSync(newDirectoryPath).isDirectory()
    ) {
      vscode.window.showErrorMessage(
        `There is already a folder with the same name "${fileName}" in "${newDirectoryPath}".`
      );
      return;
    }

    fs.mkdirSync(newDirectoryPath);
    fs.writeFileSync(newFilePath, fs.readFileSync(originalFilePath));
    fs.unlinkSync(originalFilePath);
  } catch (error) {
    vscode.window.showErrorMessage(`Unexpected Error occurred, ${error}`);
  }
};

export const unfolderize = (originalFolderPath: string) => {
  try {
    const originalDirectoryName = path.basename(originalFolderPath);

    // get directory files
    const files = fs.readdirSync(originalFolderPath);

    const isAllFiles = files.every((x) =>
      fs.statSync(path.join(originalFolderPath, x)).isFile()
    );

    if (!isAllFiles) {
      vscode.window.showErrorMessage(
        `There are some sub-directories in the folder "${originalDirectoryName}"`
      );
      return;
    }

    if (files.length > 1) {
      vscode.window.showErrorMessage(
        `There are more than one file in the folder "${originalDirectoryName}". So, it can't be unfolded.`
      );
      return;
    }

    const firstFileExtension = path.extname(files[0]);

    const newFilePath = path.join(
      originalFolderPath,
      "..",
      `${originalDirectoryName}${firstFileExtension || ""}`
    );
    const firstFilePath = path.join(originalFolderPath, files[0]);
    const firstFileData = fs.readFileSync(firstFilePath);

    if (fs.existsSync(newFilePath) && fs.statSync(newFilePath).isFile()) {
      vscode.window.showErrorMessage(
        `There is already a file with the same name "${originalDirectoryName}${
          firstFileExtension || ""
        }" in "${path.dirname(newFilePath)}".`
      );
      return;
    }

    fs.writeFileSync(newFilePath, firstFileData);
    fs.unlinkSync(firstFilePath);
    fs.rmdirSync(originalFolderPath);
  } catch (error) {
    vscode.window.showErrorMessage(`${JSON.stringify(error)}`);
  }
};

export const toggleFolderize = (params: { path: string }) => {
  const isDirectory = fs.statSync(params.path).isDirectory();

  if (isDirectory) {
    unfolderize(params.path);
  } else {
    folderize(params.path);
  }
};
