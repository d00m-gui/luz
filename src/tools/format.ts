export function formatCSS(s: string) {
	return s
		.replace(/>[\r\n ]+</g, "")
		.replace(/(<.*?>)|\s+/g, (m, $1) => ($1 ? $1 : " ")) // Replace multiple spaces/newlines with a single space
		.trim(); // Trim leading/trailing spaces
}
