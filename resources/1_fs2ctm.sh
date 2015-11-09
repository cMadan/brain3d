mg=/Users/chris/Documents/Research/imaging/resources/meshgeometry/meshgeometry_mac
# https://github.com/r03ert0/meshgeometry
ml=/Applications/meshlab.app/Contents/MacOS/meshlabserver
# http://meshlab.sourceforge.net/
subdir=/Users/chris/Documents/Research/imaging/calcFD/brain3d_dev/

find $subdir -name *.white| while read f; do
	$mg -i $f -centre -o $f.ply
	$ml -i $f.ply -o $f.ctm
	rm $f.ply
done

find $subdir -name *.pial| while read f; do
	$mg -i $f -centre -o $f.ply
	$ml -i $f.ply -o $f.ctm
	rm $f.ply
done