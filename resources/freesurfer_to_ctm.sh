mg=/Users/roberto/Applications/brainbits/m.meshgeometry/meshgeometry_mac
td=/Applications/_Graph/vcglib/apps/tridecimator/tridecimator
ml=/Applications/_Graph/meshlab-133.app/Contents/MacOS/meshlabserver

find . -name *.ctm|while read f;do n=${f%.*};$ml -i $n.ctm -o $n.ply;rm $n.ctm;$td $n.ply $n.dec.ply 100000;rm $n.ply;$ml -i $n.dec.ply -o $n.ctm;rm $n.dec.ply;done