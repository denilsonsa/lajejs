#!/bin/sed -sf
# Works on GNU sed 4.2.1.

# Removing useless cruft.
s|LOCATE [0-9]\+, *[0-9]\+ *:\? *||g
s|PRINT "Unidade: [metrof/]\+";\? *:\? *||g
s/[ \r]\+$//

# Adding a command at the end to make the program loop.
$a\
GOTO 1

# Deleting useless lines.
/^CLEAR$/d
/^SCREEN 12$/d
/^GOSUB 50000$/d
/^PRINT "[abq]"$/d
/DESENHO/d
/LINE/d
/CIRCLE/d
/para outro tipo de laje/d
/MENULAJE\.BAS/d
/CABECALHO/,$ d

# Cleaning the input code.
/INPUT/,/^$/ {
	/^$/ {
		s|.*|INPUT "a,b,q = ", A, B, Q\nIF A = 0 THEN SYSTEM\n\n|
		p
	}
	d
}

# Uncomment this to generate a valid .BAS output.
# It will "branch" to the end of the script, effectively skipping the next
# lines of sed code.
#b

# Finding linearInterp() usages.
s|\([A-Z0-9]\+\) = \([A-Z0-9]\+\)(I - 1) + (\2(I) - \2(I - 1)) \* (\([A / B]\+\) - \([A-Z0-9]\+\)(I - 1)) / (\4(I) - \4(I - 1))|'\1 = linearInterp(\3, \2[i-1], \2[i], \4[i-1], \4[i]);|

# Finding tableLookup() usages.
/^IF [AB/ ]\+ < [ASB]\+MIN/,/^$/ {

	# If the first line, let's clear the hold buffer.
	# Not needed, as it should start empty.
	#/^IF [AB/ ]\+ < [ASB]\+MIN/ {
	#	x
	#	s/.*//
	#	x
	#}

	# Append to the hold buffer.
	H

	# Last line, let's clear the hold buffer and process the multi-line block
	# in the pattern buffer.
	/^$/ {
		s/.*//
		x

		# Heck! This Regex is huge and ugly and fragile!
		# \1 A / B or B / A
		# \2 ASB or BSA
		# \3 table_name
		# \4 GOTO number end of the block
		# \5 loop max value
		# \6 GOTO number to NEXT I
		# \7 linearInterp line
		# \8 after-loop command
		# \9 after-block command
		s|IF \([AB] / [AB]\) < \([ABS]\+\)MIN THEN \([A-Z0-9]\+\) = \3(0): GOTO \([0-9]\+\)\nFOR I = 2 TO \([0-9]\+\)\nIF \2(I) < \1 THEN \([0-9]\+\)\n\([^\n]\+\)\nGOTO \4\n\6 NEXT I\n\([^\n]*\)\n\?\4 *\([^\n]*\)|'\3 = tableLookup(\2, '\2', '\3', \1);\n'  Using \7\n'  If beyond \5: \8\n\9|g

		p
	}
	d
}
