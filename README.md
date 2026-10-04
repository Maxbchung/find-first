# enhancedGrep

## What the tool does
enhancedGrep searches a file for a word or pattern. It prints every line that has the word, with the line number in front. At the end, it shows how many matches it found and on how many lines.

## How to run it
Make sure you have Node.js installed. Then run this in the folder where 'enhancedGrep.js' is:

node enhancedGrep.js PATTERN FILENAME

enhancedGrep combines what these Linux commands do:
- 'grep' finds lines that contain a word.
- 'grep -n' shows the line number of each match.
- 'grep -c' counts the matching lines.
