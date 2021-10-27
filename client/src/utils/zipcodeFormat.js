function zipcodeFormat(zipcode) {
  return zipcode.slice(0, 5) + "-" + zipcode.slice(-3);
}

export default zipcodeFormat;
