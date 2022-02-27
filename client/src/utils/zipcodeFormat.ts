function zipcodeFormat(zipcode: string) {
  if (zipcode) {
    return zipcode.slice(0, 5) + "-" + zipcode.slice(-3);
  }
}

export default zipcodeFormat;
