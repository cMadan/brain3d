# https://github.com/r03ert0/meshgeometry
mg=/Users/chris/Documents/Research/imaging/resources/meshgeometry/meshgeometry_mac
# http://vcg.isti.cnr.it/vcglib/install.html
# for some guidance on installing qmake on Mac (and others): https://github.com/thoughtbot/capybara-webkit/wiki/Installing-Qt-and-compiling-capybara-webkit
td=/Users/chris/Documents/Research/imaging/resources/vcglib/apps/tridecimator/tridecimator
# http://meshlab.sourceforge.net/
ml=/Applications/meshlab.app/Contents/MacOS/meshlabserver

find . -name *.ctm|while read f;do n=${f%.*};$ml -i $n.ctm -o $n.ply;rm $n.ctm;$td $n.ply $n.dec.ply 100000;rm $n.ply;$ml -i $n.dec.ply -o $n.ctm;rm $n.dec.ply;done