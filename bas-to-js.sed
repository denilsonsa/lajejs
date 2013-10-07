#!/bin/sed -f

s/[ \r]\+$//

# Version 1: converts to a series of arrays, very similar to the original Basic code.
#s/(/[/g
#s/)/]/g
#s/:/;/g
#s/;\? *$/;/

# Version 2: converts to an Array of objects, using JavaScript notation.
s/:/,/g
s/ = \(\.[0-9]\)/ = 0\1/g
s/\( = [0-9]\.[0-9]\),/\10,/g
s/([0-9]\+) = /: /g
s/^/{ /
s/ *$/ } ,/

# To lowercase:
y/ABCDEFGHIJKLMNOPQRSTUVWXYZ/abcdefghijklmnopqrstuvwxyz/
# Or, as a GNU sed extension:
# s/\(.*\)/\L\1/

# Removing the comma from the last line.
$ s/ ,$//

# Tip: After running this, run the following command in Vim:
# :Tabularize /[:,]/r0c1
