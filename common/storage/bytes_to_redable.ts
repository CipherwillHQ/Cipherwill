export const bytesToReadable = (bytes: number) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === undefined || bytes === null || bytes === 0) return "0 Byte";
  const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));
  if (i === 0) return `${bytes} ${sizes[i]}`;
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
};
