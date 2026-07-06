declare const luzAstro: (config: any) => {
	name: string;
	hooks: {
		"astro:build:done": () => void | Promise<void>;
	};
};
export { luzAstro };
