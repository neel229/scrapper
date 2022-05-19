// check if the given url is
// a valid stackoverflow question url
export const checkURL = (url: string): boolean => {
    const queURL = "https://stackoverflow.com/questions"
    const regex = new RegExp(
        "^(https:\\/\\/stackoverflow\\.com\\/questions)",
        "gm"
    );
    const res = regex.exec(url);
    if (res !== null && res[0] === queURL) return true;
    return false;
}

