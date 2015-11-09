# brain3d

Online viewer of FreeSurfer surfaces and summary stats.

Originally based off of *qcsurf* [https://github.com/r03ert0/qcsurf] by Roberto Toro.

Modified into *brain3d* [https://github.com/cMadan/brain3d] by Christopher Madan. Main changes were removing database-related code and made more general purpose.

Ready to go development demo in brain3d.html, demo is viewable at [http://cmadan.github.io/brain3d/].

Brain data is from the IXI dataset [https://biomedic.doc.ic.ac.uk/brain-development/index.php?n=Main.Datasets].

# Using it with your data

In the resources folder, there are three bash scripts.

### 1_fs2ctm.sh
Converts the *.white and *.pial files from FreeSurfer to *.ctm ('Compressed Triangle Mesh'; http://openctm.sourceforge.net/). Information on installing the dependencies is included in comments, along with other relevant notes.

For the example data, I included the original FreeSurfer surfaces, but these are not needed for the online viewer to work.

### 2_ctm_reducepoly.sh
Reduces the poly count of the *.ctm files. In my experience, the resulting ctm files are approximately 40% of the size they were when output from the first script (approx 500kb / hemisphere).

### 3_getStats.sh
This doesn't need to be run after scripts 1 and 2, but it seemed less essential. This pulls from the *.aparc.stats files to compute the mean/sd for the parcellated regions.

# To do

- Currently the mean/sd stats are based on the left hemisphere. Would be more appropriate to use the respective hemisphere when displaying these stats, but, not implemented yet.

