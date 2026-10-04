const fs = require('fs');

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function fancyGrep(word, filePath, ignoreCase = false) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const pattern = new RegExp(escapeRegex(word), ignoreCase ? 'gi' : 'g');

  const results = [];
  let totalMatches = 0;

  lines.forEach((line, i) => {
    const matches = line.match(pattern);
    if (matches) {
      totalMatches += matches.length;
      results.push({ lineNumber: i + 1, text: line, pattern });
    }
  });

  return { results, totalMatches };
}

function highlight(text, pattern) {
  // Only use color codes when printing to a real terminal
  if (!process.stdout.isTTY) return text;
  return text.replace(pattern, (m) => `\x1b[1;31m${m}\x1b[0m`);
}

function main() {
  const args = process.argv.slice(2);
  const ignoreCase = args.includes('-i');
  const positional = args.filter((a) => a !== '-i');

  // Edge case: wrong number of arguments
  if (positional.length !== 2) {
    console.error('Usage: node fancyGrep.js <word> <file> [-i]');
    process.exit(1);
  }

  const [word, filePath] = positional;

  // Edge case: empty search word
  if (word.trim() === '') {
    console.error('Error: search word cannot be empty.');
    process.exit(1);
  }

  // Edge case: file does not exist
  if (!fs.existsSync(filePath)) {
    console.error(`Error: file "${filePath}" not found.`);
    process.exit(1);
  }

  // Edge case: path is a directory, not a file
  if (fs.statSync(filePath).isDirectory()) {
    console.error(`Error: "${filePath}" is a directory, not a file.`);
    process.exit(1);
  }

  const { results, totalMatches } = fancyGrep(word, filePath, ignoreCase);

  // Edge case: no matches
  if (totalMatches === 0) {
    console.log(`No matches for "${word}" in ${filePath}.`);
    return;
  }

  results.forEach(({ lineNumber, text, pattern }) => {
    console.log(`${lineNumber}: ${highlight(text, pattern)}`);
  });

  const matchWord = totalMatches === 1 ? 'match' : 'matches';
  const lineWord = results.length === 1 ? 'line' : 'lines';
  console.log(`\n${totalMatches} ${matchWord} found on ${results.length} ${lineWord}.`);
}

main();
