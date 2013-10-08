#!/bin/sed -f

/<script src="svgclasslist.js" defer async><\/script>/ {
s/.*//
a\
<script>
r svgclasslist.js
a\
</script>
}

/<script src="laje.js" defer async><\/script>/ {
s/.*//
a\
<script>
r laje.js
a\
</script>
}

/<script src="laje-ui.js" defer async><\/script>/ {
s/.*//
a\
<script>
r laje-ui.js
a\
</script>
}

/<link rel="stylesheet" type="text\/css" href="laje.css">/ {
s/.*//
a\
<style type="text/css">
r laje.css
a\
</style>
}
