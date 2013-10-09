#!/bin/sed -f
# Works on GNU sed 4.2.1.
#
# Reads the plaintext output of QBasic code (which was modified by
# bas-annotator.sed) and transforms into a JSON format.

s/[\r ]\+$//

s|Laje tipo \([0-9]\+\)\.|},\n{\n  tipo: \1,|
s|a,b,q = \([0-9.]\+\),\([0-9.]\+\),\([0-9.]\+\)|  a: \1,\n  b: \2,\n  q: \3,|
/^[abq] =/d

# Removing % sign next to a number.
s|%\(-\?[0-9.]\+\)|\1|

# \L is a GNU extension to transform to lower-case.
s|^\([a-zA-Z0-9]\+\) *= *\o361\? *\(-\?[0-9.]\+\) tf.*|  \L\1: \2,|

s|^Obs: (\([ab/]\+\)) = *\([0-9.]\+\)|  relacao: "\1",\n  razao: "\2",|
s|Os valores.*) = *\([0-9.]\+\).|  limite: "\1",|

$a\
}
