export default function stringParser(str) {
  // Check if string contains only digits
  if (/^\d+$/.test(str)) {
    return parseInt(str);
  } else {
    return str;
  }
}
