import convert from 'color-convert';
const isPlainObject = (val: any) => typeof val === 'function' || typeof val === 'object';
const getRGB = (str: string) => {
  const match = str.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
  return match ? [+match[1], +match[2], +match[3]] : [0, 0, 0];
};
const getCorrectTextColor = (rgb: string | (number[]) = [0, 0, 0]) => {
  /*
  From this W3C document: http://www.webmasterworld.com/r.cgi?f=88&d=9769&url=http://www.w3.org/TR/AERT#color-contrast
  Color brightness is determined by the following formula:
  ((Red value X 299) + (Green value X 587) + (Blue value X 114)) / 1000
  I know this could be more compact, but I think this is easier to read/explain.
  */
  if (typeof rgb === 'string') {
    if (rgb.indexOf('#') > -1) {
      // hex值为string
      rgb = convert.hex.rgb(rgb);
    } else {
      console.log('rgb string', rgb);
      rgb = getRGB(rgb);
      console.log('rgb converted', rgb);
    }
  }
  console.log({ rgb });

  const threshold = 130; /* about half of 256. Lower threshold equals more dark text on dark background  */
  const [hRed, hGreen, hBlue] = rgb;

  const cBrightness = (hRed * 299 + hGreen * 587 + hBlue * 114) / 1000;
  if (cBrightness > threshold) {
    return '#50616d';
  } else {
    return '#e9f1f6';
  }
};
export {
  isPlainObject,
  getCorrectTextColor,
  getRGB,
};