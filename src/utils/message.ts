export default function generateMessage(message: string) {
  return {
    text: message,
    createdAt: new Date().getTime(),
  };
}
