const truncate = (og: string, length: number) => {
    const str = copyString(og);
    return str.length < length ? str : str.slice(0, length) + "..."
}

const copyString = (str: string) => {
    return (' ' + str).slice(1);
}


export default truncate;