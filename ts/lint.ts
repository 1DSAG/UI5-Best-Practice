import * as fs from "fs";
import * as path from "path";

class Lint {
  private _error: boolean = false;

  main() {
    this.checkFileEnding();
    if (this._error) {
      process.exit(1);
    }
  }

  checkFileEnding() {
    // loop over docs folder
    const files = fs.readdirSync("./docs");
    for (const file of files) {
      // check if file ends with markdown
      if (file.endsWith(".markdown")) {
        console.log(`${file} has wrong file ending`);
        this._error = true;
      }
    }
  }
}
const lint = new Lint();
lint.main();
