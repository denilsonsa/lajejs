#!/bin/sed -f
#
# Converts the tables from the QBasic code into a neat JavaScript table (an
# Array of objects). Some manual fixing is still needed after this script.

s/[ \r]\+$//

# Version 1: converts to a series of arrays, very similar to the original Basic code.
#s/(/[/g
#s/)/]/g
#s/:/;/g
#s/;\? *$/;/

# Version 2: converts to an Array of objects, using JavaScript notation.
s/:/,/g
# .5 -> 0.5
s/ = \(\.[0-9]\)/ = 0\1/g
# 0.5 -> 0.50
s/\( = [0-9]\.[0-9]\),/\10,/g
s/([0-9]\+) = /: /g
s/: 1, /: 1.00, /g
s/: 2, /: 2.00, /g
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
