import { mdToPdf } from "md-to-pdf";
import * as fs from "fs";
import * as path from "path";
import { PDFDocument } from "pdf-lib";
import { MarkdownFile } from "./MarkdownFile";

class PDF {
  // get markdown files for following folders
  private _array: string[] = [
    "./docs/deployment",
    "./docs/design-guidelines",
    "./docs/error-handling",
    "./docs/fiori-elements-vs-freestyle",
    "./docs/i18n",
    "./docs/mvc",
    "./docs/nc",
    "./docs/odata",
    "./docs/performance",
    "./docs/ressource-collection",
    "./docs/testing",
  ];
  private _mainDictionary: { [id: string]: MarkdownFile } = {};
  constructor() {}

  async main() {
    // create tmp dir for pdfs
    console.log("create tmp dir");
    if (!fs.existsSync("./tmp")) {
      fs.mkdirSync("./tmp");
    }
    console.log("createMainDictionary");
    await this.createMainDictionary();
    console.log("defineSortOrder");
    await this.defineSortOrder();
    console.log("createPDFs");
    await this.createPDFs();
    console.log("merge");
    await this.merge();
    console.log("remove tmp");
    fs.rmdirSync("./tmp", { recursive: true });
  }

  async createMainDictionary() {
    // create main dictionary
    this._mainDictionary["./docs/index.md"] = new MarkdownFile(
      "./docs/index.md",
      "./tmp/"
    );
    fs.readdirSync('./').forEach(file => {
      console.log(file);
    });
    for (const folder of this._array) {
      const files = await fs.promises.readdir(folder);
      for (const file of files) {
        if (file.endsWith(".md") || file.endsWith(".markdown")) {
          const filename = path.parse(file).name;
          // console.log(`${folder}/${file}`);
          const readPath = `${folder}/${file}`;
          this._mainDictionary[readPath] = new MarkdownFile(readPath, "./tmp/");
        }
      }
    }
  }

  async defineSortOrder() {
    for (const key in this._mainDictionary) {
      const value = this._mainDictionary[key];
      if (value.filenameWithoutExt.endsWith("index")) {
        value.sortOrder = value.metaNavOrder * 10;
      }
    }
    for (const key in this._mainDictionary) {
      const value = this._mainDictionary[key];
      if (!value.filenameWithoutExt.endsWith("index")) {
        // find in _mainDictionary all objects with the same parent
        const parent = value.metaParent;
        const parentObjects = Object.values(this._mainDictionary).filter(
          (obj) => obj.metaTitle === parent
        );
        for (const parentObject of parentObjects) {
          value.sortOrder = value.metaNavOrder + parentObject.sortOrder;
        }
      }
    }
    for (const key in this._mainDictionary) {
      const value = this._mainDictionary[key];
      console.log(`${value.filePath} ${value.sortOrder}`);
    }
  }

  async createPDFs() {
    // sort _mainDictionary by sortOrder
    const sortedDictionary = Object.values(this._mainDictionary).sort(
      (a, b) => a.sortOrder - b.sortOrder
    );
    for (const key in sortedDictionary) {
      const file = sortedDictionary[key];
      await file.createPDF();
    }
  }

  async createPDF(pathToMd: string, output: string) {
    const pdf = await mdToPdf({ path: pathToMd }).catch(console.error);
    if (pdf) {
      fs.writeFileSync(output, pdf.content);
    }
  }

  async merge() {
    const array = await this.buildPDFArray();
    const merged = await this.mergePDFDocuments(array);
    fs.writeFileSync("UI5 Best Practice Guide.pdf", merged);
  }

  async buildPDFArray() {
    let array: Array<PDFDocument> = [];
    const files = await fs.promises.readdir("./tmp");
    for (const file of files) {
      const pdfbytes = fs.readFileSync(`./tmp/${file}`);
      const document = await PDFDocument.load(pdfbytes);
      array.push(document);
    }
    return array;
  }

  async mergePDFDocuments(documents: Array<PDFDocument>) {
    const mergedPdf = await PDFDocument.create();

    for (let document of documents) {
      const copiedPages = await mergedPdf.copyPages(
        document,
        document.getPageIndices()
      );
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    return await mergedPdf.save();
  }
}

const pdf = new PDF();
pdf.main();
