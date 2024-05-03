export default function generateMessage(message: string, username?: string) {
  return {
    text: message,
    username: username,
    createdAt: new Date().getTime(),
  };
}
