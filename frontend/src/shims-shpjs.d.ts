declare module 'shpjs' {
  const shp: (input: string | ArrayBuffer | Blob) => Promise<any>;
  export = shp;
}
