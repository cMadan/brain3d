# doesn't need to be run after others, but is less critical to 'main' goal of viewing surfaces
# Run from within SUBJECT_DIR

# (1) Bash script to compute population means and standard deviations.
#
# One-liner:
# vals=( NumVert SurfArea GrayVol ThickAvg ThickStd MeanCurv GausCurv FoldInd CurvInd );for ((k=0;k<9;k++)); do filename=${vals[k]};j=$((k+2));for ((i=54;i<88;i++)); do find . -name lh.aparc.stats|while read f; do awk 'NR=='$i'{print $1,$'$j'}' $f;done|awk 'BEING{s=0;ss=0;n=0}{n=n+1;split($0,arr," ");name=arr[1];s+=arr[2];ss+=arr[2]*arr[2]}END{print name,s/n,sqrt(ss/n-s*s/n/n)}'; done|tee $filename.txt;done
#
# Human-readable:
# vals=( NumVert SurfArea GrayVol ThickAvg ThickStd MeanCurv GausCurv FoldInd CurvInd )
# for ((k=0;k<9;k++)); do
# 	filename=${vals[k]}
# 	j=$((k+2))
# 	for ((i=54;i<88;i++)); do
# 		find . -name lh.aparc.stats|while read f; do
# 			awk 'NR=='$i'{print $1,$'$j'}' $f
# 		done|awk 'BEGIN{s=0;ss=0;n=0}
# 		          {n=n+1;split($0,arr," ");name=arr[1];s+=arr[2];ss+=arr[2]*arr[2]}
# 		          END{print name,s/n,sqrt(ss/n-s*s/n/n)}'
# 	done|tee $filename.txt
# done
#
#
# (2) Now, this one it puts all values into a JSON file with all structures and measurements:
#
# Killer one-liner (to execute inside the FS directory):
# vals=( NumVert SurfArea GrayVol ThickAvg ThickStd MeanCurv GausCurv FoldInd CurvInd );echo -n "{";for ((k=0;k<9;k++)); do filename=${vals[k]};j=$((k+2));for ((i=54;i<88;i++)); do find . -name lh.aparc.stats|while read f; do awk 'NR=='$i'{print $1,$'$j'}' $f;done|awk 'BEING{s=0;ss=0;n=0}{n=n+1;split($0,arr," ");name=arr[1];s+=arr[2];ss+=arr[2]*arr[2]}END{print "'${vals[k]}'",name,s/n,sqrt(ss/n-s*s/n/n)}'; done;done|awk '{meas=$1;reg=$2;mean=$3;sd=$4;if(arr[reg])arr[reg]=arr[reg]",";arr[reg]=arr[reg]meas":{m:"mean",s:"sd"}"}END{n=0;for(i in arr)n++;j=0;for(i in arr){printf i":{"arr[i]"}";j++;if(j<n)print","}}'|sed -E 's/([a-zA-Z]+)/"\1"/g';echo "}"
#
# Human-readable:
# vals=( NumVert SurfArea GrayVol ThickAvg ThickStd MeanCurv GausCurv FoldInd CurvInd );
# echo -n "{";
#
# for ((k=0;k<9;k++)); do
#  filename=${vals[k]};j=$((k+2));
#  for ((i=54;i<88;i++)); do
# 	find . -name lh.aparc.stats
# 	|while read f; do
# 		awk 'NR=='$i'{print $1,$'$j'}' $f;
# 	done
# 	|awk 'BEING{s=0;ss=0;n=0}{n=n+1;split($0,arr," ");name=arr[1];s+=arr[2];ss+=arr[2]*arr[2]}END{print "'${vals[k]}'",name,s/n,sqrt(ss/n-s*s/n/n)}';
#  done;
# done
# |awk '{meas=$1;reg=$2;mean=$3;sd=$4;if(arr[reg])arr[reg]=arr[reg]",";arr[reg]=arr[reg]meas":{m:"mean",s:"sd"}"}END{n=0;for(i in arr)n++;j=0;for(i in arr){printf i":{"arr[i]"}";j++;if(j<n)print","}}'
# |sed -E 's/([a-zA-Z]+)/"\1"/g';
# 
# echo "}"

# generate JSON (lh-only)
# later change output population_msd _lh.json (need to change JS to match)
vals=( NumVert SurfArea GrayVol ThickAvg ThickStd MeanCurv GausCurv FoldInd CurvInd );echo -n "{";for ((k=0;k<9;k++)); do filename=${vals[k]};j=$((k+2));for ((i=54;i<88;i++)); do find . -name lh.aparc.stats|while read f; do awk 'NR=='$i'{print $1,$'$j'}' $f;done|awk 'BEING{s=0;ss=0;n=0}{n=n+1;split($0,arr," ");name=arr[1];s+=arr[2];ss+=arr[2]*arr[2]}END{print "'${vals[k]}'",name,s/n,sqrt(ss/n-s*s/n/n)}'; done;done|awk '{meas=$1;reg=$2;mean=$3;sd=$4;if(arr[reg])arr[reg]=arr[reg]",";arr[reg]=arr[reg]meas":{m:"mean",s:"sd"}"}END{n=0;for(i in arr)n++;j=0;for(i in arr){printf i":{"arr[i]"}";j++;if(j<n)print","}}'|sed -E 's/([a-zA-Z]+)/"\1"/g';echo "}" > population_mean_sd.json

# not used yet, but should also calc for rh separately
# vals=( NumVert SurfArea GrayVol ThickAvg ThickStd MeanCurv GausCurv FoldInd CurvInd );echo -n "{";for ((k=0;k<9;k++)); do filename=${vals[k]};j=$((k+2));for ((i=54;i<88;i++)); do find . -name rh.aparc.stats|while read f; do awk 'NR=='$i'{print $1,$'$j'}' $f;done|awk 'BEING{s=0;ss=0;n=0}{n=n+1;split($0,arr," ");name=arr[1];s+=arr[2];ss+=arr[2]*arr[2]}END{print "'${vals[k]}'",name,s/n,sqrt(ss/n-s*s/n/n)}'; done;done|awk '{meas=$1;reg=$2;mean=$3;sd=$4;if(arr[reg])arr[reg]=arr[reg]",";arr[reg]=arr[reg]meas":{m:"mean",s:"sd"}"}END{n=0;for(i in arr)n++;j=0;for(i in arr){printf i":{"arr[i]"}";j++;if(j<n)print","}}'|sed -E 's/([a-zA-Z]+)/"\1"/g';echo "}" > population_msd_rh.json
