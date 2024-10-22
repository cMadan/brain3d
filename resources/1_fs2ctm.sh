# https://github.com/r03ert0/meshgeometry
mg=/Users/chris/Documents/Research/imaging/resources/meshgeometry/meshgeometry_mac
# http://meshlab.sourceforge.net/
ml=/Applications/meshlab.app/Contents/MacOS/meshlabserver
# path to SUBJECTS_DIR
subdir=/Users/chris/Documents/Research/imaging/calcFD/brain3d_dev/

find $subdir -name *.white| while read f; do
	$mg -i $f -centre -o $f.ply
	$ml -i $f.ply -o $f.ctm
	rm $f.ply
done

# need to (manually) clean directory first, otherwise there are other *.pial files that are irrelevant
find $subdir -name *.pial| while read f; do
	$mg -i $f -centre -o $f.ply
	$ml -i $f.ply -o $f.ctm
	rm $f.ply
done