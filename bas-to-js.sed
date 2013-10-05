#!/bin/sed -f

# Version 1: converts to a series of arrays, very similar to the original Basic code.
#s/(/[/g
#s/)/]/g
#s/:/;/g
#s/;\? *$/;/

# Version 2: converts to an Array of objects, using JavaScript notation.
s/:/,/g
s/([0-9]\+) = /: /g
s/^/{ /
s/ *$/ } ,/

# Remember to remove the comma from the last line.

# Tip: After running this, run the following command in Vim:
# :Tabularize /,
