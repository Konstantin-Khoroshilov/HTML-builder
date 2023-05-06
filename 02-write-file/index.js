const fs = require('fs');
const { stdin, stdout, exit } = process;
const path = require('path');
const file = path.join(__dirname, 'text.txt');
const finish = () => {
  stdout.write('Вы были великолепны! Ваша мудрость запечатлена в строках файла text.txt и останется с потомками навеки.');
  exit();
};
fs.access(file, err => {
  if (err) {
    fs.writeFile(
      file,
      '',
      err => {
        if (err) throw err;
      }
    );
  }
  stdout.write('Приветствуем Вас, милостивый государь!\nИзвольте ввести в консоль Ваши глубокомысленные изречения и нажать Enter:\n');
  stdin.on('data', data => {
    const userText = data.toString();
    if (userText.trim() === 'exit') finish();
    fs.appendFile(
      file,
      userText,
      err => { if (err) throw err; }
    );
  });
});
process.on('SIGINT', () => {
  finish();
});