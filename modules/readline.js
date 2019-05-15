const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

class ReadLine {
  static askQuestion(question) {
    return new Promise((res, rej) => {
      readline.question(question, answer => {
        res(answer);
      });
    });
  }

  static chooseOne(question, variants) {
    // Variants list
    let variantsString = "";

    variants.map((value, index) => {
      variantsString += `${index}.${value}\n`;
    });

    return new Promise((res, rej) => {
      readline.question(`${question}\n${variantsString}`, answer => {
        // If wrong answer return same function
        if (!Number.isInteger(parseInt(answer))) {
          readline.write("!!!Please enter integer\n");
          res(this.chooseOne(question, variants));
        }

        if (answer > variants.length - 1 || answer < 0) {
          readline.write("!!!Invalid number\n");
          res(this.chooseOne(question, variants));
        }

        res(answer);
      });
    });
  }
}

module.exports = ReadLine;
