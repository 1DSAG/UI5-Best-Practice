import * as fs from "fs";
import { mdToPdf } from "md-to-pdf";
import * as path from "path";
export class MarkdownFile {
  // define the properties
  private _frontMatter: { [id: string]: string };
  private _fileNameWithExt: string = "";
  private _fileNameWithoutExt: string = "";
  private _filePath: string;
  private _fileContent: string = "";
  private _metaParent: string = "";
  private _metaTitle: string = "";
  private _metaHasChildren: boolean = false;
  private _metaNavOrder: number = 0;
  private _pdfOutputPath: string;
  public sortOrder: number = -1;
  // define the methods
  constructor(filePath: string, pdfOutputPath: string = "") {
    this._fileNameWithExt = filePath.split("/").slice(-1)[0];
    this._fileNameWithoutExt = path.parse(this._fileNameWithExt).name;
    this._filePath = filePath;
    this._frontMatter = this._getFrontMatter(filePath);
    this._readFrontMatter();
    this._pdfOutputPath = pdfOutputPath;
  }

  public async createPDF(pdfOutputPath: string = this._pdfOutputPath) {
    const pdf = await mdToPdf({ path: this._filePath }).catch(console.error);
    if (pdf) {
      fs.writeFileSync(
        `${pdfOutputPath}${this.sortOrder}_${this._fileNameWithoutExt}.pdf`,
        pdf.content
      );
    }
  }

  private _readFrontMatter() {
    // if title in dict set to _metaTitle
    if (this._frontMatter.title) {
      this._metaTitle = this._frontMatter.title;
    }
    // if parent in dict set to _metaParent
    if (this._frontMatter.parent) {
      this._metaParent = this._frontMatter.parent;
    }
    // if has_children in dict set to _metaHasChildren
    if (this._frontMatter.has_children) {
      if (this._frontMatter.has_children === "true") {
        this._metaHasChildren = true;
      } else {
        this._metaHasChildren = false;
      }
    }
    // if nav_order in dict set to _metaNavOrder
    if (this._frontMatter.nav_order) {
      this._metaNavOrder = parseInt(this._frontMatter.nav_order);
    }
  }

  private _getFrontMatter(filePath: string) {
    const content = fs.readFileSync(filePath, "utf8");
    this._fileContent = content;
    const frontMatter = content.split("---")[1];
    // parse string line breaks to array
    const frontMatterArray = frontMatter.split("\n");
    // remove empty lines
    const frontMatterArrayCleaned = frontMatterArray.filter(
      (line) => line !== ""
    );
    // remove lines smaller then 3 chars
    const frontMatterArrayCleaned2 = frontMatterArrayCleaned.filter(
      (line) => line !== '\r'
    );
    // remove lines starting with #
    const frontMatterArrayCleaned3 = frontMatterArrayCleaned2.filter(
      (line) => !line.startsWith("#")
    );
    console.log(frontMatterArrayCleaned3)
    // parse array from strings split by to dict:
    const frontMatterDict = frontMatterArrayCleaned3.reduce((acc, curr) => {
      try {
        const [key, value] = curr.split(":");
        acc[key.trim()] = value.trim();
      } catch (error) {
        console.log(`ERROR on filepath: ${filePath}`);
      }

      return acc;
    }, {} as { [id: string]: string });
    console.log(frontMatterDict)
    return frontMatterDict;
  }

  // create getters
  get frontMatter(): { [id: string]: string } {
    return this._frontMatter;
  }
  get filenameWithoutExt(): string {
    return this._fileNameWithoutExt;
  }
  get fileNameWithExt(): string {
    return this._fileNameWithExt;
  }
  get filePath(): string {
    return this._filePath;
  }
  get fileContent(): string {
    return this._fileContent;
  }
  get metaParent(): string {
    return this._metaParent;
  }
  get metaTitle(): string {
    return this._metaTitle;
  }
  get metaHasChildren(): boolean {
    return this._metaHasChildren;
  }
  get metaNavOrder(): number {
    return this._metaNavOrder;
  }
  get pdfOutputPath(): string {
    return this._pdfOutputPath;
  }
  set pdfOutputPath(value: string) {
    this._pdfOutputPath = value;
  }
}
