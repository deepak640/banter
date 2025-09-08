const generateFilePath = (fileName: string) => {
  return `${process.env.NEXT_PUBLIC_BASE_URL}/public/uploads/${fileName}`;
}
export default generateFilePath;
