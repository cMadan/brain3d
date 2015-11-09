mg=/Users/chris/Documents/Research/imaging/resources/meshgeometry/meshgeometry_mac
ml=/Applications/meshlab.app/Contents/MacOS/meshlabserver
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