export const getQueId = (url: string): number => {
	return parseInt(url.match(/\d/g).join(""), 10);
};
