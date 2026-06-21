declare const luzAstro: (config: any) => {
  name: string;
  hooks: {
    "astro:server:setup": () => void | Promise<void>;
  };
};
export { luzAstro };
