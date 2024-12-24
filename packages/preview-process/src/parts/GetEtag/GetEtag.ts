export const getEtag = (fileStat: any): string => {
  return `W/"${[fileStat.ino, fileStat.size, fileStat.mtime.getTime()].join('-')}"`
}
