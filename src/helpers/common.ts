export const sanitizeString = (str: string): string => {
	return str.replaceAll(/[.,?—!:;]/g,'').toLowerCase()
}

export const isObjectEmpty = (objectName: unknown) => {
  return JSON.stringify(objectName) === "{}";
}
