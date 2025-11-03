// types/pdf-parse.d.ts
declare module "pdf-parse" {
  const pdfParse: (data: Uint8Array | Buffer) => Promise<{ text?: string } & Record<string, any>>;
  export = pdfParse; // CJS style export
}
