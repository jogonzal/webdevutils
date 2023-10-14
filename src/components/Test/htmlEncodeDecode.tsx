export const encodeHTMLEntities = (text: string) => {
  const textArea = document.createElement('textarea');
  textArea.innerText = text;
  let encodedOutput = textArea.innerHTML;
  const arr = encodedOutput.split('<br>');
  encodedOutput = arr.join('\n');
  return encodedOutput;
}

export const decodeHtml = (html: string) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}
